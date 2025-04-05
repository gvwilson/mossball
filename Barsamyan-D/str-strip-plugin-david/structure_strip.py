# structure_strip.py

import marimo

__generated_with = "0.11.7"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _(__file__):
    import sys
    import os
    # Add the project root and the shared frontend folder to sys.path.
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend")))
    from widgets import create_local_str
    return create_local_str, os, sys


@app.cell
def _():
    from StructureStripWidget import StructureStripWidget

    data = {
        "title": "London Docklands Evaluation",
        "description": "Make yourself familiar with the Docklands in London that underwent major changes. To what extend was the Docklands Regeneration successful? Your evaluation of the successes and the failures each should be roughly three times the size of your introduction and your conclusion.",
        "sections": [
            {
                "id": "introduction",
                "label": "Introduction",
                "prompt": "Describe how the London Docklands has changed and why. Where is the London Docklands? What was the function before 1980? What happened after 1980?",
                "rows": 6,
                "max_length": 200
            },
            {
                "id": "body1",
                "label": "Successes",
                "prompt": "What were the successes of the change in function? How was the regeneration successful for the people? What were the successes of the change in land use? Keywords that you should include: hospitals, schools, facilities, infrastructure, inner city, and community. Remember to include facts and statistics to support your points.",
                "rows": 6,
                "max_length": 600
            },
            {
                "id": "body2",
                "label": "Failures",
                "prompt": "What were the failures in the change in function? How was the regeneration a failure for the people? What were the failures of the change in land use? Keywords that you should include: hospitals, schools, facilities, infrastructure, inner city, and community. Remember to include facts and statistics to support your points.",
                "rows": 6,
                "max_length": 600
            },
            {
                "id": "conclusion",
                "label": "Conclusion",
                "prompt": "Summarise the overall successes of the regeneration. Summarise the overall failures of the regeneration. To what extend was the regeneration a success overall? Use specific evidence to support your points.",
                "rows": 6,
                "max_length": 200
            }
        ]
    }
        
    return data

@app.cell
def _(create_local_str, data):
    from pathlib import Path
    CURRENT_DIR = Path(__file__).resolve().parent
    # Uncomment the following line to apply a custom theme.
    # CUSTOM_CSS_PATH = CURRENT_DIR / "custom_theme_orange_yellow.css"
    # create_local_str(data, custom_css_path=str(CUSTOM_CSS_PATH))
    
    # For now, use the default theme.
    create_local_str(data["title"], data["description"], data["sections"])
    return


if __name__ == "__main__":
    app.run()
