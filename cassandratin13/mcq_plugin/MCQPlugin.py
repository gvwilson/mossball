import anywidget
import traitlets
import pathlib

ROOT_DIR = pathlib.Path(__file__).parent.parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"

class MultipleChoice(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "mcq.js"
    _widget_css = pathlib.Path(__file__).parent / "mcq.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )
    question = traitlets.Unicode(default_value="Choose an option")
    options = traitlets.List(default_value=["Option 1", "Option 2", "Option 3", "Option 4"]).tag(sync=True)
    currOption = traitlets.Int(-1).tag(sync=True)
    correctOption = traitlets.Int(0).tag(sync=True)
