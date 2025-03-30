import marimo

__generated_with = "0.11.17"
app = marimo.App(width="medium")


@app.cell
def _(__file__):
    import sys
    import os

    # Add the project root to sys.path
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))

    from widgets import create_stp
    from sessions.login import LoginWidget, StudentLoginWidget

    login_widget = LoginWidget()
    login_widget.institution_id = "inst2" # need to create `inst2`
    login_widget.login()

    login = StudentLoginWidget()
    login.institution_id = "inst2"
    login.student_id = "1"
    login.login()

    create_stp("2")
    return (
        LoginWidget,
        StudentLoginWidget,
        create_stp,
        login,
        login_widget,
        os,
        sys,
    )


@app.cell
def _():
    import json
    from frontend.widgets import create_widget

    with open('tests/notebooks/non_backend_data.json', 'r') as file:
        questions = json.load(file)

    create_widget(questions["3"])
    return create_widget, file, json, questions


if __name__ == "__main__":
    app.run()
