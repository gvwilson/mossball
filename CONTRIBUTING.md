# Contributing to the Mossball Project

## First Time Setup

In the project root:

- Initalize a virtual environment with `uv venv`
- Activate the environment with `source .venv/bin/activate`
- Install the development package with `uv pip install -e ".[dev]"`

Quick start:
```zsh
uv venv && source .venv/bin/activate && uv pip install -e ".[dev]"
```

To manage project depenencies, update the `dependencies` list in `pyproject.toml`.

### Backend Setup

If using the backend server, please see this [diagram](https://github.com/gvwilson/mossball/blob/main/backends/backend-diagram.png) to understand how the plugin backend works with the frontend and institution backend.

To set up the database:

- Install [MongoDB Community Edition](https://www.mongodb.com/docs/manual/installation/) for your operating system / platform
- Within a terminal, run MongoDB using the command corresponding to your platform (read "Run MongoDB Community Edition..." in your platform's section from the link above)
- Optionally, install [mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) if you wish to use the command-line interface to interact with MongoDB

To run the plugin backend server:
- Within the virtual environment, go to the `backends/plugin `directory
- Run `python -m plugin_backend` (or possibly `py -m plugin_backend` for Windows)

To run the sample institution backend server:
- Repeat the above steps in another terminal, but using the `backends/institution/institution_backend` file instead

To create an institution in the database:
- While the backend servers are running, open the following link http://localhost:5001/ui/register in a browser
- Add the ID and base URL for the institution (to use the notebook provided in `frontend/widgets_notebook.py`, use ID "inst2" with URL "http://localhost:5002")
- To confirm that the institution was created, run `mongosh` in a terminal (if installed) and run the following commands: 
```
use plugin_backend_db
db.institutions.find()
```

## Plugin Development and Code Structure

To run all of the plugins in a single notebook:

- Go to the `frontend/` directory
- Run `marimo edit` and select a notebook

### Widgets Class

In `frontend/widgets.py`, each widget is a class than inherits from `anywidget.AnyWidget` to be compatible within the Marimo notebook, and from our custom `Widget` class defined within the same file. This parent class contains attributes common to all plugins: `unique_id`, `plugin_type`, `local_data` (optional with backend support), and `data`. It also provides a `fetch_data` method that either makes a GET request to the institution's backend, or stores the local data within the `data` field.

Each child widget class has an `__init__` method which calls its parents' initializations to populate the common attributes, and can contain further custom initializations. 

They also contain a `_handle_custom_msg` method that _must_ be defined directly within the child class (it cannot inherit the method from a parent class). This is a method from anywidget and is used for verifying the answer (either locally or through the backend) and sending back messages to display in the frontend.

For new widgets, create new classes that inherit from `anywidget.AnyWidget` and `Widget` and that contain implement `__init__`and `_handle_custom_msg` methods. Add attributes for the JS and CSS files, as well as for specific Traitlets fields that will be used by the anywidgets model.

### Widgets without Backend Support

To create a widget without backend support, you can provide the question/configuration data by directly passing in a data dictionary directly within the notebook cell, or you can upload a JSON file with the data object(s). In `frontend/widgets.py`, the `create_local_<plugin type>` functions create an instance of the specific widget's class with ID "local" to indicate that no backend is being used, and the `create_widget` function creates a local widget based on the plugin type and data provided. 

1. Pass in the data object/dictionary directly within the notebook cell
    - Example usage within a notebook:

    ```
    @app.cell
    from widgets import create_local_mc
    def _(create_local_mc):
        create_local_mc(
            "What is the capital of China?",
            ["Hong Kong", "Shanghai", "Beijing", "Tokyo"],
            2,
        )
        return
    ```
    
2. Upload a JSON file containing the data object(s)
    - At the top of the notebook, a JSON file can be opened to retrieve any number of questions and their data object (see `frontend/data.json` for an example)
    - This option allows for multiple questions to be uploaded via the JSON file and does not directly display the data contents within the notebook cells
    - Example usage using `data.json`:
    ```
    @app.cell
    def _():
        import json
        from widgets import create_widget

        with open('FILE_NAME.json', 'r') as file:
            questions = json.load(file)
        return create_widget, file, json, questions

    @app.cell
    def _(create_widget, questions):
        create_widget(questions["1"]) 
        return 
    ```
    
### Widgets with Backend Support

To create a widget that uses the backend, use the `create_<plugin type>` functions from `frontend/widgets.py`. With the given unique ID that is _not_ "local", these functions will create instances of the widget classes and will fetch the appropriate data from the backend. 

When students log in, a global session will be created to pass along their ID.

See `frontend/widgets_notebook.py` for some examples.

### Plugins

#### Drag the Words

A plugin where users can fill in the blanks of the questions by dragging the words to the correct positions.

The design document of the plugin can be found [here](https://github.com/gvwilson/mossball/blob/main/eun-chae-s/drag-the-words/design.md). Source code for rendering and styling the models can be found [here](https://github.com/gvwilson/mossball/tree/main/eun-chae-s/drag-the-words/implementation).

For the detailed instruction about the current status and how to update this plugin, please review [this README file](eun-chae-s/drag-the-words/implementation/README.md) for this plugin.

#### Find The Words

A plugin that allows users to configure play a word search game in the marimo notebook. Source code can be found [here](https://github.com/gvwilson/mossball/tree/08a43c5ffdeb3625a29f486048c14e8de443cae5/lorena-b/find-the-words).

To develop for the `find-the-words` plugin, see the instructions in the [README](https://github.com/gvwilson/mossball/blob/08a43c5ffdeb3625a29f486048c14e8de443cae5/lorena-b/find-the-words/README.md)

### FileUploader Widget

The FileUploader widget provides a drag-and-drop interface for uploading files to both local storage (disk or application memory) and AWS S3. The source code can be found in the `FileUploader` module.

#### FileUploader Features
- Drag-and-drop file upload interface
- Local file storage with progress indicators
- AWS S3 integration for cloud storage
- File deletion support for both local and S3 storage
- Bucket creation and management features
- Support for single or multiple file uploads
- Preview capabilities for images and PDFs

#### Working with the FileUploader Code

The module is organized as follows:
- `FileUploader.py`: Main Python class implementing the widget functionality
- `s3_helpers.py`: Helper functions for S3 operations
- `upload.js`: Frontend JavaScript code handling UI and interactions
- `upload.css`: Styling for the upload interface

To use the widget in a notebook:

```python
from FileUploaderModule import FileUploader

# Basic usage
uploader = FileUploader(multiple=True)

# With S3 integration
uploader = FileUploader(multiple=True, cloud_only=True)

# Display the widget
uploader
```

To access uploaded files:
```python
# Get file names
files = uploader.names()

# Get file contents (raw bytes)
content = uploader.contents(0)  # First file

# Display content (images or PDFs for now)
uploader.contents(0, display=True)
```

#### Setting Up AWS S3 Integration

To enable S3 integration, follow these steps:

1. Set the environment variable `S3_UPLOAD_ENABLED=1` in your `.env` file
2. Configure AWS credentials either using:
   - AWS CLI with `aws configure`
   - Environment variables in `.env` file (temporary configuration):
     ```
     AWS_ACCESS_KEY_ID=<access_key>
     AWS_SECRET_ACCESS_KEY=<secret_key>
     AWS_DEFAULT_REGION=<your_region>
     ```


For testing S3 functionality locally, you can use [LocalStack](https://localstack.cloud/) to mock AWS services

### Structure Strip

A plugin that help users organize their writing into clearly defined sections, each based on a specific prompt. Javascript and CSS code can be found [here](https://github.com/gvwilson/mossball/tree/main/Barsamyan-D/str-strip-plugin-david). The python widget class can be found [here](https://github.com/gvwilson/mossball/blob/main/frontend/widgets.py).

For the detailed instruction about the current status and how to update this plugin, please review this [README](https://github.com/gvwilson/mossball/tree/main/Barsamyan-D/str-strip-plugin-david/README.md) file for the plugin.

#### Multiple Choice

A plugin where users can select a single correct answer.

Source code for the plugin can be found [here](https://github.com/gvwilson/mossball/tree/main/cassandratin13/mcq_plugin).
For further development instructions, see the [README](https://github.com/gvwilson/mossball/blob/contributing-mc-stp/cassandratin13/mcq_plugin/README.md) file for this plugin.

#### Sort the Paragraphs

A plugin where users can rearrange texts in the correct order by dragging textboxes or using a dropdown to select which text to place in each position.

Source code for the plugin can be found [here](https://github.com/gvwilson/mossball/tree/main/cassandratin13/sort_paragraphs_plugin).
For further development instructions, see the [README](https://github.com/gvwilson/mossball/blob/contributing-mc-stp/cassandratin13/sort_paragraphs_plugin/README.md) file for this plugin.

## Testing
### How to set up and write tests
1. Make sure that all the required packages are installed via `uv pip install -e ".[dev]"`
2. If you need to install additional packages needed for your tests, add them in the section `[project.optional-dependencies]` in `mossball/pyproject.toml` file.
3. If you want to write UI tests using Selenium:
    - Create a Marimo notebook by typing `marimo edit tests/notebooks/{name of notebook}` on Terminal
    - Inside the notebook, add any plugins that you want to test (see other notebook files as an example)
    - If you want to test backend-supported plugin alongside your UI tests, then in `conftest.py`, add the mock response data (see `dummy_data` as an example)
    - Add any functions that mock the desired backend calls, like how `mock_verify_plugin` and `mock_get_plugin` do
    - Create a test file under `tests/testfiles`
    - Write any testing scenarios that you want
4. If you want to write unit tests for the plugin backend:
    - Add any additional helper functions to simulate the institution backend database and responses in `mock_inst.py` (currently, the mock institution data comes from `backends/institution/dummy_data.py`)
    - Add more tests for different endpoints in `test_backend.py`, or create a new file under `tests/testfiles` and be sure to use a [pytest fixture](https://flask.palletsprojects.com/en/stable/testing/) to set up the Flask test client (see `test_backend.py` for an example)
    - You can make changes to the local plugin database using MongoDB [collection methods](https://www.mongodb.com/docs/manual/reference/method/js-collection/) on the "institutions" collection, such as `db.institutions.delete_one(...)` or `db.institutions.insert_one(...)`
    - Use `client.session_transaction()` to access the session login data, and use `mock.patch()` to simulate requests to an institution backend (see `test_query_plugin` in `test_backend.py` for an example)

### How to run the tests
1. Make sure that all the required packages are installed via `uv pip install -e ".[dev]"`
2. Under the root directory `mossball`, run `pytest` to run all the tests
    - If you want to run a specific test file, run `pytest tests/testfiles/{test file name}`
    - If you want to run a specific test case under the specific file, run `pytest tests/testfiles/{test file name}::{test function name}`

## Development Tools

### Recommended Tools
- [AWS CLI](https://aws.amazon.com/cli/) for S3 configuration
- [LocalStack](https://localstack.cloud/) for local AWS service emulation

### Troubleshooting AWS Issues
- **Access Denied Errors**: Ensure your IAM user has the correct permissions (`AmazonS3FullAccess` or custom policy)
- **Bucket Already Exists**: S3 bucket names must be globally unique
- **Region Issues**: Ensure your region in AWS config matches the region in your code

## Styling
### Information on CSS Files
#### Widget-Specific CSS Files 
Each widget has its own CSS file, which defines styles specific to that widget’s layout and behavior. These files are stored in the corresponding plugin folders, named after the person who created them. Each widget python class includes its CSS file by adding it to the `_css` attribute, making sure that the styles are applied when the widget is loaded.
#### Global CSS File 
In addition to the widget-specific CSS, we have a shared global CSS file. This file provides common styles used by all widgets, such as the default button styles, title and instruction text styles, tooltip styles, and other design elements. It also defines CSS variables that are used for all the colours and these variables allow for a consistent look across all widgets and makes it easy to change the overall theme by simply overriding the values.
#### Custom Styling
Institutions can apply custom styling by providing an additional CSS file through a parameter in each widget’s constructor. When a custom CSS file is specified, it is loaded and applied after both the global and widget-specific CSS files. This ensures that any variables or styles defined in the custom CSS override the existing ones, allowing for theme customization. Currently, two predefined custom CSS files are available in the `frontend` folder: `custom_theme_brown_beige` and `custom_theme_orange_yellow`. These files include detailed comments explaining the purpose of each variable and providing instructions on how to modify them. Users can reference these examples to create their own themes by adjusting colours according to their institution's requirements. If adding a new custom theme, we recommended to follow the existing structure to ensure consistency and maintainability.

### Suggestions on Styling
- Avoid Deeply Nested Selectors: When writing CSS for new widgets, keep your selectors as flat as possible. plan the CSS so that the global styles can easily override them if needed. If styles are nested too deeply, it can be harder for the global CSS (and custom CSS overrides) to apply changes.
- Embedded SVGs: If you embed SVGs directly into your CSS (as data URIs), the colours in those SVGs are hard-coded. Changing the colour later is not as simple as changing a variable value. You may need to replace the data URI or use an alternative approach if you expect frequent theme changes. Consider using inline SVG with `currentColor` or another alternative method so that the colour can be controlled with CSS if possible.
- File Paths: When providing a custom CSS file, make sure the path is correct relative to where the widget is being used. The global CSS file is currenly located in the design-system folder at `mossball/design-system/global.css`. For the widget-specific CSS files, they are stored with the widget’s code.
