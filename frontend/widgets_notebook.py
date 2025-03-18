import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo

    mo.md("""
    # Welcome to our demo! 👩‍🏫📚
    """)
    return (mo,)

@app.cell(hide_code=True)
def _(mo):
    mo.md(
        """
        ### **From this project... ✨**
        Our goal is to create **interactive learning experiences**, which allow students to explore different tools that enhance their learning and help instructors with student engagement and evaluation.
        """
    )
    return


@app.cell
def _():
    from sessions.login import StudentLoginWidget

    login = StudentLoginWidget()
    login.institution_id = "inst1"
    login.student_id = "1"
    login.login()
    return StudentLoginWidget, login


@app.cell(hide_code=True)
def _(__file__):
    import sys
    from pathlib import Path
    import importlib

    # Set the project root folder dynamically
    project_root = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(project_root))  # Add project root to sys.path

    # Now import the plugins
    from evence_wang.FileUploaderModule.FileUploader import FileUploader
    return FileUploader, Path, importlib, project_root, sys


@app.cell
def _():
    from widgets import create_ftw
    create_ftw("6")
    return (create_ftw,)


@app.cell
def _():
    from widgets import create_mc

    create_mc("3")
    return (create_mc,)


@app.cell
def _():
    from widgets import create_str

    create_str("4")
    return (create_str,)


@app.cell(hide_code=True)
def _(FileUploader):
    uploader = FileUploader(multiple=True, to_disk=True, cloud_only=True)
    return (uploader,)


@app.cell
def _(uploader):
    uploader
    return


@app.cell
def _(uploader):
    uploader.contents(0, True)
    return


@app.cell
def _():
    from widgets import create_drag

    create_drag("5")
    return (create_drag,)


@app.cell
def _():
    from widgets import create_stp

    create_stp("1")
    return (create_stp,)


if __name__ == "__main__":
    app.run()
