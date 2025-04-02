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

## Plugin Development

### Find The Words

A plugin that allows users to configure play a word search game in the marimo notebook. Source code can be found [here](https://github.com/gvwilson/mossball/tree/08a43c5ffdeb3625a29f486048c14e8de443cae5/lorena-b/find-the-words).

To develop for the `find-the-words` plugin, see the instructions in the [README](https://github.com/gvwilson/mossball/blob/08a43c5ffdeb3625a29f486048c14e8de443cae5/lorena-b/find-the-words/README.md)
