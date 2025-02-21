import anywidget
import traitlets
import pathlib

assets_dir = pathlib.Path(__file__).parent / "assets"

ROOT_DIR = pathlib.Path(__file__).parent.parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"

class StructureStripWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "str.js"
    _widget_css = pathlib.Path(__file__).parent / "str.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )
    sections = traitlets.List().tag(sync=True)
    user_inputs = traitlets.Dict().tag(sync=True)
    title = traitlets.Unicode().tag(sync=True)
    description = traitlets.Unicode().tag(sync=True)
    image_path = traitlets.Unicode().tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        image_path = assets_dir / "london.jpg"
        self.image_path = self._file_to_data_url(image_path)
        #str(assets_dir / "london.jpg")
        #self.set("image_path", self.image_path)

    def _file_to_data_url(self, file_path):
        import base64
        mime_type = "image/jpeg"
        data = base64.b64encode(file_path.read_bytes()).decode("utf-8")
        return f"data:{mime_type};base64,{data}"