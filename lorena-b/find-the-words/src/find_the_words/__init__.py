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


class WordSearch(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"
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
                f"gridWidth and gridHeight must be at least {
                    longest_word_length}"
            )
