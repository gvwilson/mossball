import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _():
    from sessions.login import LoginWidget

    login_widget = LoginWidget()
    login_widget.institution_id = "inst1"
    login_widget.login()
    return LoginWidget, login_widget


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
    from widgets import create_stp

    create_stp("1")
    return (create_stp,)


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
def _(__file__):
    import marimo as mo
    import sys
    from pathlib import Path
    import importlib

    # Set the project root folder dynamically
    project_root = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(project_root))  # Add project root to sys.path

    # Now import the plugins
    # from find_the_words import WordSearch
    from cassandratin13.mcq_plugin.MCQPlugin import MultipleChoice
    from cassandratin13.sort_paragraphs_plugin.SortTheParagraphs import SortTheParagraphs
    DragWordsWidget = getattr(importlib.import_module("eun-chae-s.drag-the-words.implementation.DragWordsWidget"), "DragWordsWidget")
    # from evence_wang.FileUploaderModule.FileUploader import FileUploader
    StructureStripWidget = getattr(importlib.import_module("Barsamyan-D.str-strip-plugin-david.StructureStripWidget"), "StructureStripWidget")
    return (
        DragWordsWidget,
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
def _(StructureStripWidget):
    str_title = "London Docklands Evaluation"
    str_description = "Make yourself familiar with the Docklands in London that underwent major changes. To what extend was the Docklands Regeneration successful? Your evaluation of the successes and the failures each should be roughly three times the size of your introduction and your conclusion."
    str_sections = [
            {
                "id": "introduction",
                "label": "Introduction",
                "prompt": "Describe how the London Docklands has changed and why. Where is the London Docklands? What was the function before 1980? What happened after 1980?",
                "rows": 6,
                "max_length": 200
            },
            {
                "id": "body1",
                "label": "Successes",
                "prompt": "What were the successes of the change in function? How was the regeneration successful for the people? What were the successes of the change in land use? Keywords that you should include: hospitals, schools, facilities, infrastructure, inner city, and community. Remember to include facts and statistics to support your points.",
                "rows": 6,
                "max_length": 600
            },
            {
                "id": "body2",
                "label": "Failures",
                "prompt": "What were the failures in the change in function? How was the regeneration a failure for the people? What were the failures of the change in land use? Keywords that you should include: hospitals, schools, facilities, infrastructure, inner city, and community. Remember to include facts and statistics to support your points.",
                "rows": 6,
                "max_length": 600
            },
            {
                "id": "conclusion",
                "label": "Conclusion",
                "prompt": "Summarise the overall successes of the regeneration. Summarise the overall failures of the regeneration. To what extend was the regeneration a success overall? Use specific evidence to support your points.",
                "rows": 6,
                "max_length": 200
            }
        ]

    StructureStripWidget(
        title=str_title,
        description="Make yourself familiar with the Docklands in London that underwent major changes. To what extend was the Docklands Regeneration successful? Your evaluation of the successes and the failures each should be roughly three times the size of your introduction and your conclusion.",
        sections=str_sections
    )
    return str_description, str_sections, str_title


@app.cell(hide_code=True)
def _(DragWordsWidget):
    drag_the_words_data = {
        "instruction": "Drag the words to the correct positions",
        "question": "In a multitasking operating system, {{processes}} share the CPU by using {{scheduling algorithms}} such as Round Robin and First Come, First Served. The OS also manages {{memory allocation}}, ensuring that each process has access to the necessary {{resources}}. To prevent {{deadlocks}}, it employs techniques like resource ordering and {{preemption}}."
    }

    DragWordsWidget(data=drag_the_words_data)
    return (drag_the_words_data,)


@app.cell(hide_code=True)
def _(SortTheParagraphs):
    question = "Order the steps for problem solving."
    texts = ["Understand the problem", "Make a plan", "Carry out the plan", "Look back and reflect"]

    SortTheParagraphs(question=question, sorted_texts=texts)
    return question, texts


if __name__ == "__main__":
    app.run()
