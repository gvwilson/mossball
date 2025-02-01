import marimo

__generated_with = "0.10.11"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import anywidget
    import traitlets
    return anywidget, mo, traitlets


@app.cell
def _(anywidget, traitlets):
    class DragWordsWidget(anywidget.AnyWidget):
        _esm = "drag_the_words.js"
        _css = "drag_the_words.css"
        data = traitlets.Dict({}).tag(sync=True)
    return (DragWordsWidget,)


@app.cell
def _(DragWordsWidget):
    data = {
        "instruction": "Drag the words to the correct positions",
        "question": "In a multitasking operating system, {{VAR1}} share the CPU by using {{VAR2}} such as Round Robin and First Come, First Served. The OS also manages {{VAR3}}, ensuring that each process has access to the necessary {{VAR4}}. To prevent {{VAR5}}, it employs techniques like resource ordering and {{VAR6}}",
        "solution": ["processes", "scheduling algorithms", "memory allocation", "resources", "deadlocks", "preemption"]
    }

    DragWordsWidget(data=data)
    return (data,)


if __name__ == "__main__":
    app.run()
