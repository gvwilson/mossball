import marimo

__generated_with = "0.11.7"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import anywidget
    import traitlets
    return anywidget, mo, traitlets


@app.cell
def _():
    from DragWordsWidget import DragWordsWidget
    return (DragWordsWidget,)


@app.cell
def _(DragWordsWidget):
    data = {
        "instruction": "Drag the words to the correct positions",
        "question": "In a multitasking operating system, {{processes}} share the CPU by using {{scheduling algorithms}} such as Round Robin and First Come, First Served. The OS also manages {{memory allocation}}, ensuring that each process has access to the necessary {{resources}}. To prevent {{deadlocks}}, it employs techniques like resource ordering and {{preemption}}."
    }

    DragWordsWidget(data=data)
    return (data,)


@app.cell
def _(DragWordsWidget):
    data2 = {
        "instruction": "Drag the words to the correct positions",
        "question": "1. Plants need {{light}} for photosynthesis.\n2. Boiling {{water}} produces steam.\n 3. The sun provides {{light}} and {{heat}} to Earth.\n 4. Hydroelectric dams generate {{energy}} from flowing {{water}}.\n 5. Fire releases {{heat}} and {{light}}."
    }

    DragWordsWidget(data=data2)
    return (data2,)


if __name__ == "__main__":
    app.run()
