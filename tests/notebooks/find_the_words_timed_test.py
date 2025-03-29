import marimo

__generated_with = "0.11.30"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _(__file__):
    import sys
    import os

    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))

    from widgets import create_local_ftw
    return create_local_ftw, os, sys


@app.cell
def _(create_local_ftw):
    data = {
        "title": "Select the words in the grid below:",
        "words": ["Apple", "Orange", "Banana", "Pineapple"],
        "instructions": "Click and drag the words on the grid to select them",
        "config": {
            "gridWidth": 15,  # dimensions must fit the longest word
            "gridHeight": 15,
            "gameMode": {
                "timed": True,
                "countdown": 60,  # in seconds, ignored if timed is false
            },
            "barColor": "green",  # accept any valid css color
            "seed": 1234, # optional seed to keep the grid constant
        },
    }

    create_local_ftw(
        data["title"],
        data["words"],
        data["instructions"],
        data["config"]["gridWidth"],
        data["config"]["gridHeight"],
        data["config"]["gameMode"]["timed"],
        data["config"]["gameMode"]["countdown"],
        data["config"]["barColor"],
        data["config"]["seed"],
    )
    return (data,)


if __name__ == "__main__":
    app.run()
