import marimo

__generated_with = "0.12.2"
app = marimo.App(width="medium")


@app.cell
def _():
    from src.find_the_words import WordSearch

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

    WordSearch(data=data)
    return WordSearch, data


if __name__ == "__main__":
    app.run()
