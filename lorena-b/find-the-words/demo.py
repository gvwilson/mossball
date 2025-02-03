import marimo

__generated_with = "0.10.18"
app = marimo.App(width="medium")


@app.cell
def _():
    from find_the_words import WordSearch

    data = {
        "title": "Select the words in the grid below:",
        "words": ["Apple", "Orange", "Banana", "Pineapple"],
        "config": {}  # TODO: support configurations
    }

    WordSearch(data=data)
    return WordSearch, data


if __name__ == "__main__":
    app.run()
