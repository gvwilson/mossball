# Drag the Words

A plugin where users can fill in the blanks of the questions by dragging the words to the correct positions.

## Current Support Status

As by now, the plugin can perform the following actions:
1. Dragging words to blank boxes for the correct number of times it appears in the question
2. Resetting all the answer boxes to empty
3. Verifying answers + displaying the correct and incorrect answers with score
4. Retrying the question + Keeping the correct answers in place
5. Restart the question if the user gets all the answers correct

## Data Format

To display the plugin properly, it requires the following data as in an object/dictionary format:
```
{
    "instruction": "string",
    "question": "string",
    "choices": ["word1", "word2", ..., "wordN"]
}
```

For `question`, for the word that you want to make it as blank answer box, you should replace with `{{}}`. (Please check the sample data below)
For `choices`, you should pass the words in the right order that it appears in the question. When rendering the plugin, it will randomize the order of this list.


### Sample Data
```
    {
        "instruction": "Finish the following",
        "question":    (
            "Kelly is a {{}} scientist, and she is working on a project to study the {{}} system. "
            "She is interested in the {{}} of the {{}} system."
        ),
        "choices":  [ "computer", "operating", "performance", "file"]
    }
```

## Check your work

You can check your changes on this plugin by running either one of the commands on Terminal:
- Under the `mossball` root directory: run `marimo edit eun-chae-s/drag-the-words/implementation/drag_the_words.py`
- Under the current `eun-chae-s/drag-the-words/implementation` directory: run `marimo edit drag_the_words.py`


## Possible Enhancements

1. The option to show the solution
2. Reduce restriction on the order of words in one sentence