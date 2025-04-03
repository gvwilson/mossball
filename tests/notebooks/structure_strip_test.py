import marimo

__generated_with = "0.11.31"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _(__file__):
    import sys
    import os

    # Add the project root to sys.path
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))

    from widgets import create_str
    from sessions.login import LoginWidget, StudentLoginWidget

    login_widget = LoginWidget()
    login_widget.institution_id = "inst2"  # Ensure 'inst2' exists
    login_widget.login()

    login = StudentLoginWidget()
    login.institution_id = "inst2"
    login.student_id = "1"
    login.login()

    create_str("4")
    return (
        LoginWidget,
        StudentLoginWidget,
        create_str,
        login,
        login_widget,
        os,
        sys,
    )


@app.cell
def _():
    import json
    from frontend.widgets import create_widget

    # Load non-backend JSON data (ensure the file path is correct)
    with open('tests/notebooks/non_backend_data.json', 'r') as file:
        questions = json.load(file)

    # Create the widget with the custom CSS applied.
    create_widget(questions["2"])
    return questions

if __name__ == "__main__":
    app.run()