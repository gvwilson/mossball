import pathlib
import anywidget
import traitlets
import requests
import random

class Widget():
    def __init__(self, institution_id, unique_id, plugin_type):
        self.institution_id = institution_id
        self.unique_id = unique_id
        self.plugin_type = plugin_type
        self.data = self.fetch_data()

    def fetch_data(self):
        url = f"http://localhost:5001/plugin/query/{self.institution_id}/{self.unique_id}?plugin_type={self.plugin_type}"
        try:
            response = requests.get(url)
            return response.json()
        except requests.RequestException as e:
            print(f"Error: {str(e)}")
            return {}


class SortTheParagraphs(anywidget.AnyWidget, Widget):
    _widget_dir = pathlib.Path(__file__).parent
    _module_dir = _widget_dir
    _esm = _module_dir / "stp.js"
    _css = _module_dir / "stp.css"
    question = traitlets.Unicode(default_value="Sort the texts")
    texts = traitlets.List(
        default_value=["Text 1", "Text 2", "Text 3", "Text 4"]).tag(sync=True)
    institution_id = traitlets.Unicode("inst001").tag(sync=True)
    unique_id = traitlets.Unicode("1").tag(sync=True)
    plugin_type = traitlets.Unicode("sort_paragraphs").tag(sync=True)
    data = traitlets.Dict().tag(sync=True)

    def __init__(self, institution_id, unique_id):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, institution_id, unique_id, "sort_paragraphs")
        
        self.question = self.data.get("question")
        original = self.data.get("texts")
        self.texts = original[:]

        if len(self.texts) > 1:
            while self.texts == original:
                random.shuffle(self.texts)

def create_stp(unique_id):
    return SortTheParagraphs("inst001", unique_id)

