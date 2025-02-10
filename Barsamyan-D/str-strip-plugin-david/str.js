function render({ model, el }) {
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);

    const container = document.createElement("div");
    container.className = "structure-strip";
    const userInputs = model.get("user_inputs") || {};

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    // Add title and description
    const title = document.createElement("h2");
    title.textContent = model.get("title");
    title.className = "structure-title";

    const image = document.createElement("img");
    image.src = model.get("image_path");
    image.alt = "London";
    image.className = "structure-image";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-size-btn";
    toggleBtn.textContent = "+";

    toggleBtn.addEventListener("click", () => {
        imageContainer.classList.toggle("enlarged");
        toggleBtn.textContent = imageContainer.classList.contains("enlarged") ? "-" : "+";
    });

    const description = document.createElement("p");
    description.textContent = model.get("description");
    description.className = "structure-description";

    imageContainer.append(image, toggleBtn);
    container.appendChild(title);
    container.appendChild(imageContainer);
    container.appendChild(description);

    model.get("sections").forEach((section) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "structure-section";

        // Left Column
        const leftCol = document.createElement("div");
        leftCol.className = "section-left";

        // Create a container for label + button
        const headerRow = document.createElement("div");
        headerRow.style.display = "flex";
        headerRow.style.justifyContent = "space-between";
        headerRow.style.alignItems = "center";
        headerRow.style.marginBottom = "8px";

        const prompt = document.createElement("div");
        prompt.className = "section-prompt";
        prompt.innerHTML = `<strong>${section.label}</strong>`;

        const questionBtn = document.createElement("button");
        questionBtn.className = "question-btn";
        questionBtn.textContent = "?";
        questionBtn.style.marginLeft = "12px";

        headerRow.append(prompt, questionBtn);
        
        // Instructions Dropdown
        const instructionsDropdown = document.createElement("div");
        instructionsDropdown.className = "instructions-dropdown";
        instructionsDropdown.innerHTML = `
            <div style="color: #2d3748; font-size: 0.9rem;">
                <p style="margin: 0 0 8px 0;">${section.prompt}</p>
                ${section.max_length ? `<div style="color: #4a5568; font-size: 0.85rem;">Minimum characters: ${section.max_length}</div>` : ''}
            </div>
        `;

        // Toggle dropdown
        questionBtn.addEventListener("click", () => {
            instructionsDropdown.classList.toggle("active");
        });

        leftCol.append(headerRow, instructionsDropdown);

        // Right Column
        const rightCol = document.createElement("div");
        rightCol.className = "section-content";

        const textarea = document.createElement("textarea");
        textarea.placeholder = "Enter your content...";
        textarea.rows = section.rows || 3;

        if (section.max_length) {
            const counter = document.createElement("div");
            counter.className = "char-counter";
            counter.textContent = `Number of characters: 0`;

            const feedback = document.createElement("div");
            feedback.className = "feedback";
            feedback.style.display = "none";

            textarea.addEventListener("input", (e) => {
                const text = e.target.value;

                counter.textContent = `Number of characters: ${e.target.value.length}`;
                userInputs[section.id] = e.target.value;
                model.set("user_inputs", { ...userInputs });
                model.save_changes();
                feedback.style.display = "none";
            });

            rightCol.append(textarea, counter, feedback);
        } else {
            textarea.addEventListener("input", (e) => {
                userInputs[section.id] = e.target.value;
                model.set("user_inputs", { ...userInputs });
                model.save_changes();
            });
            rightCol.appendChild(textarea);
        }

        sectionDiv.append(leftCol, rightCol);
        container.appendChild(sectionDiv);
    });

    // Button Container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    // Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.className = "submit-btn";
    submitBtn.textContent = "Check";
    submitBtn.addEventListener("click", () => {
        model.get("sections").forEach((section, index) => {
            const text = userInputs[section.id] || "";
            const feedback = container.querySelectorAll(".feedback")[index];

            if (section.max_length) {
                const remaining = section.max_length - text.length;
                feedback.textContent = remaining > 0
                    ? `✖ Need at least ${remaining} more characters`
                    : "✔ Section complete!";
                feedback.style.color = remaining > 0 ? "#dc3545" : "#28a745";
                feedback.style.display = "block";
            }
        });
    });

    // Copy Button
    const copyBtn = document.createElement("button");
    copyBtn.className = "submit-btn";
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", () => {
        const allText = model.get("sections")
            .map(section => userInputs[section.id] || "")
            .join("\n\n");

        navigator.clipboard.writeText(allText).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    buttonContainer.append(submitBtn, copyBtn);
    container.appendChild(buttonContainer);
    el.appendChild(container);
}

export default { render };