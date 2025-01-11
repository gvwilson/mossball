import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    mo.md("# Marimo demo")
    return (mo,)


@app.cell
def _(mo):
    from mydemo import Widget

    widget = mo.ui.anywidget(Widget())

    widget
    return Widget, widget


if __name__ == "__main__":
    app.run()
