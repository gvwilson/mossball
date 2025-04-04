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

## Possible Enhancements

- Expanding the multiple choice to be multi-select (multiple correct options instead of only one)




