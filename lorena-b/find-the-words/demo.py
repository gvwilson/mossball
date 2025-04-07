import marimo

__generated_with = "0.12.2"
app = marimo.App(width="medium")


@app.cell
def _(__file__):
    import sys
    import os

    # Add the project root to sys.path
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))

    from widgets import create_widget
    return create_widget, os, sys


@app.cell
def _(create_widget):
    data = {
        "title": "Select the words in the grid below:",
        "words": ["Apple", "Orange", "Banana", "Pineapple"],
        "instructions": "Click and drag the words on the grid to select them",
        "config": {
            "gridWidth": 15,  # dimensions must fit the longest word
            "gridHeight": 15,
            "gameMode": {
                "timed": False,
                "countdown": 60,  # in seconds, ignored if timed is false
            },
            "barColor": "green",  # accept any valid css color
            "seed": 1234, # optional seed to keep the grid constant
        },
    }

    input_data = {
        "widget": "find_words",
        "data": data
    }

    create_widget(input_data)
    return data, input_data


if __name__ == "__main__":
    app.run()
