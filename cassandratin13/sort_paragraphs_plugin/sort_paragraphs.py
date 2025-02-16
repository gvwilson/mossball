import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _(create_stp):
    import marimo as mo
    from sort_paragraphs_widget import create_stp
    from callbacks import get_question
    
    question, texts = get_question()
    create_stp(question, texts)


if __name__ == "__main__":
    app.run()
