function render({ model, el }) {
    const container = document.createElement("div");
    container.className = "mcq-container";
    
    // Question element
    const questionElem = document.createElement("div");
    questionElem.className = "mcq-question";
    questionElem.textContent = model.get("question");
    container.appendChild(questionElem);

    // Create buttons for choices
    let buttons = [];
    const choicesContainer = document.createElement("div");
    choicesContainer.className = "mcq-choices";
    
    model.get("choices").forEach((choice, index) => {
        const button = document.createElement("button");
        button.className = "mcq-button";
        button.textContent = choice;
        
        button.addEventListener("click", () => {
            if (!model.get("submitted")) {
                buttons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                model.set("selected", index);
                model.save_changes();
            }
        });
        
        buttons.push(button);
        choicesContainer.appendChild(button);
    });

    // Create control buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "mcq-controls";
    
    const submitButton = document.createElement("button");
    submitButton.className = "mcq-submit";
    submitButton.textContent = "Submit";
    
    const retryButton = document.createElement("button");
    retryButton.className = "mcq-retry";
    retryButton.textContent = "Retry";
    retryButton.style.display = "none";


    // Instruction element
    const instructionElem = document.createElement("div");
    instructionElem.className = "mcq-instruction";
    instructionElem.textContent = model.get("instruction");
    container.appendChild(instructionElem);

    // Submit handler
    submitButton.addEventListener("click", () => {
        model.set("submitted", true);
        model.save_changes();
    });

    // Retry handler
    retryButton.addEventListener("click", () => {
        model.set("submitted", false);
        model.set("selected", -1);
        model.save_changes();
        buttons.forEach(btn => {
            btn.classList.remove("selected", "correct", "incorrect");
        });
        retryButton.style.display = "none";
        submitButton.style.display = "inline-block";
        instructionElem.textContent = model.get("instruction");
    });

    // Update UI on state changes
    model.on("change:submitted", () => {
        if (model.get("submitted")) {
            submitButton.style.display = "none";
            retryButton.style.display = "inline-block";
            
            buttons.forEach(btn => btn.classList.remove("selected"));
            buttons.forEach((btn, idx) => {
                if (idx === model.get("selected")) {
                    btn.classList.add(model.get("is_correct") ? "correct" : "incorrect");
                    instructionElem.textContent = model.get("is_correct") ? "Correct! 🎉" : "Incorrect! 😢";
                }
            });
        }
    });

    model.on("change:is_correct", () => {
        if (model.get("submitted")) {
            buttons.forEach((btn, idx) => {
                btn.classList.remove("correct", "incorrect");
                if (idx === model.get("selected")) {
                    btn.classList.add(model.get("is_correct") ? "correct" : "incorrect");
                    instructionElem.textContent = model.get("is_correct") ? "Correct! 🎉" : "Incorrect! 😢";
                }
            });
        }
    });

    container.append(choicesContainer, buttonContainer);
    buttonContainer.append(submitButton, retryButton);
    el.appendChild(container);
}

export default { render };