# structure_strip.py
import marimo
import anywidget
import traitlets

__generated_with = "0.10.12"
app = marimo.App(width="medium")

@app.cell
def __():
    import anywidget
    import traitlets

    class StructureStripWidget(anywidget.AnyWidget):
        _esm = "str.js"
        _css = "str.css"
        
        sections = traitlets.List().tag(sync=True)
        user_inputs = traitlets.Dict().tag(sync=True)

    structure_strip = StructureStripWidget(
        sections=[
            {
                "id": "introduction",
                "label": "Introduction",
                "prompt": "State your thesis and main arguments",
                "placeholder": "In this essay, I will argue that...",
                "rows": 4,
                "max_length": 300
            },
            {
                "id": "body1",
                "label": "Body Paragraph 1",
                "prompt": "Present your first main argument with evidence",
                "rows": 6,
                "max_length": 500
            },
            {
                "id": "conclusion",
                "label": "Conclusion",
                "prompt": "Summarize your arguments and restate thesis",
                "rows": 4,
                "max_length": 300
            }
        ]
    )

    structure_strip

    return structure_strip,

if __name__ == "__main__":
    app.run()