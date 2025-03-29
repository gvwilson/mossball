import marimo

__generated_with = "0.11.17"
app = marimo.App(width="full")


from pathlib import Path


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
    from find_the_words import WordSearch
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
        WordSearch,
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
    login_widget.institution_id = "inst2"  # need to create `inst2`
    login_widget.login()
    return LoginWidget, login_widget


@app.cell(hide_code=True)
def _():
    from sessions.login import StudentLoginWidget

    login = StudentLoginWidget()
    login.institution_id = "inst2"
    login.student_id = "1"
    login.login()
    return StudentLoginWidget, login


@app.cell
def _():
    from widgets import create_ftw
    CURRENT_DIR_WS = Path(__file__).resolve().parent  # 'frontend' folder
    CUSTOM_CSS_PATH_WS = CURRENT_DIR_WS / "custom_theme_orange_yellow.css"
    #change to "custom_theme_brown_beige.css" for brown beige theme
    create_ftw("6", custom_css_path=str(CUSTOM_CSS_PATH_WS))
    return (create_ftw,)


@app.cell(hide_code=True)
def _():
    from widgets import create_mc
    CURRENT_DIR_1 = Path(__file__).resolve().parent  # This gets the 'frontend' folder.
    CUSTOM_CSS_PATH_1 = CURRENT_DIR_1 / "custom_theme_orange_yellow.css"
    #change to "custom_theme_brown_beige.css" for brown beige theme

    create_mc("3", custom_css_path=str(CUSTOM_CSS_PATH_1))
    return (create_mc,)


@app.cell
def _():
    from widgets import create_str
    CURRENT_DIR_2 = Path(__file__).resolve().parent  # This gets the 'frontend' folder.
    CUSTOM_CSS_PATH_2 = CURRENT_DIR_2 / "custom_theme_orange_yellow.css"
    #change to "custom_theme_brown_beige.css" for brown beige theme

    create_str("4", custom_css_path=str(CUSTOM_CSS_PATH_2))
    return (create_str,)


@app.cell(hide_code=True)
def _(FileUploader):
    CURRENT_DIR_5 = Path(__file__).resolve().parent
    CUSTOM_CSS_PATH_5 = CURRENT_DIR_5 / "custom_theme_orange_yellow.css"
    #change to "custom_theme_brown_beige.css" for brown beige theme

    uploader = FileUploader(multiple=True, to_disk=True, cloud_only=True, custom_css_path=str(CUSTOM_CSS_PATH_5))
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
    CURRENT_DIR_3 = Path(__file__).resolve().parent  # This gets the 'frontend' folder.
    CUSTOM_CSS_PATH_3 = CURRENT_DIR_3 / "custom_theme_orange_yellow.css"
    #change to "custom_theme_brown_beige.css" for brown beige theme

    create_drag("5", custom_css_path=str(CUSTOM_CSS_PATH_3))
    return (create_drag,)


@app.cell
def _():
    from widgets import create_stp
    CURRENT_DIR_4 = Path(__file__).resolve().parent  # This gets the 'frontend' folder.
    CUSTOM_CSS_PATH_4 = CURRENT_DIR_4 / "custom_theme_orange_yellow.css"
    #change to "custom_theme_brown_beige.css" for brown beige theme

    create_stp("1", custom_css_path=str(CUSTOM_CSS_PATH_4))
    return (create_stp,)


if __name__ == "__main__":
    app.run()
