import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    mo.md("# Marimo demo")
    return (mo,)


@app.cell
def _():
    from mydemo import Widget
    Widget()
    return (Widget,)


if __name__ == "__main__":
    app.run()
