import pathlib
import anywidget
import traitlets
import requests


class Widget():
    def __init__(self, institution_id, unique_id, plugin_type):
        self.institution_id = institution_id
        self.unique_id = unique_id
        self.plugin_type = plugin_type

        self.get_question()

    def get_question(self):
        url = f"http://localhost:5001/plugin/query/{self.institution_id}/{self.unique_id}?plugin_type={self.plugin_type}"
        response = requests.get(url)
        self.data = response.json()


class SortTheParagraphs(anywidget.AnyWidget):
    _widget_dir = pathlib.Path(__file__).parent
    _module_dir = _widget_dir
    _esm = _module_dir / "stp.js"
    _css = _module_dir / "stp.css"
    question = traitlets.Unicode(default_value="Sort the texts")
    sorted_texts = traitlets.List(
        default_value=["Text 1", "Text 2", "Text 3", "Text 4"]).tag(sync=True)


def create_stp():
    widget = Widget(
        institution_id="inst001",
        unique_id=1,
        plugin_type="sort_paragraphs"
    )

    question = widget.data.get("question")
    texts = widget.data.get("texts")
    return SortTheParagraphs(question=question, sorted_texts=texts)
