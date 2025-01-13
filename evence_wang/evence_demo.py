import marimo

__generated_with = "0.10.12"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import os
    from dotenv import load_dotenv
    from openai import OpenAI
    import random
    from SimpleWidget.src.simple_widget import EvenceWidget
    return EvenceWidget, OpenAI, load_dotenv, mo, os, random


@app.cell
def _(mo):
    mo.md(
        """
        # Hello World and welcome to my demo!

        Let's explore Marimo together!
        """
    )
    return


@app.cell
def _(__file__, load_dotenv, os):
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
    return


@app.cell
def _(mo):
    name = mo.ui.text()
    return (name,)


@app.cell
def _(mo, name):
    mo.md(
        'Please enter your name: {}'.format(name)
    )
    return


@app.cell
def _(mo, name):
    mo.md("# Welcome {}, let's begin!".format(name.value)) if name.value else None
    return


@app.cell
def _(mo, name):
    adventure_choice = mo.ui.radio(
        options=["Explore a forest", "Dive into the ocean", "Climb a mountain"],
        label='Choose your adventure:'
    ) if name.value else None
    adventure_choice
    return (adventure_choice,)


@app.cell
def _(adventure_choice, mo, name):
    mo.md(
        "Alright, {}! You’ve chosen to **{}**. Exciting choice!" \
        .format(name.value, adventure_choice.value.lower())
    ) if name.value and adventure_choice.value else None
    return


@app.cell
def _(adventure_choice, mo, name):
    results = {
        "Explore a forest": "🌲🌲🌲 You find yourself surrounded by tall trees and the crisp sounds of birds chirping! 🐦🐦🐦",
        "Dive into the ocean": "🐠🐠🐠 You swim with colorful tropical fish and discover a hidden treasure chest on the bottom of the ocean floor! 💎💎💎",
        "Climb a mountain": "🗻🗻🗻 The view from the top is breathtaking, you sit as you watch the sunrise! 🌅🌅🌅",
    }
    selected_res = {
        "Let's see what you've got! Open the accordion...": results[adventure_choice.value]
    } if name.value and adventure_choice.value else {}
    mo.accordion(selected_res, multiple=False) if name.value and adventure_choice.value else None
    return results, selected_res


@app.cell
def _(OpenAI, adventure_choice, name, os, random):
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"), 
    )
    def generate_fun_fact(adventure_type):
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"Generate a short, interesting fun fact about {adventure_type}.",
                }
            ],
            model="gpt-4o",
        )
        return response.choices[0].message.content.strip()

    if name.value and adventure_choice.value:
        chosen_fact = generate_fun_fact(adventure_choice.value)
        adventures = ["Explore a forest", "Dive into the ocean", "Climb a mountain"]
        next_adventure = random.choice([a for a in adventures if a != adventure_choice.value])
        next_fact = generate_fun_fact(next_adventure)
    return (
        adventures,
        chosen_fact,
        client,
        generate_fun_fact,
        next_adventure,
        next_fact,
    )


@app.cell
def _(adventure_choice, chosen_fact, mo, name, next_adventure, next_fact):
    mo.accordion(
        {
            f"Fun fact about the adventure you chose: ({adventure_choice.value}):": chosen_fact,
            f"Fun fact about an adventure you could try next time: ({next_adventure}):": next_fact,
        },
        multiple=True
    ) if name.value and adventure_choice.value else None
    return


@app.cell
def _(mo, name):
    mo.md(
        '''
        ## Thank you for joining the adventure {}!

        Evence is happy to have guided you on this cool journey. Until next time! 🚀
        '''.format(name.value)
    ).callout(kind="info") if name.value else None
    return


@app.cell
def _(EvenceWidget, mo):
    widget = mo.ui.anywidget(EvenceWidget())
    return (widget,)


@app.cell
def _(widget):
    widget
    return


if __name__ == "__main__":
    app.run()
