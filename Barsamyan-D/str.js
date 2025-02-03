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
        }
        .modal-content {
            position: relative;
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.5rem 1rem;
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s ease;
        }
        .modal-close:hover {
            background: #3182ce;
        }
    `;
    document.head.appendChild(styleSheet);
    
    const container = document.createElement("div");
    container.className = "structure-strip";
    const userInputs = model.get("user_inputs") || {};

    // Add title and description
    const title = document.createElement("h2");
    title.textContent = model.get("title");
    title.className = "structure-title";

    const description = document.createElement("p");
    description.textContent = model.get("description");
    description.className = "structure-description";

    container.appendChild(title);
    container.appendChild(description);

    // Create SINGLE modal instance
    let modalOverlay = document.querySelector(".modal-overlay");
    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.className = "modal-overlay";
        
        const modal = document.createElement("div");
        modal.className = "modal";
        
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        
        const modalText = document.createElement("p");
        const modalClose = document.createElement("button");
        modalClose.textContent = "Close";
        modalClose.className = "modal-close";

        modalContent.append(modalText, modalClose);
        modal.appendChild(modalContent);
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
    }

    // Modal handler
    const handleModal = (content) => {
        const [modalText, modalClose] = modalOverlay.querySelector(".modal-content").children;
        modalText.innerHTML = content;
        modalOverlay.style.display = "flex";
        
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
            <div class="prompt-text">${section.prompt}</div>
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
        textarea.placeholder = section.placeholder || "Enter your content...";
        textarea.rows = section.rows || 3;
        
        if (section.max_length) {
            const counter = document.createElement("div");
            counter.className = "char-counter";
            counter.textContent = `0/${section.max_length}`;
            
            const feedback = document.createElement("div");
            feedback.className = "feedback";
            feedback.style.display = "none";

            textarea.addEventListener("input", (e) => {
                const text = e.target.value;
                if (text.length > section.max_length) {
                    e.target.value = text.substring(0, section.max_length);
                }
                counter.textContent = `${e.target.value.length}/${section.max_length}`;
                userInputs[section.id] = e.target.value;
                model.set("user_inputs", {...userInputs});
                model.save_changes();
                feedback.style.display = "none";
            });

            rightCol.append(textarea, counter, feedback);
        } else {
            textarea.addEventListener("input", (e) => {
                userInputs[section.id] = e.target.value;
                model.set("user_inputs", {...userInputs});
                model.save_changes();
            });
            rightCol.appendChild(textarea);
        }

        sectionDiv.append(leftCol, rightCol);
        container.appendChild(sectionDiv);
    });

    // Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.className = "submit-btn";
    submitBtn.textContent = "Check Progress";
    submitBtn.addEventListener("click", () => {
        model.get("sections").forEach((section, index) => {
            const text = userInputs[section.id] || "";
            const feedback = container.querySelectorAll(".feedback")[index];
            
            if (section.max_length) {
                const remaining = section.max_length - text.length;
                feedback.textContent = remaining > 0 
                    ? `✖ Need ${remaining} more characters`
                    : "✔ Section complete!";
                feedback.style.color = remaining > 0 ? "#dc3545" : "#28a745";
                feedback.style.display = "block";
            }
        });
    });

    container.appendChild(submitBtn);
    el.appendChild(container);
}

export default { render };