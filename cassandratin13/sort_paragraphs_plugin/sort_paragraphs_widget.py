import anywidget
import traitlets

class SortTheParagraphs(anywidget.AnyWidget):
    _esm = "cassandratin13/sort_paragraphs_plugin/stp.js"
    _css = "cassandratin13/sort_paragraphs_plugin/stp.css"
    question = traitlets.Unicode(default_value="Sort the texts")
    sorted_texts = traitlets.List(default_value=["Text 1", "Text 2", "Text 3", "Text 4"]).tag(sync=True)

def create_stp(question, data):
    return SortTheParagraphs(question=question, sorted_texts=data)


