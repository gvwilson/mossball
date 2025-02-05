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
        reset = traitlets.Bool(default_value=True)

    question = "Order the steps for problem solving."
    texts = ["Understand the problem", "Make a plan", "Carry out the plan", "Look back and reflect"]

    SortTheParagraphs(question=question, sorted_texts=texts, reset=True)
    return SortTheParagraphs, anywidget, mo, question, texts, traitlets


if __name__ == "__main__":
    app.run()
