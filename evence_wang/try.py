import marimo

__generated_with = "0.10.12"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    from SimpleWidget.src.simple_widget import EvenceWidget
    return EvenceWidget, mo


@app.cell
def _(EvenceWidget, mo):
    widget = mo.ui.anywidget(EvenceWidget())
    return (widget,)


@app.cell
def _(widget):
    widget
    return


if __name__ == "__main__":
    app.run()
