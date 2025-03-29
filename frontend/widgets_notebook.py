import marimo

__generated_with = "0.11.31"
app = marimo.App(width="full")


@app.cell(hide_code=True)
def _(__file__):
    import marimo as mo
    import sys
    from pathlib import Path
    import importlib

    # Set the project root folder dynamically
    project_root = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(project_root))  # Add project root to sys.path

    # Now import the plugins
    from cassandratin13.mcq_plugin.MCQPlugin import MultipleChoice
    from cassandratin13.sort_paragraphs_plugin.SortTheParagraphs import SortTheParagraphs
    DragWordsWidget = getattr(importlib.import_module(
        "eun-chae-s.drag-the-words.implementation.DragWordsWidget"), "DragWordsWidget")
    from evence_wang.FileUploaderModule.FileUploader import FileUploader
    StructureStripWidget = getattr(importlib.import_module(
        "Barsamyan-D.str-strip-plugin-david.StructureStripWidget"), "StructureStripWidget")
    return (
        DragWordsWidget,
        FileUploader,
        MultipleChoice,
        Path,
        SortTheParagraphs,
        StructureStripWidget,
        importlib,
        mo,
        project_root,
        sys,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md("""# 📚🧑‍🏫 Welcome to our demo!👩‍🏫📚""")
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        """
        ### **From this project... ✨**
        Our goal is to create **interactive learning experiences**, which allow students to explore different tools that enhance their learning and help instructors with student engagement and evaluation.
        """
    )
    return


@app.cell(hide_code=True)
def _():
    from sessions.login import LoginWidget

    login_widget = LoginWidget()
    login_widget.institution_id = "inst1"  # need to create `inst2`
    login_widget.login()
    return LoginWidget, login_widget


@app.cell(hide_code=True)
def _():
    from sessions.login import StudentLoginWidget

    login = StudentLoginWidget()
    login.institution_id = "inst1"
    login.student_id = "1"
    login.login()
    return StudentLoginWidget, login


@app.cell
def _():
    from widgets import create_ftw
    create_ftw("6")
    return (create_ftw,)


@app.cell(hide_code=True)
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
    uploader.contents(2, True)
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
