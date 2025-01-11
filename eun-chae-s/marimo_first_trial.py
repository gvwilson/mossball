import marimo

__generated_with = "0.10.11"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _():
    import marimo as mo
    mo.md("# Rachel's First Marimo Notebook")
    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md("""I'm going to implement some short Python code and AnyWidget plugin""")
    return


@app.cell
def _(mo):
    mo.md(r"""## Simple Python code""")
    return


@app.cell
def _(mo, x, y, z):
    mo.md(
        f"""
        simple calculation: {x, y, z}
        """
    )
    return


@app.cell
def _(y):
    z = 10 * y
    return (z,)


@app.cell
def _(x):
    y = x + 5
    return (y,)


@app.cell
def _():
    x = 10
    return (x,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Plugin 1""")
    return


@app.cell
def _():
    import anywidget
    import traitlets

    class BannerWidget(anywidget.AnyWidget):
        _esm = """
        function render({ model, el }) {
          let input = document.createElement("input");
          input.id = "banner-input";
          input.type = "text";
          input.placeholder = "Type any message";

          let banner = document.createElement("div");
          banner.id = "banner";

          let button = document.createElement("button");
          button.innerHTML = `Send!`;
          button.addEventListener("click", () => {
            banner.innerHTML = `${input.value}`;
            input.value = "";
            model.save_changes();
          });

          el.classList.add("banner-widget");

          el.appendChild(input);
          el.appendChild(button);
          el.appendChild(banner);
        }
        export default { render };
        """
        _css = """
        .banner-widget button { color: white; font-size: 1rem; background-color: #13bab5; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; margin-left: 10px; } #banner { color: #13bab5; font-size: 1.5rem; font-weight: bold; } input { border: 1px solid #13bab5; border-radius: 0.25rem; font-size: 1rem; padding-left: 10px; }
        .banner-widget button:hover { background-color: #1a827f; }
        """
        # value = traitlets.Int(0).tag(sync=True)
        message = traitlets.Unicode("").tag(sync=True)

    BannerWidget()
    return BannerWidget, anywidget, traitlets


@app.cell
def _(mo):
    name = mo.ui.text(placeholder="Your name here")
    return (name,)


@app.cell
def _(mo, name):
    button = mo.ui.button(value=name.value, label="Click!", kind="neutral")
    mo.md(
      f"""
      ### Marimo Version:
      Hi! What's your name?

      {name} {button}
      """
    )
    return (button,)


@app.cell
def _(button, mo):
    mo.md(
        f"""
        Hi, my name is {button.value}. Nice to meet you {mo.icon('noto:hand-with-fingers-splayed')}
        """
    )
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""## Plugin 2""")
    return


@app.cell
def _(anywidget, traitlets):
    class ToggleWidget(anywidget.AnyWidget):
        _esm = """
        function render({ model, el }) {
          let container = document.createElement("div");
          container.className = model.get("turned_on") ? "turned_on" : "turned_off";

          let button = document.createElement("button");
          button.innerHTML = `${model.get("turned_on") ? "On" : "Off"}`;
          button.className = model.get("turned_on") ? "turned_on" : "turned_off";

          button.addEventListener("click", () => {
            model.set("turned_on", model.get("turned_on") ? false : true);
            button.className = model.get("turned_on") ? "turned_on" : "turned_off";
            button.innerHTML = `${model.get("turned_on") ? "On" : "Off"}`;
            container.className = model.get("turned_on") ? "turned_on" : "turned_off";
            model.save_changes();
          });

          el.classList.add("toggle-widget");
          container.appendChild(button);
          el.appendChild(container);
        }
        export default { render };
        """
        _css = """
         .toggle-widget {
             div {
                width: 100%;
                height: 100px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                &.turned_on {
                    background-color: #e6bc02;
                }

                &.turned_off {
                    background-color: black;
                }
             }
             button {
                padding: 10px;
                border-radius: 4px;
                font-size: 1rem;
                background-color: white;

                &.turned_on {
                    border: 1px solid black;
                    color: black;
                }

                &.turned_off {
                    border: 1px solid #e6bc02;
                    color: #e6bc02;
                }
             }
         }
        """
        turned_on = traitlets.Bool(False).tag(sync=True)
    return (ToggleWidget,)


@app.cell
def _(ToggleWidget):
    # on => light bulb, off => dark bulb
    ToggleWidget()
    return


@app.cell
def _(ToggleWidget):
    ToggleWidget(turned_on=True)
    return


@app.cell
def _(mo):
    switch_get, switch_set = mo.state(False)
    switch = mo.ui.switch(value=switch_get(), label="Turned on" if switch_get() else "Turned off", on_change=switch_set)
    return switch, switch_get, switch_set


if __name__ == "__main__":
    app.run()
