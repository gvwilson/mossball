import marimo


__generated_with = "0.10.12"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo

    mo.md("#David's Marimo Notebook Plugin Demo")
    return (mo,)


@app.cell
def _(mo):
    f_name = mo.ui.text()
    l_name = mo.ui.text()
    mo.md(f"###Name: {f_name} <br> Last Name: {l_name}")
    return f_name, l_name


@app.cell
def _(mo):
    date = mo.ui.date()
    mo.md(f"###Date: {date}")
    return date



@app.cell
def _(mo):
    mo.md("##Custom Scatter Plot Generator")
    return mo



@app.cell
def _(mo):
    x_length = mo.ui.number(value=10)
    y_length = mo.ui.number(value=10)

    num_points = mo.ui.slider(1, 50)

    mo.md(f"###Axis Lengths: <br> Enter the length of the X-axis: {x_length} <br> Enter the length of the Y-axis: {y_length} <br> Number of Points: {num_points}")
    return num_points, x_length, y_length


@app.cell
def _(mo):
    colours = ["Red", "Green", "Blue"]
    colour = mo.ui.dropdown(options=colours)
    mo.md(f"###Choose a colour for the graph: {colour}")
    return colour, colours


@app.cell
def _(mo):
    title = mo.ui.text()
    mo.md(f"###Choose title for graph: {title}")
    return (title,)


@app.cell
def _(num_points, x_length, y_length):
    import numpy

    x_coords = numpy.random.uniform(0, x_length.value, num_points.value)
    y_coords = numpy.random.uniform(0, y_length.value, num_points.value)
    return numpy, x_coords, y_coords


@app.cell
def _(colour, mo, title, x_coords, y_coords):
    import matplotlib.pyplot as plt
    import numpy as np
    import io
    import base64

    fig, ax = plt.subplots()
    ax.scatter(x_coords, y_coords, color=colour.value, marker="o")
    ax.set_xlim(0, max(x_coords) + 1)
    ax.set_ylim(0, max(y_coords) + 1)
    ax.set_xlabel("X-axis")
    ax.set_ylabel("Y-axis")
    ax.set_title(title.value)
    ax.grid(True)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    img_tag = f'<img src="data:image/png;base64,{img_str}" />'
    mo.md(img_tag)
    return ax, base64, buf, fig, img_str, img_tag, io, np, plt


@app.cell
def _(mo, date, f_name, l_name):
    mo.md(f"""{f_name.value} {l_name.value}'s Scatter plot made on {date.value}.""")
    return mo


@app.cell
def _(mo):
    mo.md(f"""AnyWidget counter with Dynamically adjusted confetti.""")
    return mo


@app.cell
def _():
    import anywidget
    import traitlets

    class CounterWidget(anywidget.AnyWidget):
        _esm = "index.js"
        _css = "index.css"
        value = traitlets.Int(0).tag(sync=True)

    w = CounterWidget()
    w.value = 0
    w
    return w, anywidget, traitlets
 


if __name__ == "__main__":
    app.run()
