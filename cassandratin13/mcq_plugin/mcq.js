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
 * Creates a modal pop-up and an overlay that darkens the background and prevents anything else from being clicked
 * @param {String} message The message shown in the modal
 * @returns The modal and the overlay elements
 */
function createModal(message) {
    let warningMessage = createElement("p", { textContent: message});
    let warning = createElement("div", { classNames: "modal-content", children: [warningMessage] });
    let okButton = createElement("button", { classNames: "okButton", textContent: "OK"});
    let modal = createElement("div", { classNames: "modal", children: [warning, okButton] });
    let overlay = createElement("div", { classNames: "overlay" });
    okButton.addEventListener("click", (event) => {
        event.preventDefault();
        modal.style.display = "none";
        overlay.style.display = "none";
    });
    return [modal, overlay];
}

/**
 * Changes the modal and overlay's display attributes to make the model appear on screen
 * @param {HTMLElement} modal The modal element to display
 * @param {HTMLElement} overlay The overlay element to display
 */
function showModal(modal, overlay) {
    modal.style.display = "block";
    overlay.style.display = "block";
}

/**
 * Checks whether the selected option is correct and shows the results on screen
 * @param {Number} currOption The index of the currently selected option within the list of options
 * @param {HTMLElement} el The widget element
 * @param {HTMLElement} result The element displaying the result of the answered question
 * @param {HTMLElement} mc The multiple question form element
 */
function checkAnswer(currOption, result, mc, model) {  
    // Add an icon before the selected option 

    result.innerHTML = "Verifying...";
    result.style.display = "block";

    const uniqueId = model.get("unique_id") || "3";
    const pluginType = model.get("plugin_type") || "multiple_choice";
    console.log(uniqueId);
    console.log(pluginType);
    console.log(currOption);

    // Send a custom msg to backend of the plugin
    model.send({
        command: "verify",
        plugin_type: pluginType,
        unique_id: uniqueId,
        answer: currOption
   });

    // Disable all options
    disableChoices(mc);
}

/**
 * Disable the options in the multiple choice form
 * @param {HTMLElement} mc The multiple choice form
 */
function disableChoices(mc) {
    for (const child of mc.children) {
        child.disabled = true;
        child.classList.add("disabled");
    }
}

/**
 * Reset the multiple choice form so that no option is currently selected
 * @param {HTMLElement} mc The multiple choice form
 * @param {DOMWidgetModel} model The widget model
 * @param {HTMLElement} result The element displaying the result of the answered question
 * 
 */
function restart(mc, model, result) {
    Array.from(mc.children).forEach((child, index) => {
        child.disabled = false;
        child.checked = false;
        child.classList.remove("disabled");
        if (child.id === "correct" || child.id === "incorrect") {
            child.id = `choice${index + 1}`;
            child.querySelector("input[type='radio']").checked = false;
            child.querySelector(".icon").remove();
        }
    });

    model.set("currOption", -1); 
    model.save_changes();
    result.innerHTML = "";
    result.style.display = "none";
}

/**
 * Create a container element for an option in the multiple choice form, containing a radio button and label
 * @param {String} option The label for the option
 * @param {Number} index The index of the option within the list of options
 * @param {DOMWidgetModel} model The widget model
 * @returns The container element
 */
function createOption(option, index, model) {
    let radio_button = createElement("input", { type: "radio", name: "choices", value: option });
    let label = createElement("label", { classNames: "label", innerHTML: option });
    let container = createElement("div", {
        classNames: "choice",
        id: `choice${index + 1}`,
        children: [radio_button, label]
    })
    radio_button.checked = (model.get("currOption") === index) ? true : false;

    container.addEventListener("click", () => {
        radio_button.checked = true;
        model.set("currOption", index);
        model.save_changes();
    });

    return container;
}

function render({ model, el }) {
    // Create question, form, and buttons
    let question = createElement("p", { classNames: ["question", "title"] ,innerHTML: model.get("question")});
    let options = model.get("options");
    let mc = createElement("form", { action: "javascript:void(0);"})
    let submitButton = createElement("button", {
        classNames: "check-button",
        innerHTML: "Check",
        type: "submit"
    });
    
    let result = createElement("div", { className: "result", style: "display: none;" });
    let restart_button = createElement("button", {
        classNames: "try-button",
        innerHTML: "Try again",
        disabled: true
    });

    restart_button.addEventListener("click", () => {
        restart(mc, model, result);
        restart_button.disabled = true;
    });

    let [modal, overlay] = createModal("Warning: Question unanswered! \nPlease select an option to submit.");

    // Create radio button, label, and container for each option
    options.forEach((option, index) => {
        let container = createOption(option, index, model);
        mc.appendChild(container);
    });

    mc.appendChild(submitButton);
    mc.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!submitButton.disabled) {
            let currOption = model.get("currOption");
            if (currOption < 0) showModal(modal, overlay);
            else checkAnswer(currOption, result, mc, model);
        }
    });

    el.classList.add("mc");
    el.append(...[question, mc, result, restart_button, modal, overlay]);


    // Listen for custom msgs from the plugin backend
    model.on("msg:custom", (msg) => {
        if (msg.command && msg.command === "verify_result") {
            const correct = msg.results;
            let selected = mc.children[model.get("currOption")];
            let icon = createElement("div", { classNames: "icon" });
            selected.insertBefore(icon, selected.querySelector("input[type='radio']"));

            if (correct) {
                result.innerHTML = "Correct!";
                selected.id = "correct";
                icon.innerHTML = checkmarkSVG;
                restart_button.disabled = true;
            } else {
                result.innerHTML = "Incorrect";
                selected.id = "incorrect";
                icon.innerHTML = xMarkSVG;
                restart_button.disabled = false;
            }
        }
    });
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