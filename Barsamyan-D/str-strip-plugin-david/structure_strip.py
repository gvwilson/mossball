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
    import pathlib

    assets_dir = pathlib.Path(__file__).parent / "assets"

    class StructureStripWidget(anywidget.AnyWidget):
        _esm = "str.js"
        _css = "str.css"
            
        sections = traitlets.List().tag(sync=True)
        user_inputs = traitlets.Dict().tag(sync=True)
        title = traitlets.Unicode().tag(sync=True)
        description = traitlets.Unicode().tag(sync=True)
        image_path = traitlets.Unicode().tag(sync=True)

        def __init__(self, **kwargs):
            super().__init__(**kwargs)
            image_path = assets_dir / "london.jpg"
            self.image_path = self._file_to_data_url(image_path)
            #str(assets_dir / "london.jpg")
            #self.set("image_path", self.image_path)
        
        def _file_to_data_url(self, file_path):
            import base64
            mime_type = "image/jpeg"
            data = base64.b64encode(file_path.read_bytes()).decode("utf-8")
            return f"data:{mime_type};base64,{data}"
        
    structure_strip = StructureStripWidget(
        title="London Docklands Evaluation",
        description="Make yourself familiar with the Docklands in London that underwent major changes. To what extend was the Docklands Regeneration successful? Your evaluation of the successes and the failures each should be roughly three times the size of your introduction and your conclusion.",
        sections=[
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
    )

    structure_strip

    return structure_strip,

if __name__ == "__main__":
    app.run()