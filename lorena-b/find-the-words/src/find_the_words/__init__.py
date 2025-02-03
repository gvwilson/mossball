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
