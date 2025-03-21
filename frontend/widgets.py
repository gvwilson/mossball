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


class DragWordsWidget(anywidget.AnyWidget, Widget):
    _module_dir = ROOT_DIR / "eun-chae-s/drag-the-words/implementation"
    _esm = _module_dir / "drag_the_words.js"
    _widget_css = _module_dir / "drag_the_words.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join([
        _global_css.read_text(encoding="utf-8"),
        _widget_css.read_text(encoding="utf-8"),
    ])

    data = traitlets.Dict({}).tag(sync=True)
    unique_id = traitlets.Unicode("drag_words_1").tag(sync=True)
    plugin_type = traitlets.Unicode("drag_words").tag(sync=True)

    def __init__(self, unique_id):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "drag_words")

    def _handle_custom_msg(self, content, buffers):
        command = content.get("command", "")
        if command == "verify":
            plugin_type = content.get("plugin_type", "drag_words")
            unique_id = content.get("unique_id", self.unique_id)
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

    question = traitlets.Unicode(
        default_value="Choose an option"
    ).tag(sync=True)
    options = traitlets.List(
        default_value=["Option 1", "Option 2", "Option 3", "Option 4"]
    ).tag(sync=True)
    currOption = traitlets.Int(-1).tag(sync=True)
    unique_id = traitlets.Unicode("3").tag(sync=True)
    plugin_type = traitlets.Unicode("multiple_choice").tag(sync=True)
    data = traitlets.Dict().tag(sync=True)

    def __init__(self, unique_id):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "multiple_choice")

        self.question = self.data.get("question", self.question)
        self.options = self.data.get("options", self.options)

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


class StructureStrip(anywidget.AnyWidget, Widget):
    _module_dir = ROOT_DIR / "Barsamyan-D/str-strip-plugin-david"
    _esm = _module_dir / "str.js"
    _widget_css = _module_dir / "str.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )

    title = traitlets.Unicode().tag(sync=True)
    description = traitlets.Unicode().tag(sync=True)
    sections = traitlets.List().tag(sync=True)
    image_path = traitlets.Unicode().tag(sync=True)
    user_inputs = traitlets.Dict().tag(sync=True)
    unique_id = traitlets.Unicode("3").tag(sync=True)
    plugin_type = traitlets.Unicode("structure_strip").tag(sync=True)
    data = traitlets.Dict().tag(sync=True)

    def __init__(self, unique_id):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "structure_strip")
        image_path = self._module_dir / "assets" / "london.jpg"

        self.image_path = self._file_to_data_url(image_path)
        self.sections = self.data.get("sections", self.sections)
        self.title = self.data.get("title", self.title)
        self.description = self.data.get("description", self.description)
        self.user_inputs = self.data.get("user_inputs", self.user_inputs)

    def _file_to_data_url(self, file_path):
        import base64
        mime_type = "image/jpeg"
        data = base64.b64encode(file_path.read_bytes()).decode("utf-8")
        return f"data:{mime_type};base64,{data}"

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


class FindTheWords(anywidget.AnyWidget, Widget):
    _module_dir = ROOT_DIR / "lorena-b/find-the-words/src/find_the_words/static"
    _esm = _module_dir / "widget.js"
    _widget_css = _module_dir / "widget.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _css = "\n".join(
        [
            _global_css.read_text(encoding="utf-8"),
            _widget_css.read_text(encoding="utf-8"),
        ]
    )

    unique_id = traitlets.Unicode("6").tag(sync=True)
    plugin_type = traitlets.Unicode("find_words").tag(sync=True)
    data = traitlets.Dict().tag(sync=True)
    error_ = traitlets.Unicode().tag(sync=True)

    def __init__(self, unique_id):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "find_words")

        self.validate_input()

    def validate_input(self):
        # TODO: handle validation for all configuration options
        # Ensure that gridWidth and gridHeight are valid given the words
        words = self.data.get("words", [])
        config = self.data.get("config", {})
        gridWidth = config.get("gridWidth", 10)
        gridHeight = config.get("gridHeight", 10)
        longest_word_length = len(max(words, key=len))

        if gridWidth < longest_word_length or gridHeight < longest_word_length:
            raise ValueError(
                f"gridWidth and gridHeight must be at least {longest_word_length}")


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


def create_stp(unique_id):
    return SortTheParagraphs(unique_id)


def create_mc(unique_id):
    return MultipleChoice(unique_id)


def create_str(unique_id):
    return StructureStrip(unique_id)


def create_drag(unique_id):
    return DragWordsWidget(unique_id)

def create_ftw(unique_id=6):
    return FindTheWords(unique_id)