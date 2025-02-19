/**
 * Creates an HTML element with the given attributes
 * @param {String} tag The HTML tag of the element
 * @param {Objects} attributes The attributes to apply to the element
 * @param {String|Array} classNames The class(es) to apply to the element
 * @param {Array} children The children to append to the element
 * @returns The created HTML element
 */
function createElement(tag, { classNames = "", children = [], ...attrs} = {}) {
    const element = document.createElement(tag);
    if (classNames) element.classList.add(...[].concat(classNames));

    // Add rest of attributes and children
    Object.entries(attrs).forEach(([key, value]) => element[key] = value);
    children.forEach((child) => element.appendChild(child));
    return element;
}

/**
 * Create a textbox for sorting, containing the given text and ID number that corresponds to
 * the textbox's position in the array after being shuffled
 * @param {String} text The text displayed in the text box container
 * @param {Number} idNum The number that will be used to identify the textbox
 * @returns The textbox container
 */
function createRow(text, idNum) {
    let arrow = createElement("button", { classNames: "arrow-button", innerHTML: dropdownSVG });
    let dropdown = createElement("div", { classNames: "dropdown", children: [arrow] });
    let container = createElement("div", {
        classNames: ["container", "draggable"],
        textContent: text,
        draggable: "true",
        id: `text${idNum}`,
        children: [dropdown]
    });
    container.dataset.text = text;

    let icon = createElement("div", { classNames: "drag-icon", innerHTML: dragSVG });
    container.insertBefore(icon, container.firstChild);

    container.addEventListener("dragstart", () => {
        container.classList.add("dragging");
        setTimeout(() => {
            container.classList.add("placeholder");
        }, 0);
    });

    container.addEventListener("dragend", () => {
        container.classList.remove("dragging", "placeholder");
    });

    return container;
}

/**
 * Create dropdown options given the array of texts to select, which will be duplicated for each dropdown
 * @param {Array} texts Array of text options in the dropdown
 * @returns The array of button elements
 */
function createOptions(texts) {
    let options = []
    texts.forEach((text, index) => {
        let option = createElement("button", { classNames: "option", value: `text${index + 1}`, textContent: text });
        options.push(option);
    })
    return options;
}

/**
 * Create a header container with the title of the widget, instructions, and the question
 * @param {DOMWidgetModel} model The widget model
 * @param {HTMLElement} el The widget element
 * @returns Elements for the title, instructions, and question
 */
function createHeader(model, el) {
    let title = createElement("h1", { classNames: "title", textContent: "Sort the Paragraphs"});
    let description = createElement("h1", { classNames: "description", textContent: "Drag & drop or select to sort"});
    let infoContainer = createInfoContainer(el);
    let instructions = createElement("div", { classNames: "instructions", children: [infoContainer, description] });
    let question = createElement("p", { classNames: "question", innerHTML: model.get("question")});

    return [title, instructions, question]
}

/**
 * Create the info i button and the pop up container with the instruction details
 * @param {HTMLElement} el The widget element
 * @returns The container element for instructions and extra information
 */
function createInfoContainer(el) {
    let info = `Drag the sequence items on the right into their correct positions. <br>
                Alternatively, click the dropdown button to the right to select a sequence item to place in the current position.`
    let infoI = createElement("button", { classNames: "info-i", textContent: "i" });
    let infoText = createElement("div", { classNames: "info-text", innerHTML: info });

    // Display/hide the information box with instruction details
    infoI.addEventListener("click", () => {
        if (infoText.classList.contains("show")) {
            infoText.classList.remove("show");
        } else {
            infoText.classList.add("show");
        }
    });

    // Hide the information box if anywhere within the widget but outside the info element is clicked
    el.addEventListener("click", (event) => {
        if (!infoI.contains(event.target) && !infoText.contains(event.target)) {
            infoText.classList.remove("show");
        }
    });

    let infoContainer = createElement("div", { classNames: "info", children: [infoI, infoText] });
    return infoContainer;
}

/**
 * Create a unique dropdown element with the given options for the given container
 * @param {HTMLElement} container The container to which the dropdown will be added
 * @param {Array} options The array of button elements to put into the dropdown list
 * @param {HTMLElement} textsContainer The container with all the textboxes
 * @returns Elements for the dropdown list and arrow button for the container
 */
function createDropdown(container, options, textsContainer) {
    let dropdown = container.querySelector(".dropdown");
    let optionsList = createElement("div", { classNames: "option-list" });

    // Clone the list of options to make separate dropdowns for each text box
    for (const option of options) {
        let clonedOption = option.cloneNode(true);

        clonedOption.addEventListener("click", () => {
            let selectedContainer = textsContainer.querySelector(`#${clonedOption.value}`);
            dropdownClick(selectedContainer, textsContainer, container);
            optionsList.style.display = "none";
        })
        optionsList.appendChild(clonedOption);
    }
    dropdown.appendChild(optionsList);

    let arrowButton = createDropdownArrow(dropdown, textsContainer, optionsList);
    return [optionsList, arrowButton]
}

/**
 * Create a dropdown arrow button with the dropdown list of options
 * @param {HTMLElement} dropdown The element containing the arrow button and dropdown list
 * @param {HTMLElement} textsContainer The container with all the textboxes
 * @param {HTMLElement} optionsList Array of dropdown list elements
 * @returns The arrow button element
 */
function createDropdownArrow(dropdown, textsContainer, optionsList) {
    let arrowButton = dropdown.querySelector(".arrow-button");
    arrowButton.addEventListener("click", () => {
        // Resize the dropdown list width to be relative to the width of the textbox
        let textsWidth = textsContainer.getBoundingClientRect().width;
        optionsList.style.minWidth = `${textsWidth * 0.5}px`;
        optionsList.style.maxWidth = `${textsWidth * 0.95}px`;
        optionsList.style.display = optionsList.style.display === "block" ? "none" : "block";
    });
    return arrowButton;
}

/**
 * Event listener function for when the dropdown arrow of the given container is clicked
 * @param {HTMLElement} selectedContainer The container corresponding to the option selected from the dropdown
 * @param {HTMLElement} textsContainer The container with all the textboxes
 * @param {HTMLElement} container The container whose dropdown arrow has been clicked
 */
function dropdownClick(selectedContainer, textsContainer, container) {
    let allContainers = Array.from(textsContainer.children);
    let index = allContainers.indexOf(container);

    if (index === allContainers.length - 1) {
        textsContainer.appendChild(selectedContainer);
    } else {
        if (allContainers.indexOf(selectedContainer) < index) { // selected container is above target
            textsContainer.insertBefore(selectedContainer, container.nextSibling);
        } else { // selected container is below target
            textsContainer.insertBefore(selectedContainer, container);
        }
    }
}

/**
 * Retrieve the closest element that comes right after the container being dragged. The dragged container
 * will be placed above this closest element
 * @param {HTMLElement} container The textbox element that is being dragged
 * @param {Number} y The y position of the mouse
 * @returns The closest textbox below container's current position
 */
function getDragAfterElem(container, y) {
    let draggableElems = [...container.children].filter(child =>
        child.classList.contains("draggable") && !child.classList.contains("dragging")
    );

    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    draggableElems.forEach(element => {
        let box = element.getBoundingClientRect();
        let offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closest = element;
        }
    })

    return closest;
}

/**
 * Event listener function for when a textbox is dragged over another
 * @param {Event} event The dragover event
 * @param {HTMLElement} textsContainer The container with all the textboxes
 */
function dragOver(event, textsContainer) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    let draggable = textsContainer.querySelector(".dragging");

    // Get the container that is below the current dragged textbox
    let afterElem = getDragAfterElem(textsContainer, event.clientY);
    if (afterElem) {
        textsContainer.insertBefore(draggable, afterElem);
    } else { // no container below, add the dragged textbox to the end
        textsContainer.appendChild(draggable);
    }
}

/**
 * Create the submit and restart buttons, and add event listeners for when they are clicked
 * @param {HTMLElement} result The element containing the resulting score after submission
 * @param {HTMLElement} textsContainer The container with all the textboxes
 * @param {Array} correctOrder The correct order of the shuffled IDs belonging to the textboxes
 * @returns The two button elements
 */
function createFormButtons(result, textsContainer, model) {
    let submitButton = createElement("button", {
        classNames: "form-button",
        innerHTML: checkmarkCircleSVG + "Check",
        type: "submit"
    });

    let restartButton = createElement("button", {
        classNames: "form-button",
        innerHTML: "Try again",
        disabled: true
    });

    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        submit(textsContainer, restartButton, submitButton, result, model);
    });

    restartButton.addEventListener("click", () => {
        restart(textsContainer, result);
        restartButton.disabled = true;
        submitButton.disabled = false;
    });

    return [submitButton, restartButton];
}

/**
 * Event listener function for clicking the restart button.
 * Resets the style of the textbox to the format before submission and hides the result element.
 * @param {HTMLElement} textsContainer The container with all the textboxes
 * @param {HTMLElement} result The element containing the resulting score after submission
 */
function restart(textsContainer, result) {
    let containers = Array.from(textsContainer.children);

    containers.forEach((child) => {
        let icon = child.firstChild;
        child.disabled = false;
        child.classList.remove("disabled");

        if (child.classList.contains("correct")) {
            child.classList.remove("correct");
        } else if (child.classList.contains("incorrect")) {
            child.classList.remove("incorrect");
        }

        child.querySelector(".arrow-button").disabled = false;
        icon.innerHTML = dragSVG;
        icon.classList.remove("result-icon");
    });

    result.style.display = "none";
}

/**
 * Event listener function for clicking the submit button.
 * Highlights the correct and incorrect answers and calculates the score.
 * @param {HTMLElement} textsContainer The container with all the textboxes
 * @param {HTMLElement} restartButton The restart button element
 * @param {HTMLElement} submitButton The submit button element
 * @param {Array} correctOrder The correct order of the shuffled IDs belonging to the textboxes
 * @returns The number of correctly placed texts in the sequence
 */
function submit(textsContainer, restartButton, submitButton, result, model) {
    const userAnswer = Array.from(textsContainer.children).map(child => child.dataset.text);

    submitButton.disabled = true;
    result.innerHTML = "Verifying...";
    result.style.display = "block";

    const institutionId = model.get("institution_id") || "inst001";
    const uniqueId = model.get("unique_id") || "1";
    const pluginType = model.get("plugin_type") || "sort_paragraphs";

    fetch(`http://localhost:5001/plugin/verify/${institutionId}/${uniqueId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            plugin_type: pluginType,
            unique_id: uniqueId,
            answer: userAnswer
        })
    })
    .then(response => response.json())
    .then(data => {
        const resultsArray = data.results;
        let correctCount = 0;
        Array.from(textsContainer.children).forEach((child, index) => {
            child.disabled = true;
            child.classList.add("disabled");

            if (resultsArray[index]) {
                child.classList.add("correct");
                let icon = child.querySelector(".drag-icon");
                icon.innerHTML = checkmarkSVG;
                correctCount++;
            } else {
                child.classList.add("incorrect");
                let icon = child.querySelector(".drag-icon");
                icon.innerHTML = xMarkSVG;
            }
        });

        if (correctCount === textsContainer.children.length) {
            result.innerHTML = "All correct!";
            restartButton.disabled = true;
        } else {
            result.innerHTML = `${correctCount} out of ${textsContainer.children.length} correct, try again.`;
            restartButton.disabled = false;
        }
    })
    .catch(err => {
        result.innerHTML = "Error verifying answer.";
        console.error(err);
        restartButton.disabled = false;
    });

}

function render({ model, el }) {
    // Create the header and container for the draggable text boces
    let [title, instructions, question] = createHeader(model, el);

    let textsContainer = createElement("div", { classNames: "texts-container" });
    let form = createElement("form", { classNames: "main-container", action: "javascript:void(0);", children: [textsContainer]});
    let texts = model.get("texts");
    texts.forEach((text, index) => {
        let container = createRow(text, index + 1);
        textsContainer.appendChild(container);
    });

    // Create the list of options from the text boxes, and duplicate them for each dropdown
    let options = createOptions(texts);
    Array.from(textsContainer.children).forEach((container) => {
        let [optionsList, arrowButton] = createDropdown(container, options, textsContainer);
        el.addEventListener("click", (event) => {
            if (!optionsList.contains(event.target) && !arrowButton.contains(event.target)) {
                optionsList.style.display = "none";
            }
        })
    });

    // Add an event listener for dragging the text boxes
    textsContainer.addEventListener("dragover", (event) => {
        dragOver(event, textsContainer);
    });

    // Create the result, score, submit button, and restart button elements
    let result = createElement("div", { className: "result", style: "display: none;" });
    let [submitButton, restartButton] = createFormButtons(result, textsContainer, model);
    form.appendChild(submitButton);

    el.classList.add("stp");
    el.append(...[title, instructions, question, form, result, restartButton]);
}
export default { render };


// SVG constants (TODO: Move these to a separate file and import)
const checkmarkCircleSVG = `<svg viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg" class="checkmark-circle"
                            stroke="#ffffff"><g id="SVGRepo_bgCarrier"
                            stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23
                            1 18.0751 1 12ZM18.4158 9.70405C18.8055 9.31268 18.8041 8.67952 18.4127 8.28984L17.7041 7.58426C17.3127
                            7.19458 16.6796 7.19594 16.2899 7.58731L10.5183 13.3838L7.19723 10.1089C6.80398 9.72117 6.17083 9.7256
                            5.78305 10.1189L5.08092 10.8309C4.69314 11.2241 4.69758 11.8573 5.09083 12.2451L9.82912 16.9174C10.221
                            17.3039 10.8515 17.301 11.2399 16.911L18.4158 9.70405Z" fill="#ffffff"></path> </g></svg>`;

const checkmarkSVG = `<svg fill="#0a6000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="checkmark">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                    stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark2</title>
                    <path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795
                    12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924
                    8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path> </g></svg>`;

const xMarkSVG = `<svg fill="#8f0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="x-mark">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
                </g><g id="SVGRepo_iconCarrier"> <title>cancel2</title> <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151
                2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038
                0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097
                6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path> </g></svg>`;

const dragSVG = `<svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157
                8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284
                8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11
                18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17
                13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20
                17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923"></path> </g></svg>`

const dropdownSVG = `<svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929
                    8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976
                    11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#000000"></path> </g></svg>`

