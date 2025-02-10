function render({ model, el }) {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal {
            background: white;
            padding: 20px;
            border-radius: 5px;
            max-width: 500px;
            width: 90%;
            position: relative; /* Ensure the modal is the positioning context for the close button */
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem; /* Add space between the header and the content */
        }
        .modal-title {
            font-size: 1.5rem; /* Larger font size for the title */
            font-weight: bold;
            margin: 0; /* Remove default margin */
        }
        .modal-close {
            padding: 0.5rem 1rem;
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 999px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s ease;
        }
        .modal-close:hover {
            background: #3182ce;
        }
        .modal-content {
            margin-top: 1rem; /* Add space between the header and the content */
        }
    `;
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

    // Create SINGLE modal instance
    let modalOverlay = document.querySelector(".modal-overlay");
    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.className = "modal-overlay";

        const modal = document.createElement("div");
        modal.className = "modal";

        // Modal Header
        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header";

        const modalTitle = document.createElement("h3");
        modalTitle.className = "modal-title";

        const modalClose = document.createElement("button");
        modalClose.textContent = "Close";
        modalClose.className = "modal-close";

        modalHeader.append(modalTitle, modalClose);

        // Modal Content
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        const modalText = document.createElement("p");

        modal.append(modalHeader, modalContent);
        modalContent.appendChild(modalText);
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
    }

    // Modal handler
    const handleModal = (content) => {
        const modalTitle = modalOverlay.querySelector(".modal-title");
        const modalText = modalOverlay.querySelector(".modal-content p");
        const modalClose = modalOverlay.querySelector(".modal-close");

        // Set the title and content
        modalTitle.textContent = content.match(/<h3>(.*?)<\/h3>/)[1]; // Extract the title from the content
        modalText.innerHTML = content.replace(/<h3>.*?<\/h3>/, ""); // Remove the title from the content

        // Show the modal
        modalOverlay.style.display = "flex";

        // Close button handler
        modalClose.onclick = () => modalOverlay.style.display = "none";
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) modalOverlay.style.display = "none";
        };
    };

    model.get("sections").forEach((section) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "structure-section";

        // Left Column
        const leftCol = document.createElement("div");
        leftCol.className = "section-left";

        const prompt = document.createElement("div");
        prompt.className = "section-prompt";
        prompt.innerHTML = `
            <strong>${section.label}</strong>
        `;

        // Question Button
        const questionBtn = document.createElement("button");
        questionBtn.className = "question-btn";
        questionBtn.textContent = "?";
        questionBtn.addEventListener("click", () => {
            handleModal(`
                <h3>${section.label} Requirements</h3>
                <p>${section.prompt}</p>
                ${section.max_length ? `<p>Minimum characters: ${section.max_length}</p>` : ''}
            `);
        });

        leftCol.append(prompt, questionBtn);

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
            copyBtn.textContent = "Copied!";
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