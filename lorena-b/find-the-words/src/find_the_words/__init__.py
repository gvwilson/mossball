import importlib.metadata
import pathlib
import os

import anywidget
import traitlets

os.environ['ANYWIDGET_HMR'] = '1'

try:
    __version__ = importlib.metadata.version("find_the_words")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"

ROOT_DIR = pathlib.Path(__file__).parent.parent.parent.parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"

class WordSearch(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _widget_css = pathlib.Path(__file__).parent / "static" / "widget.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )
    data = traitlets.Dict().tag(sync=True)
    error_ = traitlets.Unicode().tag(sync=True)

    def __init__(self, **kwargs):
        self.validate_input(kwargs['data'])
        super().__init__(**kwargs)

    def validate_input(self, data):
        # TODO: handle validation for all configuration options
        # Ensure that gridWidth and gridHeight are valid given the words
        words = data.get("words", [])
        config = data.get("config", {})
        gridWidth = config.get("gridWidth", 10)
        gridHeight = config.get("gridHeight", 10)
        longest_word_length = len(max(words, key=len))

        if gridWidth < longest_word_length or gridHeight < longest_word_length:
            raise ValueError(
                f"gridWidth and gridHeight must be at least {longest_word_length}")
