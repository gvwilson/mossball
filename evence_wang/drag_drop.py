import marimo

__generated_with = "0.11.0"
app = marimo.App(width="medium")


@app.cell
def _():
    from FileUploaderModule.FileUploader import FileUploader

    uploader = FileUploader(multiple=True, to_disk=True, cloud_only=True)
    return FileUploader, uploader


@app.cell
def _(uploader):
    uploader
    return


@app.cell
def _(uploader):
    uploader.names()
    return


@app.cell
def _(uploader):
    uploader.contents(0, True)
    return


if __name__ == "__main__":
    app.run()
