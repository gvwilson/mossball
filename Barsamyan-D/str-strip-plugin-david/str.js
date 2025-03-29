import tippy from "https://esm.sh/tippy.js@6";

function render({ model, el }) {
  const data = model.get("data");
  const uniqueId = data["unique_id"] || "1";
  const pluginType = data["plugin_type"] || "structure_strip";

  const styleSheet = document.createElement("style");
  document.head.appendChild(styleSheet);
  const container = createContainer();
  const userInputs = model.get("user_inputs") || {};

  // Create image section
  const { imageContainer, title, description } = createImageSection(model, data);
  container.append(title, imageContainer, description);

  // Create input sections
  const sections = data["sections"]
  sections.forEach((section) => {
    const sectionDiv = createSection(section, userInputs, model);
    container.appendChild(sectionDiv);
  });

  // Create buttons
  const buttonContainer = createButtonContainer(model, userInputs, container, uniqueId, pluginType, sections);
  container.appendChild(buttonContainer);
  el.appendChild(container);
}


/**
 * Create an info tooltip button for the Structure Strip widget.
 * This button will display additional instructions when hovered.
 * @returns {HTMLElement} The info tooltip button element.
 */
function createInfoTooltip() {
  const infoButton = document.createElement("button");
  infoButton.className = "info-tooltip";
  infoButton.textContent = "i";

  tippy(infoButton, {
      content: "Enter your content for each section. Provide detailed instructions as needed.",
      allowHTML: true,
      interactive: true,
      arrow: true,
      placement: "right",
      onShow(instance) {
          const tooltipBox = instance.popper.querySelector(".tippy-box");
          if (tooltipBox) {
              tooltipBox.style.width = "max-content";
              tooltipBox.style.textAlign = "left";
              tooltipBox.style.maxWidth = "max-content";
          }
      }
  });

  return infoButton;
}


/**
 * Creates the main container element for the widget
 * @returns {HTMLDivElement} The container div element with class 'structure-strip'
 */
function createContainer() {
  const container = document.createElement("div");
  container.className = "structure-strip";
  return container;
}

/**
 * Creates the image section components including container, title, image, and description
 * @param {DOMWidgetModel} model The widget model
 * @param {Object} data - The widget data containing title, image path, and description
 * @returns {Object} Object containing imageContainer, title, and description elements
 */
function createImageSection(model, data) {
  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";

  const headerContainer = document.createElement("div");
  headerContainer.style.display = "flex";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.alignItems = "flex-start";

  const title = document.createElement("h2");
  title.textContent = data["title"];
  title.className = "structure-title title";

  const infoTooltip = createInfoTooltip();

  headerContainer.appendChild(title);
  headerContainer.appendChild(infoTooltip);

  const image = document.createElement("img");
  image.src = model.get("image_path");
  image.alt = "London";
  image.className = "structure-image";

  const toggleBtn = createToggleButton(imageContainer);
  imageContainer.append(image, toggleBtn);

  const description = document.createElement("p");
  description.textContent = data["description"];
  description.className = "structure-description instruction";

  return { imageContainer, title: headerContainer, description };
}

/**
 * Creates and configures the image toggle button
 * @param {HTMLElement} imageContainer - The container element for the image
 * @returns {HTMLButtonElement} Configured toggle button with click handler
 */
function createToggleButton(imageContainer) {
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "toggle-size-btn";
  toggleBtn.textContent = "+";

  toggleBtn.addEventListener("click", () => {
    imageContainer.classList.toggle("enlarged");
    toggleBtn.textContent = imageContainer.classList.contains("enlarged")
      ? "-"
      : "+";
  });

  return toggleBtn;
}

/**
 * Creates a complete section with left and right columns
 * @param {Object} section - Section data from model
 * @param {Object} userInputs - User input storage object
 * @param {Object} model - The main data model
 * @returns {HTMLDivElement} Complete section element with all components
 */
function createSection(section, userInputs, model) {
  const sectionDiv = document.createElement("div");
  sectionDiv.className = "structure-section";

  const leftCol = createLeftColumn(section);
  const rightCol = createRightColumn(section, userInputs, model);

  sectionDiv.append(leftCol, rightCol);
  return sectionDiv;
}

/**
 * Creates the left column of a section with prompt and instructions
 * @param {Object} section - Section data from model
 * @returns {HTMLDivElement} Left column element with header and instructions
 */
function createLeftColumn(section) {
  const leftCol = document.createElement("div");
  leftCol.className = "section-left";

  const headerRow = document.createElement("div");
  headerRow.style.cssText =
    "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;";

  const prompt = document.createElement("div");
  prompt.className = "section-prompt";
  prompt.innerHTML = `<strong>${section.label}</strong>`;

  const questionBtn = document.createElement("button");
  questionBtn.className = "question-btn";
  questionBtn.textContent = "?";
  questionBtn.style.marginLeft = "12px";

  const instructionsDropdown = createInstructionsDropdown(section);
  questionBtn.addEventListener("click", () =>
    instructionsDropdown.classList.toggle("active")
  );

  headerRow.append(prompt, questionBtn);
  leftCol.append(headerRow, instructionsDropdown);

  return leftCol;
}

/**
 * Creates the instructions dropdown element for a section
 * @param {Object} section - Section data from model
 * @returns {HTMLDivElement} Instructions dropdown element with formatted content
 */
function createInstructionsDropdown(section) {
  const instructionsDropdown = document.createElement("div");
  instructionsDropdown.className = "instructions-dropdown";
  instructionsDropdown.innerHTML = `
        <div style="color: #2d3748; font-size: 0.9rem;">
            <p style="margin: 0 0 8px 0;">${section.prompt}</p>
            ${
              section.max_length
                ? `<div style="color: #4a5568; font-size: 0.85rem;">Minimum characters: ${section.max_length}</div>`
                : ""
            }
        </div>
    `;
  return instructionsDropdown;
}

/**
 * Creates the right column with textarea and optional character counter
 * @param {Object} section - Section data from model
 * @param {Object} userInputs - User input storage object
 * @param {Object} model - The main data model
 * @returns {HTMLDivElement} Right column element with input components
 */
function createRightColumn(section, userInputs, model) {
  const rightCol = document.createElement("div");
  rightCol.className = "section-content";
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Enter your content...";
  textarea.rows = section.rows || 3;

  if (section.max_length) {
    const { counter, feedback } = createTextAreaWithCounter(
      textarea,
      section,
      userInputs,
      model
    );
    rightCol.append(textarea, counter, feedback);
  } else {
    textarea.addEventListener(
      "input",
      createInputHandler(section, userInputs, model)
    );
    rightCol.appendChild(textarea);
  }

  return rightCol;
}

/**
 * Creates textarea with character counter and feedback elements
 * @param {HTMLTextAreaElement} textarea - The textarea element to enhance
 * @param {Object} section - Section data from model
 * @param {Object} userInputs - User input storage object
 * @param {Object} model - The main data model
 * @returns {Object} Object containing counter and feedback elements
 */
function createTextAreaWithCounter(textarea, section, userInputs, model) {
  const counter = document.createElement("div");
  counter.className = "char-counter";
  counter.textContent = `Number of characters: 0`;

  const feedback = document.createElement("div");
  feedback.className = "feedback";
  feedback.style.display = "none";

  textarea.addEventListener("input", (e) => {
    const text = e.target.value;
    counter.textContent = `Number of characters: ${text.length}`;
    userInputs[section.id] = text;
    model.set("user_inputs", { ...userInputs });
    model.save_changes();
    feedback.style.display = "none";
  });

  return { counter, feedback };
}

/**
 * Creates input handler function for textareas without character limits
 * @param {Object} section - Section data from model
 * @param {Object} userInputs - User input storage object
 * @param {Object} model - The main data model
 * @returns {Function} Input event handler function
 */
function createInputHandler(section, userInputs, model) {
  return (e) => {
    userInputs[section.id] = e.target.value;
    model.set("user_inputs", { ...userInputs });
    model.save_changes();
  };
}

/**
 * Creates container for action buttons (Submit and Copy)
 * @param {Object} model - The main data model
 * @param {Object} userInputs - User input storage object
 * @param {HTMLElement} container - Main container element for feedback lookup
 * @param {String} uniqueId The ID of the question
 * @param {String} pluginType The type of widget
 * @param {DOMWidgetModel} model The widget model
 * @returns {HTMLDivElement} Button container with styled action buttons
 */
function createButtonContainer(model, userInputs, container, uniqueId, pluginType, sections) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const submitBtn = createSubmitButton(model, userInputs, container, sections, uniqueId, pluginType);
  const copyBtn = createCopyButton(model, userInputs);

  buttonContainer.append(submitBtn, copyBtn);
  return buttonContainer;
}

/**
 * Creates and configures the submit/check button
 * @param {Object} model - The main data model
 * @param {Object} userInputs - User input storage object
 * @param {HTMLElement} container - Main container element for feedback lookup
 * @param {String} uniqueId The ID of the question
 * @param {String} pluginType The type of widget
 * @param {DOMWidgetModel} model The widget model
 * @returns {HTMLButtonElement} Configured submit button with click handler
 */
function createSubmitButton(model, userInputs, container, sections, uniqueId, pluginType) {
  const submitBtn = document.createElement("button");
  submitBtn.className = "check-button";
  submitBtn.textContent = "Check";
    
  submitBtn.addEventListener("click", () => {
    let userAnswer = {};
    sections.forEach((section, index) => {
      const text = userInputs[section.id] || "";
      userAnswer[section.id] = text;
      const feedback = container.querySelectorAll(".feedback")[index];

      if (section.max_length) {
        const remaining = section.max_length - text.length;
        if (remaining > 0) {
          feedback.textContent = `Need at least ${remaining} more characters`;
          feedback.classList.remove("correct");
          feedback.classList.add("incorrect");
        } else {
          feedback.textContent = "Section complete!";
          feedback.classList.remove("incorrect");
          feedback.classList.add("correct");
        }
        feedback.style.display = "block";
      }
    });
    model.send({
      command: "verify",
      plugin_type: pluginType || "structure_strip",
      unique_id: uniqueId || "1",
      answer: userAnswer
    })
  });

  return submitBtn;
}

/**
 * Creates and configures the copy button with temporary feedback
 * @param {Object} model - The main data model
 * @param {Object} userInputs - User input storage object
 * @returns {HTMLButtonElement} Configured copy button with click handler
 */
function createCopyButton(model, userInputs) {
  const copyBtn = document.createElement("button");
  copyBtn.className = "try-button";
  copyBtn.textContent = "Copy";

  copyBtn.addEventListener("click", () => {
    const allText = model
      .get("sections")
      .map((section) => userInputs[section.id] || "")
      .join("\n\n");

    navigator.clipboard.writeText(allText).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  });

  return copyBtn;
}

export default { render };
