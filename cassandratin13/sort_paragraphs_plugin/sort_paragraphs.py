import marimo

__generated_with = "0.11.8"
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
    import marimo as mo
    from widgets import create_stp

    create_stp("1")
    return create_stp, mo


@app.cell
def _(create_stp):
    create_stp("2")
    return


if __name__ == "__main__":
    app.run()
