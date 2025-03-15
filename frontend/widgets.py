import pathlib
import anywidget
import traitlets
import requests
import random
from sessions.session_manager import global_session

ROOT_DIR = pathlib.Path(__file__).parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"


class Widget():
    def __init__(self, unique_id, plugin_type):
        self.unique_id = unique_id
        self.plugin_type = plugin_type
        self.data = self.fetch_data()

    def fetch_data(self):
        url = f"http://localhost:5001/plugin/query/{self.unique_id}?plugin_type={self.plugin_type}"
        try:
            response = global_session.get(url)
            return response.json()
        except requests.RequestException as e:
            print(f"Error: {str(e)}")
            return {}


class SortTheParagraphs(anywidget.AnyWidget, Widget):
    _module_dir = ROOT_DIR / "cassandratin13/sort_paragraphs_plugin"
    _esm = _module_dir / "stp.js"
    _widget_css = _module_dir / "stp.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )

    question = traitlets.Unicode(default_value="Sort the texts").tag(sync=True)
    texts = traitlets.List(
        default_value=["Text 1", "Text 2", "Text 3", "Text 4"]).tag(sync=True)
    unique_id = traitlets.Unicode("1").tag(sync=True)
    plugin_type = traitlets.Unicode("sort_paragraphs").tag(sync=True)
    data = traitlets.Dict().tag(sync=True)

    def __init__(self, unique_id):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "sort_paragraphs")

        self.question = self.data.get("question", self.question)
        original = self.data.get("texts", self.texts)
        self.texts = original[:]

        if len(self.texts) > 1:
            while self.texts == original:
                random.shuffle(self.texts)

    def _handle_custom_msg(self, content, buffers):
        command = content.get("command", "")
        if command == "verify":
            plugin_type = content.get("plugin_type")
            unique_id = content.get("unique_id")
            answer = content.get("answer")
            try:
                response = global_session.post(
                    f"http://localhost:5001/plugin/verify/{unique_id}",
                    json={
                        "plugin_type": plugin_type,
                        "unique_id": unique_id,
                        "answer": answer
                    }
                )
                data = response.json()
                results = data.get("results", [])
            except Exception as e:
                results = []
            self.send({
                "command": "verify_result",
                "results": results
            })

class MultipleChoice(anywidget.AnyWidget, Widget):
    _module_dir = ROOT_DIR / "cassandratin13/mcq_plugin"
    _esm = _module_dir / "mcq.js"
    _widget_css = _module_dir / "mcq.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )

    question = traitlets.Unicode(default_value="Choose an option").tag(sync=True)
    options = traitlets.List(default_value=["Option 1", "Option 2", "Option 3", "Option 4"]).tag(sync=True)
    currOption = traitlets.Int(-1).tag(sync=True)
    # correctOption = traitlets.Int(0).tag(sync=True)
    unique_id = traitlets.Unicode("3").tag(sync=True)
    plugin_type = traitlets.Unicode("multiple_choice").tag(sync=True)
    data = traitlets.Dict().tag(sync=True)

    def __init__(self, unique_id):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "multiple_choice")

        self.question = self.data.get("question", self.question)
        self.options = self.data.get("options", self.question)

    def _handle_custom_msg(self, content, buffers):
        command = content.get("command", "")
        if command == "verify":
            plugin_type = content.get("plugin_type")
            unique_id = content.get("unique_id")
            answer = content.get("answer")
            try:
                response = global_session.post(
                    f"http://localhost:5001/plugin/verify/{unique_id}",
                    json={
                        "plugin_type": plugin_type,
                        "unique_id": unique_id,
                        "answer": answer
                    }
                )
                data = response.json()
                results = data.get("results", 0)
            except Exception as e:
                results = 0
            self.send({
                "command": "verify_result",
                "results": results
            })

def create_stp(unique_id):
    return SortTheParagraphs(unique_id)

def create_mc(unique_id):
    return MultipleChoice(unique_id)
