import anywidget
import traitlets
import pathlib

ROOT_DIR = pathlib.Path(__file__).parent.parent.parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"

class DragWordsWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "drag_the_words.js"
    _widget_css = pathlib.Path(__file__).parent / "drag_the_words.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )
    data = traitlets.Dict({}).tag(sync=True)