import marimo

__generated_with = "0.10.9"
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


@app.cell
def _():
    import json
    from widgets import create_widget

    with open('data.json', 'r') as file:
        questions = json.load(file)
    return create_widget, file, json, questions


@app.cell
def _(create_widget, questions):
    create_widget(questions["1"])
    return


@app.cell
def _(create_widget, questions):
    create_widget(questions["2"])
    return


@app.cell
def _(create_widget, questions):
    create_widget(questions["3"])
    return


@app.cell
def _(create_widget, questions):
    create_widget(questions["4"])
    return


@app.cell
def _(create_widget, questions):
    create_widget(questions["5"])
    return


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
def _():
    from widgets import create_local_ftw

    create_local_ftw(
        "Select the words in the grid below:",
        ["Apple", "Orange", "Banana", "Pineapple"],
        "Click and drag the words on the grid to select them",
        15,
        15,
        True,
        60,
        "green",
    )
    return (create_local_ftw,)


@app.cell
def _():
    from widgets import create_local_mc

    create_local_mc(
        "What is the capital of China?",
        ["Hong Kong", "Shanghai", "Beijing", "Tokyo"],
        2,
    )
    return (create_local_mc,)


@app.cell
def _():
    from widgets import create_local_str

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
        ]
    )
    return (create_local_str,)


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


@app.cell(hide_code=True)
def _():
    from widgets import create_local_drag

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
        ]
    )
    return (create_local_drag,)


@app.cell
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
    return (create_local_stp,)


if __name__ == "__main__":
    app.run()
