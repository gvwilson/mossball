import marimo

__generated_with = "0.10.16"
app = marimo.App(width="medium")


@app.cell
def _():
    from multiple_choice import MultipleChoiceWidget

    data = {
        "title": "Select the correct option:",
        "options": [
            {"value": 1, "label": "Option 1"},
            {"value": 2, "label": "Option 2"},
            {"value": 3, "label": "Option 3"},
            {"value": 4, "label": "Option 4"},
        ],
        "correct": 1
    }

    widget = MultipleChoiceWidget(data=data)

    widget
    return MultipleChoiceWidget, data, widget


if __name__ == "__main__":
    app.run()
