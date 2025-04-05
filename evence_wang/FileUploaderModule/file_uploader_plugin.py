import marimo

__generated_with = "0.11.21"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import anywidget
    import traitlets
    return anywidget, mo, traitlets


@app.cell
def _(mo):
    mo.md(r"""### File Uploader Module""")
    return


@app.cell
def _():
    from FileUploader import FileUploader
    uploader = FileUploader(multiple=True, cloud_only=True)
    uploader
    return FileUploader, uploader


if __name__ == "__main__":
    app.run()
