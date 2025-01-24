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
    import json

    class MultipleChoiceWidget(anywidget.AnyWidget):
        _esm = "mcq.js"
        _css = "mcq.css"

        question = traitlets.Unicode().tag(sync=True)
        choices = traitlets.List().tag(sync=True)
        _answer = traitlets.Int().tag(sync=False)
        question_id = traitlets.Unicode().tag(sync=False)
        selected = traitlets.Int(-1).tag(sync=True)
        submitted = traitlets.Bool(False).tag(sync=True)
        instruction = traitlets.Unicode().tag(sync=True)
        is_correct = traitlets.Bool(False).tag(sync=True)

        def __init__(self, **kwargs):
            with open("answers.json") as f:
                answers = json.load(f)
            kwargs["_answer"] = answers[kwargs["question_id"]]
            super().__init__(**kwargs)
            self.observe(self._validate_answer, names=["selected"])

        def _validate_answer(self, change):
            self.is_correct = (self.selected == self._answer)

    q1 = MultipleChoiceWidget(
        question_id="chemical_symbol_gold",
        question="What is the chemical symbol for gold?",
        choices=["Fe", "Ag", "Au", "Pb"],
        #answer=2,
        instruction="Select an answer and click Submit"
    )

    q1
    return MultipleChoiceWidget, anywidget, q1, traitlets


if __name__ == "__main__":
    app.run()
