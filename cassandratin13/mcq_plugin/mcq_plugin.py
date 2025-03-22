import marimo

__generated_with = "0.11.8"
app = marimo.App(width="medium")


@app.cell
def _():
    from MCQPlugin import MultipleChoice

    mcQuestion = "What is the capital city of Ontario?"
    mcOptions = ["Ottawa", "Toronto", "Vancouver", "Montreal"]
    answer = 1

    MultipleChoice(question=mcQuestion, options=mcOptions, correctOption=answer)
    return MultipleChoice, answer, mcOptions, mcQuestion


if __name__ == "__main__":
    app.run()
