import marimo

__generated_with = "0.10.12"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell
def _(mo):
    mo.md("""# Multiple Choice Widget Demo""")
    return


@app.cell
def _():
    import anywidget
    import traitlets

    class MultipleChoiceWidget(anywidget.AnyWidget):
        _esm = "mcq.js"
        _css = "mcq.css"

        question = traitlets.Unicode().tag(sync=True)
        choices = traitlets.List().tag(sync=True)
        answer = traitlets.Int().tag(sync=True)
        selected = traitlets.Int(-1).tag(sync=True)
        submitted = traitlets.Bool(False).tag(sync=True)
        instruction = traitlets.Unicode().tag(sync=True)
        is_correct = traitlets.Bool(False).tag(sync=True)

        def __init__(self, **kwargs):
            super().__init__(**kwargs)
            self.observe(self._validate_answer, names=["selected"])

        def _validate_answer(self, change):
            self.is_correct = (self.selected == self.answer)

    q1 = MultipleChoiceWidget(
        question="What is the chemical symbol for gold?",
        choices=["Fe", "Ag", "Au", "Pb"],
        answer=2,
        instruction="Select an answer and click Submit"
    )

    q1
    return MultipleChoiceWidget, anywidget, q1, traitlets


if __name__ == "__main__":
    app.run()
