# Structure Strip Widget
The Structure Strip widget is designed to help users organize their writing into clearly defined sections, each based on a specific prompt. It provides a scaffold for constructing a complete piece of writing by breaking it down into manageable parts. This helps students focus on one section at a time and ensures that the different segments of their text stay balanced in terms of length and content.

To run the Structure Strip widget in a notebook, you can run the command `marimo run structure_strip.py` or `marimo edit structure_strip.py` when you're in the `mossball/Barsamyan-D/str-strip-plugin-david` directory. Or you can run either the `widgets_notebook_local.py` or `widgets_notebook.py` files in the frontend folder to see the Sturucture Strip widget.
## File Organization
- JavaScript:
    - `str.js`: Contains the main driver code for the widget.
    - `str.css`: Contains the widget-specific styling.
- Python:
    - The widget class is defined in `mossball/frontend/widgets.py` as `StructureStrip`. 
    - The widget class defined in `StructureStripWidget.py` is no longer being used.
## Data Format
- `title` (`string`):
The title of the evaluation or essay.
- `description` (`string`):
A short description providing context or instructions.
- `sections` (`array<object>`):
An array of section objects. Each section should have:
    - `id` (`string`): Unique identifier for the section.
    - `label` (`string`): The header or title for the section (e.g., "Introduction").
    - `prompt` (`string`): Detailed instructions on what the user should write in this section.
    - `rows` (`integer`): Number of rows the textarea should display.
    - `max_length` (`integer`): Minimum number of characters required in this section.

Sample of this data can be found in `mossball/frontend/data.json`
## Styling
### Info Tooltip: 
A small "i" button is displayed next to the title. Hover over it to see additional instructions on how to fill in the sections.
### Image Section: 
The widget includes an image section with a toggle button for enlarging or shrinking the image.
### Sections: 
Each section is divided into two columns
- Left Column: Displays the prompt and an instructions dropdown (which shows the minimum character requirement).
- Right Column: Contains a textarea and an optional character counter. When the user types, the counter updates and feedback is provided once the check button is clicked.
### Action Buttons: 
The widget provides a “Check” button to validate responses and a “Copy” button to copy all the section texts.