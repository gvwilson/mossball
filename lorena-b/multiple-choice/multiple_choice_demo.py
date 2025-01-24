import marimo

__generated_with = "0.10.16"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _():
    from multiple_choice import MultipleChoiceWidget

    custom_options = [
        {"value": 1, "label": "Option 1", "correct": True},
        {"value": 2, "label": "Option 2", "correct": False},
        {"value": 3, "label": "Option 3", "correct": False},
        {"value": 4, "label": "Option 4", "correct": False},
    ]

    question_text = "Select the correct option:"

    widget = MultipleChoiceWidget(options=custom_options, title=question_text)

    widget
    return MultipleChoiceWidget, custom_options, question_text, widget


if __name__ == "__main__":
    app.run()
