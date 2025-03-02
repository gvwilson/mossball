import anywidget
import traitlets
import pathlib 

ROOT_DIR = pathlib.Path(__file__).parent.parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"

class SortTheParagraphs(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "stp.js"
    _widget_css = pathlib.Path(__file__).parent / "stp.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )
    question = traitlets.Unicode(default_value="Sort the texts")
    sorted_texts = traitlets.List(default_value=["Text 1", "Text 2", "Text 3", "Text 4"]).tag(sync=True)