# Multiple Choice

A plugin where users can select a single correct answer.

## Current Features

This plugin supports the following features:

- Selecting one choice
- Submitting answers and viewing the results (the selected choice will be marked as correct or incorrect)
- Displaying a warning pop-up if no answer was selected but the attempt was submitted


## Data Format

To display the plugin correctly, the widget requires a `data` object/dictionary containing the following keys:

- `question` (`string`): The question to display at the top of the widget
- `options` (`array<string>` or `list<string>`): The list of options to select
- `answer` (`int`): The index of the correct answer within `options` (using zero-based indexing)

Sample:
```
{
    "question": "YOUR_QUESTION_HERE",
    "options": ["CORRECT_OPTION", "OPTION2", "OPTION3", "OPTION4"],
    "answer": 0
}
```

## Developing

The JS and CSS files for developing the multiple choice plugin can be found under `cassandratin13/mcq_plugin`. For testing an example notebook with this plugin, run `marimo edit mcq_plugin.py` within the same directory. To view the version requiring backend support, follow the [instructions](https://github.com/gvwilson/mossball/blob/main/CONTRIBUTING.md) to set up the backend and database.

You can call the following functions defined in `frontend/widgets.py` to create a multiple choice widget:

- `create_mc` - using backend support ("question_num" must be defined by the institition backend)
- `create_local_mc` - without backend support, simply pass in the data directly or upload the data via a JSON file
- `create_widget` - without backend support, simply pass in the plugin type and data directly or upload via a JSON file

## Possible Enhancements

- Expanding the multiple choice to be multi-select (multiple correct options instead of only one)




