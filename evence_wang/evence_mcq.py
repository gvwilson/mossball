import marimo

__generated_with = "0.10.16"
app = marimo.App(width="medium")


@app.cell
def _():

    import marimo as mo
    return (mo,)


@app.cell
def _():
    import anywidget
    import traitlets

    class MCQWidget(anywidget.AnyWidget):
        _esm = "MCQ_Module/mcq.js"
        _css = "MCQ_Module/mcq.css"

        questions = traitlets.List().tag(sync=True)
        answers = traitlets.Dict().tag(sync=True)

    mcq_widget = MCQWidget()
    return MCQWidget, anywidget, mcq_widget, traitlets


@app.cell
def _(mcq_widget):
    mcq_widget
    return


if __name__ == "__main__":
    app.run()
