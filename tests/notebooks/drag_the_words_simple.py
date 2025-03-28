import marimo

__generated_with = "0.11.17"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _(__file__):
    import sys
    import os

    # Add the project root to sys.path
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))

    from frontend.widgets import create_drag
    from sessions.login import LoginWidget, StudentLoginWidget

    login_widget = LoginWidget()
    login_widget.institution_id = "inst2" # need to create `inst2`
    login_widget.login()

    login = StudentLoginWidget()
    login.institution_id = "inst2"
    login.student_id = "1"
    login.login()

    create_drag("5")
    return (
        LoginWidget,
        StudentLoginWidget,
        create_drag,
        login,
        login_widget,
        os,
        sys,
    )


if __name__ == "__main__":
    app.run()
