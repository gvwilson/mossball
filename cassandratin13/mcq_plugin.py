import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import anywidget
    import traitlets

    class MultipleChoice(anywidget.AnyWidget):
        _esm = "mcq.js"
        _css = "mcq.css"
        question = traitlets.Unicode(default_value="Choose an option")
        options = traitlets.List(default_value=["Option 1", "Option 2", "Option 3", "Option 4"]).tag(sync=True)
        currOption = traitlets.Int(-1).tag(sync=True)
        correctOption = traitlets.Int(0).tag(sync=True)

    mcQuestion = "What is the capital city of Ontario?"
    mcOptions = ["Ottawa", "Toronto", "Vancouver", "Montreal"]
    correct = 1

    MultipleChoice(question=mcQuestion, options=mcOptions, correctOption=correct)
    return (
        MultipleChoice,
        anywidget,
        correct,
        mcOptions,
        mcQuestion,
        mo,
        traitlets,
    )


if __name__ == "__main__":
    app.run()
