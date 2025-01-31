import marimo

__generated_with = "0.10.17"
app = marimo.App(width="medium")


@app.cell
def _(__file__):
    import os
    import anywidget
    import traitlets
    import pathlib
    import base64
    import mimetypes
    from io import BytesIO
    import io
    import fitz
    from PIL import Image, ImageOps
    import marimo

    class FileUploader(anywidget.AnyWidget):
        _widget_dir = pathlib.Path(__file__).parent
        _module_dir = _widget_dir / "FileUploaderModule"
        _esm = _module_dir / "upload.js"
        _css = _module_dir / "upload.css"

        files = traitlets.List(traitlets.Dict()).tag(sync=True)
        status = traitlets.Unicode("waiting").tag(sync=True)
        multiple = traitlets.Bool(False).tag(sync=True)
        to_disk = traitlets.Bool(False).tag(sync=True)

        def __init__(self, multiple=False, to_disk=False):
            super().__init__()
            self.multiple = multiple
            self.to_disk = to_disk
            self._temp_dir = pathlib.Path("temp")
            self._ensure_temp_dir()

            self.observe(self._handle_file_deletions, names=["files"])
            self.observe(self._process_files, names=["files"])

        def _handle_file_deletions(self, change):
            if "old" not in change:
                return

            # Find removed files that had disk storage
            old_files = {f["id"]: f for f in change["old"]}
            new_files = {f["id"]: f for f in change["new"]}

            for file_id, file_data in old_files.items():
                if file_id not in new_files and "path" in file_data:
                    try:
                        path = pathlib.Path(file_data["path"])
                        if path.exists():
                            path.unlink()
                    except Exception as e:
                        print(f"Error deleting file {file_data['path']}: {e}")

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

        def _process_files(self, change):
            new_files = []
            for file_data in change["new"]:
                processed_file = file_data.copy()
                if file_data.get("content") and file_data.get("status") == 'complete':
                    content = base64.b64decode(file_data["content"])
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
                new_files.append(processed_file)

            self.unobserve(self._process_files, names=["files"])
            self.files = new_files
            self.observe(self._process_files, names=["files"])

        def sizes(self):
            return [f["size"] for f in self.files]

        def names(self):
            return [f["name"] for f in self.files]

        def contents(self, idx=None, display=False):
            def get_content(file_data):
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

    uploader = FileUploader(multiple=True, to_disk=True)
    return (
        BytesIO,
        FileUploader,
        Image,
        ImageOps,
        anywidget,
        base64,
        fitz,
        io,
        marimo,
        mimetypes,
        os,
        pathlib,
        traitlets,
        uploader,
    )


@app.cell
def _(uploader):
    uploader
    return


@app.cell
def _(uploader):
    uploader.contents(2, True)
    return


if __name__ == "__main__":
    app.run()
