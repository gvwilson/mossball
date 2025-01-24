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
def _(__file__):
    import anywidget
    import traitlets

    class MultipleChoiceWidget(anywidget.AnyWidget):
        _esm = "mcq.js"
        _css = "mcq.css"

        question = traitlets.Unicode().tag(sync=True)
        choices = traitlets.List().tag(sync=True)
        answer = traitlets.Int().tag(sync=True)
        selected = traitlets.Int(-1).tag(sync=True)

    q1 = MultipleChoiceWidget(
        question="What is the chemical symbol for gold?",
        choices=["Fe", "Ag", "Au", "Pb"],
        answer=2
    )
    q1
    return MultipleChoiceWidget, anywidget, q1, traitlets


@app.cell
def _(mo, q1):
    # Display results
    feedback = mo.md("Select an answer above")
    if q1.selected != -1:
        is_correct = q1.selected == q1.answer
        feedback = mo.md(f"""
        **Your answer:** {q1.choices[q1.selected]}  
        {"✅ Correct!" if is_correct else "❌ Incorrect - Try again!"}
        """)
    feedback
    return feedback, is_correct


if __name__ == "__main__":
    app.run()
