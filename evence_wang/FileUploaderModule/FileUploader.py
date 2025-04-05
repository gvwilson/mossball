import os
import anywidget
import traitlets
import pathlib
import base64
import mimetypes
import io
import fitz
from PIL import Image, ImageOps
import marimo
import boto3
from uuid import uuid4
from dotenv import load_dotenv

from .s3_helpers import (
    create_bucket,
    refresh_buckets,
    upload_to_s3,
    get_from_s3,
    delete_from_s3,
)

load_dotenv()

ROOT_DIR = pathlib.Path(__file__).parent.parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"


class FileUploader(anywidget.AnyWidget):
    # S3 feature
    s3_enabled = traitlets.Bool(
        os.getenv("S3_UPLOAD_ENABLED", "0").lower() == "1").tag(sync=True)
    s3_buckets = traitlets.List(
        traitlets.Unicode(), default_value=[]).tag(sync=True)
    selected_bucket = traitlets.Unicode("").tag(sync=True)

    _widget_dir = pathlib.Path(__file__).parent
    _module_dir = _widget_dir
    _esm = _module_dir / "upload.js"

    _widget_css = _module_dir / "upload.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )
    # Values to be synced with the frontend
    files = traitlets.List(traitlets.Dict()).tag(sync=True)
    status = traitlets.Unicode("waiting").tag(sync=True)
    multiple = traitlets.Bool(False).tag(sync=True)
    to_disk = traitlets.Bool(False).tag(sync=True)
    cloud_only = traitlets.Bool(False).tag(sync=True)

    def __init__(self, multiple=False, to_disk=False, cloud_only=False, custom_css_path=None):
        super().__init__()
        self.multiple = multiple
        self.to_disk = to_disk
        self._temp_dir = pathlib.Path("temp")
        self._ensure_temp_dir()

        self._bucket_switch_in_progress = False

        self.s3 = boto3.client('s3') if self.s3_enabled else None
        if self.s3_enabled:
            self._refresh_buckets()
            self.observe(self._on_bucket_change, names=["selected_bucket"])

        if cloud_only and not self.s3_enabled:
            raise ValueError("Cloud storage is not enabled")
        self.cloud_only = cloud_only and self.s3_enabled

        self.on_msg(self._handle_frontend_msg)
        self.observe(self._handle_file_deletions, names=["files"])
        self.observe(self._process_files, names=["files"])

        default_css = "\n".join([
            self._global_css.read_text(encoding="utf-8"),
            self._widget_css.read_text(encoding="utf-8")
        ])
        if custom_css_path:
            custom_css = pathlib.Path(
                custom_css_path).read_text(encoding="utf-8")
            self._css = default_css + "\n" + custom_css
        else:
            self._css = default_css

    # S3 methods defined in s3_helpers.py
    _refresh_buckets = refresh_buckets
    _create_bucket = create_bucket
    _upload_to_s3 = upload_to_s3
    _get_from_s3 = get_from_s3
    _delete_from_s3 = delete_from_s3

    # Frontend message handler for function calls and returns
    def _handle_frontend_msg(self, _, content, buffers):
        """
        Handle incoming messages from the frontend.
        """
        method = content.get("method", "")

        if method == "switch_bucket":
            new_bucket = content.get("new_bucket", "")
            self._bucket_switch_in_progress = True
            self.files = []
            self.selected_bucket = new_bucket
            self._bucket_switch_in_progress = False
            return

        if method == "create_bucket":
            bucket_name = content.get("bucket_name", "").strip()
            if bucket_name:
                success, err_msg = self._create_bucket(bucket_name)
                if not success:
                    self.send(
                        {"method": "bucket_creation_error", "message": err_msg})
                else:
                    self.send({"method": "bucket_creation_success"})

        elif method == "refresh_buckets":
            success, err_msg = self._refresh_buckets()
            if not success:
                self.send(
                    {"method": "bucket_refresh_error", "message": err_msg})
            else:
                self.send({"method": "bucket_refresh_success"})

    # Use monitored changes to handle file deletions
    def _handle_file_deletions(self, change):
        if "old" not in change:
            return

        old_files = {f["id"]: f for f in change["old"]}
        new_files = {f["id"]: f for f in change["new"]}

        for file_id, file_data in old_files.items():
            if file_id not in new_files:
                if "path" in file_data:
                    try:
                        path = pathlib.Path(file_data["path"])
                        if path.exists():
                            path.unlink()
                    except Exception as e:
                        print(f"Error deleting file {file_data['path']}: {e}")

                if file_data.get('s3_uploaded') and 's3_bucket' in file_data and not self._bucket_switch_in_progress:
                    self._delete_from_s3(
                        file_name=file_data['name'],
                        bucket_name=file_data['s3_bucket']
                    )

    def _ensure_temp_dir(self):
        if not self._temp_dir.exists():
            self._temp_dir.mkdir(parents=True)

    def _save_to_disk(self, generated_id, content, extension=""):
        self._ensure_temp_dir()
        filename = f"{generated_id}{extension}"
        path = self._temp_dir / filename
        with open(path, "wb") as f:
            f.write(content)
        return str(path)

    # Backend processing of newly uploaded files
    def _process_files(self, change):
        new_files = []
        for file_data in change["new"]:
            processed_file = file_data.copy()
            if file_data.get("content") and file_data.get("status") == 'complete':
                content = base64.b64decode(file_data["content"])

                if not self.cloud_only:
                    # Force to disk if file is larger than 5MB
                    if self.to_disk or file_data["size"] >= 5 * 1024 * 1024:
                        _, ext = os.path.splitext(file_data["name"])
                        path = self._save_to_disk(
                            file_data['id'],
                            content,
                            ext
                        )
                        processed_file.update({
                            "path": str(path),
                            "content": "",
                        })

                # New S3 upload logic
                if self.s3_enabled:
                    try:
                        if self._upload_to_s3(file_data, self.selected_bucket):
                            processed_file['s3_uploaded'] = True
                            processed_file['s3_bucket'] = self.selected_bucket
                    except Exception as e:
                        processed_file['s3_uploaded'] = False
                        processed_file['s3_error'] = str(e)

            new_files.append(processed_file)

        # Unobserve to avoid infinite loop
        self.unobserve(self._process_files, names=["files"])
        self.files = new_files
        # Erase content to save memory if cloud_only
        if self.cloud_only:
            for file_data in self.files:
                file_data.update({'content': None})
        self.observe(self._process_files, names=["files"])

    def sizes(self):
        return [f["size"] for f in self.files]

    def names(self):
        return [f["name"] for f in self.files]

    # Display file contents in Python notebook, either printing raw content or rendering based on file type
    def contents(self, idx=None, display=False):
        def get_content(file_data):
            if self.cloud_only:
                content = self._get_from_s3(
                    file_data["name"], file_data.get("s3_bucket"))
                if not content:
                    return None
            else:
                content = self._get_from_s3(
                    file_data["name"], file_data.get("s3_bucket"))

                if not content:
                    content = (base64.b64decode(file_data["content"])
                               if file_data["content"]
                               else open(file_data["path"], "rb").read())

            if not display:
                return content

            file_type = mimetypes.guess_type(file_data["name"])[0]

            if file_type and file_type.startswith('image/'):
                return self._display_image(content, file_type)
            elif file_type == 'application/pdf':
                return self._display_pdf(content)
            else:
                return marimo.md(f"**Unsupported format:** `{file_data['name']}`")

        if idx is not None:
            return None if idx >= len(self.files) else get_content(self.files[idx])
        else:
            return [get_content(f) for f in self.files]

    # Rendering images and PDFs in Python notebook
    def _display_image(self, content, file_type, max_width=800):
        img = Image.open(io.BytesIO(content))
        img = ImageOps.exif_transpose(img)

        if img.width > max_width:
            aspect_ratio = img.height / img.width
            new_height = int(max_width * aspect_ratio)
            img = img.resize((max_width, new_height))

        img_bytes = io.BytesIO()
        img.save(img_bytes, format="JPEG", quality=85)
        img_bytes = img_bytes.getvalue()

        b64 = base64.b64encode(img_bytes).decode('utf-8')
        return marimo.md(f'![Uploaded Image](data:{file_type};base64,{b64})')

    def _display_pdf(self, content):
        doc = fitz.open(stream=content, filetype="pdf")
        imgs = []

        for page in doc:
            pix = page.get_pixmap()
            img_data = pix.tobytes("png")
            b64_img = base64.b64encode(img_data).decode('utf-8')
            imgs.append(
                '<img src="data:image/png;base64,{}" style="max-width:100%; margin-bottom: 10px;">'.format(
                    b64_img
                )
            )
        return marimo.Html("".join(imgs))

    # Fetch files within bucket from S3
    def _on_bucket_change(self, change):
        new_bucket = change["new"]
        if new_bucket:
            s3_files = self._list_files(new_bucket)
            self.files = s3_files
        else:
            self.files = []

    def _list_files(self, bucket_name):
        try:
            response = self.s3.list_objects_v2(Bucket=bucket_name)
            s3_files = []
            if "Contents" in response:
                for obj in response["Contents"]:
                    file_name = obj["Key"]
                    # Populate metadata for fetched files, do not store content
                    s3_files.append({
                        "id": str(uuid4()),
                        "name": file_name,
                        "size": obj.get("Size", 0),
                        "s3_uploaded": True,
                        "s3_bucket": bucket_name,
                        "status": "complete",
                        "progress": 100,
                        "content": "",
                        "fetched": True
                    })
            return s3_files
        except Exception as e:
            print(f"Error listing files in bucket {bucket_name}: {e}")
            return []
