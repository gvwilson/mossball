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

If using the backend server, please see this [diagram](https://raw.githubusercontent.com/gvwilson/mossball/refs/heads/contributing-backend-setup/backends/backend-diagram.png) to understand how the plugin backend works with the frontend and institution backend.

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

### Drag the Words

A plugin where users can fill in the blanks of the questions by dragging the words to the correct positions.

The design document of the plugin can be found [here](https://github.com/gvwilson/mossball/blob/main/eun-chae-s/drag-the-words/design.md). Source code for rendering and styling the models can be found [here](https://github.com/gvwilson/mossball/tree/main/eun-chae-s/drag-the-words/implementation).

For the detailed instruction about the current status and how to update this plugin, please review [this README file](eun-chae-s/drag-the-words/implementation/README.md) for this plugin.

### Find The Words

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
