# Contributing to Marimo Project

## Testing
### How to set up tests
1. Make sure that all the required packages are installed via `uv pip install -e ".[dev]"`
2. If you want to write UI tests using Selenium:
    - Create a Marimo notebook by typing `marimo edit tests/notebooks/{name of notebook}` on Terminal
    - Inside the notebook, add any plugins that you want to test (see other notebook files as an example)
    - If you want to test backend-supported plugin, then in `conftest.py`, add the mock response data (see `dummy_data` as an example)
    - Add any functions that mock the desired backend calls, like how `mock_verify_plugin` and `mock_get_plugin` do
    - Create a test file under `tests/testfiles`
    - Write any testing scenarios that you want

### How to run the tests
1. Make sure that all the required packages are installed via `uv pip install -e ".[dev]"`
2. Under the root directory `mossball`, run `pytest` to run all the tests
    - If you want to run a specific test file, run `pytest tests/testfiles/{test file name}`
    - If you want to run a specific test case under the specific file, run `pytest tests/testfiles/{test file name}::{test function name}`
