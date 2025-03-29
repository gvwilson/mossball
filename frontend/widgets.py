import pathlib
import anywidget
import traitlets
import requests
import random
from sessions.session_manager import global_session

ROOT_DIR = pathlib.Path(__file__).parent.parent
DESIGN_SYSTEM_ROOT = ROOT_DIR / "design-system"


def load_css(*css_paths):
    """Helper function to load and join CSS contents from given file paths."""
    css_list = []
    for path in css_paths:
        css_list.append(path.read_text(encoding="utf-8"))
    return "\n".join(css_list)


class Widget():
    """
    Base class representing a classroom activity widget for Marimo.
    """
    def __init__(self, unique_id, plugin_type, local_data=None):
        """
        Initialize an instance of the widget class given the question data.

        Parameters:
        - unique_id (str): ID of the question (must be unique within the notebook if fetching questions from backend)
        - plugin_type (str): Identifier for the type of widget being created (see backends/institution/consts.py)
        - local_data (optional dict): Question data passed in directly if no backend server is used 
        """
        self.unique_id = unique_id
        self.plugin_type = plugin_type
        self.local_data = local_data
        self.data = self.fetch_data()

    def fetch_data(self):
        """
        Return the widget data from the institution's backend server, if applicable.
        Otherwise, if data is passed in locally, return the local data
        """
        if self.local_data is not None:
            return self.local_data

        url = f"http://localhost:5001/plugin/query/{self.unique_id}?plugin_type={self.plugin_type}"
        try:
            response = global_session.get(url)
            return response.json()
        except requests.RequestException as e:
            print(f"Error: {str(e)}")
            return {}


class DragWords(anywidget.AnyWidget, Widget):
    """
    A widget class for the "drag the words" plugin. 

    Attributes:
    - data (dict): Contains data for the question (either locally or from the institution's server)
    - unique_id (str): ID of the question (must be unique within the notebook)
    - plugin_type (str): Identifier for the type of widget being created (see backends/institution/consts.py)
    """
    # js and css files
    _module_dir = ROOT_DIR / "eun-chae-s/drag-the-words/implementation"
    _esm = _module_dir / "drag_the_words.js"
    _widget_css = _module_dir / "drag_the_words.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _default_css = load_css(_global_css, _widget_css)
    _css = _default_css

    data = traitlets.Dict({}).tag(sync=True)
    unique_id = traitlets.Unicode("drag_words_1").tag(sync=True)
    plugin_type = traitlets.Unicode("drag_words").tag(sync=True)

    def __init__(self, unique_id, local_data=None, custom_css_path=None):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "drag_words", local_data)
        if custom_css_path:
            custom_css = pathlib.Path(custom_css_path).read_text(encoding="utf-8")
            self._css = self._default_css + "\n" + custom_css
        else:
            self._css = self._default_css

    def _handle_custom_msg(self, content, buffers):
        command = content.get("command", "")
        if command == "verify":
            plugin_type = content.get("plugin_type", "drag_words")
            unique_id = content.get("unique_id", self.unique_id)
            answer = content.get("answer")

            if self.local_data is not None:
                stored_answer = self.local_data.get("choices", [])
                results = [answer_item == correct_item for
                           answer_item, correct_item in zip(answer, stored_answer)]
                self.send({
                    "command": "verify_result",
                    "results": results
                })
                return

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
    """
    A widget class for the "sort the paragraphs" plugin. 

    Attributes:
    - data (dict): Contains data for the question (either locally or from the institution's server)
    - unique_id (str): ID of the question (must be unique within the notebook)
    - plugin_type (str): Identifier for the type of widget being created (see backends/institution/consts.py)
    - texts (list[str]): List of shuffled text options to rearrange
    """
    # js and css files
    _module_dir = ROOT_DIR / "cassandratin13/sort_paragraphs_plugin"
    _esm = _module_dir / "stp.js"
    _widget_css = _module_dir / "stp.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _default_css = load_css(_global_css, _widget_css)
    _css = _default_css

    data = traitlets.Dict().tag(sync=True)
    unique_id = traitlets.Unicode("sort_paragraphs_1").tag(sync=True)
    plugin_type = traitlets.Unicode("sort_paragraphs").tag(sync=True)
    texts = traitlets.List(
        default_value=["Text 1", "Text 2", "Text 3", "Text 4"]).tag(sync=True)
    

    def __init__(self, unique_id, local_data=None, custom_css_path=None):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "sort_paragraphs", local_data)

        if custom_css_path:
            custom_css = pathlib.Path(custom_css_path).read_text(encoding="utf-8")
            self._css = self._default_css + "\n" + custom_css
        else:
            self._css = self._default_css


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

            if self.local_data is not None:
                stored_texts = self.local_data.get("texts", [])
                results = [answer_text == correct_text for
                           answer_text, correct_text in zip(answer, stored_texts)]

                self.send({
                    "command": "verify_result",
                    "results": results
                })
                return

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
    """
    A widget class for the "sort the paragraphs" plugin. 

    Attributes:
    - data (dict): Contains data for the question (either locally or from the institution's server)
    - unique_id (str): ID of the question (must be unique within the notebook)
    - plugin_type (str): Identifier for the type of widget being created (see backends/institution/consts.py)
    - currOption (int): Index of the currently selected option, or -1 if none or selected
    """
    # js and css files
    _module_dir = ROOT_DIR / "cassandratin13/mcq_plugin"
    _esm = _module_dir / "mcq.js"
    _widget_css = _module_dir / "mcq.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _default_css = load_css(_global_css, _widget_css)
    _css = _default_css

    data = traitlets.Dict().tag(sync=True)
    unique_id = traitlets.Unicode("multiple_choice_3").tag(sync=True)
    plugin_type = traitlets.Unicode("multiple_choice").tag(sync=True)
    currOption = traitlets.Int(-1).tag(sync=True)

    def __init__(self, unique_id, local_data=None, custom_css_path=None):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "multiple_choice", local_data)
        if custom_css_path:
            custom_css = pathlib.Path(custom_css_path).read_text(encoding="utf-8")
            self._css = self._default_css + "\n" + custom_css
        else:
            self._css = self._default_css

    def _handle_custom_msg(self, content, buffers):
        command = content.get("command", "")
        if command == "verify":
            plugin_type = content.get("plugin_type")
            unique_id = content.get("unique_id")
            answer = content.get("answer")

            if self.local_data is not None:
                stored_answer = self.local_data.get("answer", 0)
                results = 1 if answer == stored_answer else 0
                self.send({
                    "command": "verify_result",
                    "results": results
                })
                return

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
    """
    A widget class for the "structure strip" plugin. 

    Attributes:
    - data (dict): Contains data for the question (either locally or from the institution's server)
    - unique_id (str): ID of the question (must be unique within the notebook)
    - plugin_type (str): Identifier for the type of widget being created (see backends/institution/consts.py)
    - image_path (str): The path to the directory containing any images for display
    - user_inputs (dict): The user's answers
    """
    # js and css files
    _module_dir = ROOT_DIR / "Barsamyan-D/str-strip-plugin-david"
    _esm = _module_dir / "str.js"
    _widget_css = _module_dir / "str.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _default_css = load_css(_global_css, _widget_css)
    _css = _default_css
    
    data = traitlets.Dict().tag(sync=True)
    unique_id = traitlets.Unicode("3").tag(sync=True)
    plugin_type = traitlets.Unicode("structure_strip").tag(sync=True)
    image_path = traitlets.Unicode().tag(sync=True)
    user_inputs = traitlets.Dict().tag(sync=True)

    def __init__(self, unique_id, local_data=None, image_path=None, custom_css_path=None):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "structure_strip", local_data)
        if custom_css_path:
            custom_css = pathlib.Path(custom_css_path).read_text(encoding="utf-8")
            self._css = self._default_css + "\n" + custom_css
        else:
            self._css = self._default_css

        if image_path:
            self.image_path = self._file_to_data_url(pathlib.Path(image_path))
        else:
            default_image_path = self._module_dir / "assets" / "london.jpg"
            self.image_path = self._file_to_data_url(default_image_path)

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

            if self.local_data is not None:
                self.send({
                    "command": "verify_result",
                    "results": "Completed"
                })
                return

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
    """
    A widget class for the "find the words" plugin. 

    Attributes:
    - data (dict): Contains data for the question (either locally or from the institution's server)
    - unique_id (str): ID of the question (must be unique within the notebook)
    - plugin_type (str): Identifier for the type of widget being created (see backends/institution/consts.py)
    """
    _module_dir = ROOT_DIR / "lorena-b/find-the-words/src/find_the_words/static"
    _esm = _module_dir / "widget.js"
    _widget_css = _module_dir / "widget.css"
    _global_css = DESIGN_SYSTEM_ROOT / "global.css"
    _default_css = load_css(_global_css, _widget_css)
    _css = _default_css

    data = traitlets.Dict().tag(sync=True)
    unique_id = traitlets.Unicode("6").tag(sync=True)
    plugin_type = traitlets.Unicode("find_words").tag(sync=True)
    error_ = traitlets.Unicode().tag(sync=True)

    def __init__(self, unique_id, local_data=None, custom_css_path=None):
        anywidget.AnyWidget.__init__(self)
        Widget.__init__(self, unique_id, "find_words")
        if custom_css_path:
            custom_css = pathlib.Path(custom_css_path).read_text(encoding="utf-8")
            self._css = self._default_css + "\n" + custom_css
        else:
            self._css = self._default_css

        if local_data:
            self.data = local_data
        self.validate_input()

    def validate_input(self):
        """
        Check that the grid size fits all the words.
        """
        words = self.data.get("words", [])
        config = self.data.get("config", {})
        gridWidth = config.get("gridWidth", 10)
        gridHeight = config.get("gridHeight", 10)
        longest_word_length = len(max(words, key=len))

        if gridWidth < longest_word_length or gridHeight < longest_word_length:
            raise ValueError(
                f"gridWidth and gridHeight must be at least {longest_word_length}")


# Functions for creating the widgets from the instutition's backend server

def create_stp(unique_id, custom_css_path=None):
    return SortTheParagraphs(unique_id, custom_css_path=custom_css_path)

def create_mc(unique_id, custom_css_path=None):
    return MultipleChoice(unique_id, custom_css_path=custom_css_path)

def create_str(unique_id, custom_css_path=None):
    return StructureStrip(unique_id, custom_css_path=custom_css_path)

def create_drag(unique_id, custom_css_path=None):
    return DragWords(unique_id, custom_css_path=custom_css_path)

def create_ftw(unique_id=6, custom_css_path=None):
    return FindTheWords(unique_id, custom_css_path=custom_css_path)


# Functions for locally creating the widgets with id "local"

def create_local_stp(question, texts):
    local_data = {
        "question": question,
        "texts": texts
    }

    return SortTheParagraphs("local", local_data)


def create_local_mc(question, options, answer):
    local_data = {
        "question": question,
        "options": options,
        "answer": answer
    }

    return MultipleChoice("local", local_data)


def create_local_str(title, description, sections, image_path=None):
    local_data = {
        "title": title,
        "description": description,
        "sections": sections,
        "user_inputs": {}
    }

    return StructureStrip("local", local_data, image_path)


def create_local_drag(instruction, question, choices):
    local_data = {
        "instruction": instruction,
        "question": question,
        "choices": choices
    }

    return DragWords("local", local_data)

def create_local_ftw(title, words, instructions, gridWidth, gridHeight, timed, countdown, barColor, seed = None):
    local_data = {
        "title": title,
        "words": words,
        "instructions": instructions,
        "config": {
            "gridWidth": gridWidth,
            "gridHeight": gridHeight,
            "gameMode": {
                "timed": timed,
                "countdown": countdown,
            },
            "barColor": barColor,
        },
    }
    if seed:
        local_data["config"]["seed"] = seed
    return FindTheWords("local", local_data)


def create_widget(widget):
    """
    Creates and returns a widget of the given type and with the given local data.

    Parameters:
    - widget (dict): Contains the widget type with key "widget" and data with key "data" (see frontend/data.json)
    """
    widget_type = widget.get("widget", "")
    widget_data = widget.get("data", "")
    if not widget_data or not widget_type:
        return
    if widget_type == "multiple_choice":
        return MultipleChoice("local", widget_data)
    elif widget_type == "sort_paragraphs":
        return SortTheParagraphs("local", widget_data)
    elif widget_type == "drag_words":
        return DragWords("local", widget_data)
    elif widget_type == "structure_strip":
        return StructureStrip("local", widget_data, widget.get("image_path", ""))
    elif widget_type == "find_words":
        return FindTheWords("local", widget_data)