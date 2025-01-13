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
    mo.md("""## HelloWorld widget""")
    return


@app.cell
def _():
    import anywidget
    import traitlets

    class HelloWorldWidget(anywidget.AnyWidget):
        _esm = """
        const render = ({model, el}) => {
            let helloWorldText = document.createElement("h1")
            helloWorldText.textContent = "Hello World!"
            el.appendChild(helloWorldText);
            el.classList.add("demoText");
        }
        export default { render }
        """
        _css = """
        .demoText {
            font-size: 3rem;
            font-weight: bold;
        }
        .demoText:hover {
            animation: shake 0.5s ease infinite;
        }
        @keyframes shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 5px); }
          50% { transform: translate(5px, -5px); }
          75% { transform: translate(-5px, -5px); }
          100% { transform: translate(5px, 5px); }
        }
        """

    HelloWorldWidget()
    return HelloWorldWidget, anywidget, traitlets


@app.cell
def _(mo):
    mo.md("""## A simple counter widget""")
    return


@app.cell
def _():
    from mydemo import CounterWidget

    CounterWidget()
    return (CounterWidget,)


if __name__ == "__main__":
    app.run()
