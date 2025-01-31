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
        _esm = """
        function render({ model, el }) {
            const container = document.createElement("div");
            container.className = "structure-strip";
            
            model.get("sections").forEach((section, index) => {
                const sectionDiv = document.createElement("div");
                sectionDiv.className = "structure-section";
                
                const prompt = document.createElement("div");
                prompt.className = "section-prompt";
                prompt.innerHTML = `<strong>${section.label}</strong>: ${section.prompt}`;
                
                const content = document.createElement("div");
                content.className = "section-content";
                
                const textarea = document.createElement("textarea");
                textarea.placeholder = section.placeholder || "Enter your content here...";
                textarea.rows = section.rows || 3;
                
                if (section.max_length) {
                    const counter = document.createElement("div");
                    counter.className = "char-counter";
                    counter.textContent = `0/${section.max_length}`;
                    
                    textarea.addEventListener("input", (e) => {
                        const text = e.target.value;
                        if (section.max_length && text.length > section.max_length) {
                            e.target.value = text.substring(0, section.max_length);
                        }
                        counter.textContent = `${e.target.value.length}/${section.max_length}`;
                        model.set("user_inputs", {
                            ...model.get("user_inputs"),
                            [section.id]: e.target.value
                        });
                        model.save_changes();
                    });
                    
                    content.append(textarea, counter);
                } else {
                    textarea.addEventListener("input", (e) => {
                        model.set("user_inputs", {
                            ...model.get("user_inputs"),
                            [section.id]: e.target.value
                        });
                        model.save_changes();
                    });
                    content.appendChild(textarea);
                }
                
                sectionDiv.append(prompt, content);
                container.appendChild(sectionDiv);
            });
            
            el.appendChild(container);
        }

        export default { render };
        """
        
        _css = """
        .structure-strip {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 1rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #f8f9fa;
        }
        
        .structure-section {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 1rem;
            padding: 1rem;
            background: white;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .section-prompt {
            font-size: 0.9em;
            color: #444;
        }
        
        .section-content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .section-content textarea {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-family: inherit;
            resize: vertical;
        }
        
        .char-counter {
            font-size: 0.8em;
            color: #666;
            text-align: right;
        }
        
        .section-content textarea:focus {
            border-color: #2196F3;
            outline: none;
            box-shadow: 0 0 0 2px rgba(33,150,243,0.2);
        }
        """
        
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