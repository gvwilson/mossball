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
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))

    from widgets import create_stp
    return create_stp, os, sys


@app.cell
def _(mo):
    mo.md(r"""### Backend Supported Plugins""")
    return


@app.cell
def _():
    # Login as institution and student
    from sessions.login import LoginWidget
    from sessions.login import StudentLoginWidget

    login = StudentLoginWidget()
    login.institution_id = "inst2"
    login.student_id = "1"
    login.login()
    return LoginWidget, StudentLoginWidget, login, login_widget


@app.cell(hide_code=True)
def _():
    create_stp("1")
    return (create_stp,)


@app.cell
def _(mo):
    mo.md(r"""### No-Backend Plugins""")
    return

@app.cell(hide_code=True)
def _():
    from widgets import create_local_stp

    create_local_stp(
        "Arrange the following steps of the water cycle:",
        [
            "Water evaporates from the surface.",
            "Water vapor condenses to form clouds.",
            "Precipitation occurs as rain or snow.",
            "Water collects in bodies of water."
        ],
    )
    return


if __name__ == "__main__":
    app.run()
