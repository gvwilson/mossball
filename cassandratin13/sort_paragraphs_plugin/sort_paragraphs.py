import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _(create_stp):
    import marimo as mo
    from widgets import create_stp

    create_stp()


if __name__ == "__main__":
    app.run()
