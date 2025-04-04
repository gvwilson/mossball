import marimo

__generated_with = "0.11.17"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import anywidget
    import traitlets
    return anywidget, mo, traitlets


@app.cell
def _(__file__):
    import sys
    import os

    # Add the project root to sys.path
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend")))

    from widgets import DragWords
    return DragWords, os, sys


@app.cell
def _(mo):
    mo.md(r"""### Backend Supported Plugins""")
    return


@app.cell
def _():
    # Login as institution and student
    from sessions.login import LoginWidget
    from sessions.login import StudentLoginWidget

    login_widget = LoginWidget()
    login_widget.institution_id = "inst2"  # need to create `inst2`
    login_widget.login()

    login = StudentLoginWidget()
    login.institution_id = "inst2"
    login.student_id = "1"
    login.login()
    return LoginWidget, StudentLoginWidget, login, login_widget


@app.cell
def _(DragWords, __file__, os):
    CSS_FOLDER_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend"))  # This gets the 'frontend' folder.
    CUSTOM_CSS_PATH = CSS_FOLDER_DIR + "/custom_theme_brown_beige.css"

    # unique_id = the id of the question in which its data will be fetched from the backend
    DragWords("5", custom_css_path=CUSTOM_CSS_PATH)
    return CSS_FOLDER_DIR, CUSTOM_CSS_PATH


@app.cell
def _(mo):
    mo.md(r"""### No-Backend Plugins""")
    return


@app.cell
def _(CUSTOM_CSS_PATH, DragWords):
    local_data = {
        "instruction": "Drag the words to the correct positions",
          "question": "1. Plants need {{}} for photosynthesis.\n2. Boiling {{}} produces steam.\n 3. The sun provides {{}} and {{}} to Earth.\n 4. Hydroelectric dams generate {{}} from flowing {{}}.\n 5. Fire releases {{}} and {{}}.",
          "choices": [
            "light",
            "water",
            "light",
            "heat",
            "energy",
            "water",
            "heat",
            "light"
          ]
    }

    DragWords("local", local_data, custom_css_path=CUSTOM_CSS_PATH)
    return (local_data,)


if __name__ == "__main__":
    app.run()
