import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import anywidget
    import traitlets

    class SortTheParagraphs(anywidget.AnyWidget):
        _esm = "stp.js"
        _css = "stp.css"
        question = traitlets.Unicode(default_value="Sort the texts")
        sorted_texts = traitlets.List(default_value=["Text 1", "Text 2", "Text 3", "Text 4"]).tag(sync=True)

    question = "Sort the planets from closest to furthest from the Sun."
    texts = ["Mercury", "Venus", "Earth", "Mars"]

    SortTheParagraphs(question=question, sorted_texts=texts)
    return SortTheParagraphs, anywidget, mo, question, texts, traitlets


if __name__ == "__main__":
    app.run()
