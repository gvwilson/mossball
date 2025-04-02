import marimo

__generated_with = "0.12.2"
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
    from evence_wang.FileUploaderModule.FileUploader import FileUploader
    return FileUploader, Path, importlib, mo, project_root, sys


@app.cell
def _():
    import json
    from widgets import create_widget

    with open('data.json', 'r') as file:
        questions = json.load(file)
    return create_widget, file, json, questions


@app.cell
def _(Path, __file__, create_widget, questions):
    CURRENT_DIR_1 = Path(__file__).resolve().parent
    # CUSTOM_CSS_PATH_1 = CURRENT_DIR_1 / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    CUSTOM_CSS_PATH_1 = CURRENT_DIR_1 / "custom_theme_brown_beige.css" # uncomment for brown beige theme
    create_widget(questions["1"], custom_css_path=str(CUSTOM_CSS_PATH_1))  # uncomment for custom theme
    # create_widget(questions["1"])  # uncomment for default theme
    return CURRENT_DIR_1, CUSTOM_CSS_PATH_1


@app.cell
def _(Path, __file__, create_widget, questions):
    CURRENT_DIR_2 = Path(__file__).resolve().parent
    # CUSTOM_CSS_PATH_2 = CURRENT_DIR_2 / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    CUSTOM_CSS_PATH_2 = CURRENT_DIR_2 / "custom_theme_brown_beige.css" # uncomment for brown beige theme
    create_widget(questions["2"], custom_css_path=str(CUSTOM_CSS_PATH_2))  # uncomment for custom theme
    # create_widget(questions["2"])  # uncomment for default theme
    return CURRENT_DIR_2, CUSTOM_CSS_PATH_2


@app.cell
def _(Path, __file__, create_widget, questions):
    CURRENT_DIR_3 = Path(__file__).resolve().parent
    # CUSTOM_CSS_PATH_3 = CURRENT_DIR_3 / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    CUSTOM_CSS_PATH_3 = CURRENT_DIR_3 / "custom_theme_brown_beige.css" # uncomment for brown beige theme
    create_widget(questions["3"], custom_css_path=str(CUSTOM_CSS_PATH_3))  # uncomment for custom theme
    # create_widget(questions["3"])  # uncomment for default theme
    return CURRENT_DIR_3, CUSTOM_CSS_PATH_3


@app.cell
def _(Path, __file__, create_widget, questions):
    CURRENT_DIR_4 = Path(__file__).resolve().parent
    # CUSTOM_CSS_PATH_4 = CURRENT_DIR_4 / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    CUSTOM_CSS_PATH_4 = CURRENT_DIR_4 / "custom_theme_brown_beige.css" # uncomment for brown beige theme
    create_widget(questions["4"], custom_css_path=str(CUSTOM_CSS_PATH_4))  # uncomment for custom theme
    # create_widget(questions["4"])  # uncomment for default theme
    return CURRENT_DIR_4, CUSTOM_CSS_PATH_4


@app.cell
def _(Path, __file__, create_widget, questions):
    CURRENT_DIR_5 = Path(__file__).resolve().parent
    # CUSTOM_CSS_PATH_5 = CURRENT_DIR_5 / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    CUSTOM_CSS_PATH_5 = CURRENT_DIR_5 / "custom_theme_brown_beige.css" # uncomment for brown beige theme
    create_widget(questions["5"], custom_css_path=str(CUSTOM_CSS_PATH_5))  # uncomment for custom theme
    # create_widget(questions["5"])  # uncomment for default theme
    return CURRENT_DIR_5, CUSTOM_CSS_PATH_5


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


@app.cell
def _(Path, __file__):
    from widgets import create_local_ftw
    CURRENT_DIR_FTW = Path(__file__).resolve().parent
    CUSTOM_CSS_PATH_FTW = CURRENT_DIR_FTW / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    # CUSTOM_CSS_PATH_FTW = CURRENT_DIR_FTW / "custom_theme_brown_beige.css" # uncomment for brown beige theme

    create_local_ftw(
        "Select the words in the grid below:",
        ["Apple", "Orange", "Banana", "Pineapple"],
        "Click and drag the words on the grid to select them",
        15,
        15,
        False,
        60,
        "green",
        custom_css_path=str(CUSTOM_CSS_PATH_FTW),  # uncomment for custom theme
    )
    return CURRENT_DIR_FTW, CUSTOM_CSS_PATH_FTW, create_local_ftw


@app.cell
def _(Path, __file__):
    from widgets import create_local_mc
    CURRENT_DIR_MC = Path(__file__).resolve().parent
    CUSTOM_CSS_PATH_MC = CURRENT_DIR_MC / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    # CUSTOM_CSS_PATH_MC = CURRENT_DIR_MC / "custom_theme_brown_beige.css" # uncomment for brown beige theme

    create_local_mc(
        "What is the capital of China?",
        ["Hong Kong", "Shanghai", "Beijing", "Tokyo"],
        2,
        custom_css_path=str(CUSTOM_CSS_PATH_MC),  # uncomment for custom theme
    )
    return CURRENT_DIR_MC, CUSTOM_CSS_PATH_MC, create_local_mc


@app.cell
def _(Path, __file__):
    from widgets import create_local_str
    CURRENT_DIR_STR = Path(__file__).resolve().parent
    CUSTOM_CSS_PATH_STR = CURRENT_DIR_STR / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    # CUSTOM_CSS_PATH_STR = CURRENT_DIR_STR / "custom_theme_brown_beige.css" # uncomment for brown beige theme

    create_local_str(
        "Write a short paragraph about the water cycle.",
        "Make yourself familiar with the water cycle.",
        [
            {
                "id": "introduction",
                "label": "Introduction",
                "prompt": "Describe the water cycle.",
                "rows": 6,
                "max_length": 200
            },
            {
                "id": "evaporation",
                "label": "Evaporation",
                "prompt": "Describe the process of evaporation.",
                "rows": 6,
                "max_length": 200
            },
            {
                "id": "conclusion",
                "label": "Conclusion",
                "prompt": "Summarise the overall process of the water cycle.",
                "rows": 6,
                "max_length": 600
            }
        ],
        custom_css_path=str(CUSTOM_CSS_PATH_STR),  # uncomment for custom theme
    )
    return CURRENT_DIR_STR, CUSTOM_CSS_PATH_STR, create_local_str


@app.cell(hide_code=True)
def _(FileUploader, Path, __file__):
    CURRENT_DIR_FILE = Path(__file__).resolve().parent
    CUSTOM_CSS_PATH_FILE = CURRENT_DIR_FILE / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    # CUSTOM_CSS_PATH_FILE = CURRENT_DIR_FILE / "custom_theme_brown_beige.css" # uncomment for brown beige theme

    uploader = FileUploader(multiple=True, to_disk=True, cloud_only=True, custom_css_path=str(CUSTOM_CSS_PATH_FILE)) # add custom_css_path=str(CUSTOM_CSS_PATH_FILE) for custom theme
    return CURRENT_DIR_FILE, CUSTOM_CSS_PATH_FILE, uploader


@app.cell
def _(uploader):
    uploader
    return


@app.cell
def _(uploader):
    uploader.contents(2, True)
    return


@app.cell(hide_code=True)
def _(Path, __file__):
    from widgets import create_local_drag
    CURRENT_DIR_DRAG = Path(__file__).resolve().parent
    CUSTOM_CSS_PATH_DRAG = CURRENT_DIR_DRAG / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    # CUSTOM_CSS_PATH_DRAG = CURRENT_DIR_DRAG / "custom_theme_brown_beige.css" # uncomment for brown beige theme

    create_local_drag(
        "Finish the following",
        (
            "Kelly is a {{}} scientist, and she is working on a project to study the {{}} system. "
            "She is interested in the {{}} of the {{}} system."
        ),
        [
            "computer",
            "operating",
            "performance",
            "file",
        ],
        custom_css_path=str(CUSTOM_CSS_PATH_DRAG),  # uncomment for custom theme
    )
    return CURRENT_DIR_DRAG, CUSTOM_CSS_PATH_DRAG, create_local_drag


@app.cell
def _(Path, __file__):
    from widgets import create_local_stp
    CURRENT_DIR_STP = Path(__file__).resolve().parent
    CUSTOM_CSS_PATH_STP = CURRENT_DIR_STP / "custom_theme_orange_yellow.css" # uncomment for orange yellow theme
    # CUSTOM_CSS_PATH_STP = CURRENT_DIR_STP / "custom_theme_brown_beige.css" # uncomment for brown beige theme

    create_local_stp(
        "Arrange the following steps of the water cycle:",
        [
            "Water evaporates from the surface.",
            "Water vapor condenses to form clouds.",
            "Precipitation occurs as rain or snow.",
            "Water collects in bodies of water."
        ],
        custom_css_path=str(CUSTOM_CSS_PATH_STP),  # uncomment for custom theme
    )
    return CURRENT_DIR_STP, CUSTOM_CSS_PATH_STP, create_local_stp


if __name__ == "__main__":
    app.run()
