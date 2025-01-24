function render({ model, el }) {
    // Create container
    let container = document.createElement("div");
    container.className = "mcq-container";
    
    // Question element
    const questionElem = document.createElement("div");
    questionElem.className = "mcq-question";
    questionElem.textContent = model.get("question");
    container.appendChild(questionElem);

    // Create buttons for choices
    model.get("choices").forEach((choice, index) => {
        const button = document.createElement("button");
        button.className = "mcq-button";
        button.textContent = choice;
        
        button.onclick = () => {
            model.set("selected", index);
            model.save_changes();
            
            // Update styling
            container.querySelectorAll('.mcq-button').forEach(btn => {
                btn.classList.remove('correct', 'incorrect');
            });
            
            if (index === model.get("answer")) {
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
            }
        };
        
        container.appendChild(button);
    });

    el.appendChild(container);
}

export default { render };