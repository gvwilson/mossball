import marimo

__generated_with = "0.11.7"
app = marimo.App(width="medium")


@app.cell
def _():
<<<<<<< HEAD
    from sessions.login import LoginWidget
    
    login_widget = LoginWidget()
    login_widget.institution_id = "inst1"
    login_widget.login()
    return LoginWidget, login_widget
=======
    import marimo as mo
    from SortTheParagraphs import SortTheParagraphs

    question = "Order the steps for problem solving."
    texts = ["Understand the problem", "Make a plan", "Carry out the plan", "Look back and reflect"]

    SortTheParagraphs(question=question, sorted_texts=texts)
    return SortTheParagraphs, mo, question, texts
>>>>>>> test-setup


@app.cell
def _():
    from sessions.login import StudentLoginWidget

    login = StudentLoginWidget()
    login.institution_id = "inst1"
    login.student_id = "1"
    login.login()
    return StudentLoginWidget, login


@app.cell
def _():
    import marimo as mo
    from widgets import create_stp

    create_stp("1")
    return create_stp, mo



@app.cell
def _(create_stp):
    create_stp("2")
    return


if __name__ == "__main__":
    app.run()
