import importlib.metadata
import pathlib

import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("simple_widget")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class EvenceWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"
    value = traitlets.Int(0).tag(sync=True)
