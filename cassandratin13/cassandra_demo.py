import marimo

__generated_with = "0.10.9"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    mo.md(
        '''
        #Cassandra's Demo

        ##Welcome to my demo!
        '''
    )
    return (mo,)


@app.cell
def _():
    print('Hello World!')
    return


@app.cell
def _(mo):
    colours = ["red", "orange", "yellow", "green", "blue", "purple"]
    batch = mo.md(
        """
        Enter some information:

        - Name: {name}
        - Birthday: {birthday}
        - Favourite colour: {colour}
        """
        ).batch(name=mo.ui.text(), birthday=mo.ui.date(), colour=mo.ui.dropdown(options=colours))

    batch
    return batch, colours


@app.cell
def _(batch):
    if batch.elements["name"].value:
        print(f"Nice to meet you {batch.elements['name'].value}!")
    return


@app.cell
def _(mo):
    x = mo.ui.number(value=0)
    y = mo.ui.number(value=0)
    mo.md(
        f"Give two numbers: {x}, {y}."
    )
    return x, y


@app.cell
def _(mo, x, y):
    sum = x.value + y.value
    mo.md(
        f"The sum is {sum}"
    )
    return (sum,)


@app.cell
def _(mo):
    mo.accordion(
        {
            "Open me first!": "Hello",
            "Open me next!": "Goodbye"
        },
        multiple=True
    )
    return


@app.cell
def _(mo):
    slider = mo.ui.slider(start=1, stop=5, step=1)
    slider 

    mo.md(
        f"Please rate this demo on a scale of 1 to 5: {slider}"
    )
    return (slider,)


@app.cell
def _(slider):
    if slider.value <= 3:
        print("Yikes!")
    else:
        print("Wow!")
    return


@app.cell
def _():
    import anywidget
    import traitlets


    class SlidesWidget(anywidget.AnyWidget):
        _esm = "index.js"
        _css = "index.css"
        slides = traitlets.List(default_value=["Slide 1", "Slide 2", "Slide 3", "Slide 4"]).tag(sync=True)
        currSlide = traitlets.Int(0).tag(sync=True)


    SlidesWidget()
    return SlidesWidget, anywidget, traitlets


@app.cell
def _(batch, mo):
    mo.md(
        f"""
        **Thank you for looking at my demo!**

        Goodbye {batch.elements["name"].value}
        """
    ).callout(kind="success")
    return


if __name__ == "__main__":
    app.run()
