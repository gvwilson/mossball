import swal from "https://esm.sh/sweetalert2@11";
import tippy from "https://esm.sh/tippy.js@6";

/**
 * Creates an HTML element with the given attributes
 * @param {String} tag The HTML tag of the element
 * @param {Objects} attributes The attributes to apply to the element
 * @param {String|Array} classNames The class(es) to apply to the element
 * @param {Array} children The children to append to the element
 * @returns The created HTML element
 */
function createElement(tag, { classNames = "", children = [], ...attrs } = {}) {
    const element = document.createElement(tag);
    if (classNames) element.classList.add(...[].concat(classNames));

    // Add rest of attributes and children
    Object.entries(attrs).forEach(([key, value]) => (element[key] = value));
    children.forEach((child) => element.appendChild(child));
    return element;
}


/**
 * Create an info tooltip button for the Multiple Choice widget.
 * @returns {HTMLElement} The tooltip button element.
 */
function createMCInfoTooltip() {
    const infoButton = document.createElement("button");
    infoButton.className = "info-tooltip";
    infoButton.textContent = "i";
    infoButton.style.alignSelf = "flex-start";

    tippy(infoButton, {
        content: "Select the best answer from the options and submit.",
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
 * Render modal
 * @param {string} title
 * @param {string} text
 * @param {string} icon
 * @param {string} buttonText
 * @param {function} closeAction
 */
const showModal = (title, text, icon, buttonText, closeAction) => {
    swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: buttonText,
        confirmButtonColor: "#2858b3",
        didOpen: (popup) => {
            const button = popup.querySelector(".swal2-confirm");
            button.style.borderRadius = "18px";
            button.style.padding = "0.4rem 1.6rem 0.4rem 1.5rem;";
        },
    }).then(() => {
        closeAction();
    });
};

/**
 * Checks whether the selected option is correct and shows the results on screen
 * @param {Number} currOption The index of the currently selected option within the list of options
 * @param {HTMLElement} result The element displaying the result of the answered question
 * @param {HTMLElement} mc The multiple question form element
 * @param {String} uniqueId The ID of the question
 * @param {String} pluginType The type of widget
 * @param {DOMWidgetModel} model The widget model
 */
function checkAnswer(currOption, result, mc, uniqueId, pluginType, model) {
    result.innerHTML = "Verifying...";
    result.style.display = "block";

    // Send a custom msg to backend of the plugin
    model.send({
        command: "verify",
        plugin_type: pluginType,
        unique_id: uniqueId,
        answer: currOption,
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
    let radio_button = createElement("input", {
        type: "radio",
        name: "choices",
        value: option,
    });
    let label = createElement("label", {
        classNames: "label",
        innerHTML: option,
    });
    let container = createElement("div", {
        classNames: "choice",
        id: `choice${index + 1}`,
        children: [radio_button, label],
    });
    radio_button.checked = model.get("currOption") === index ? true : false;

    container.addEventListener("click", () => {
        radio_button.checked = true;
        model.set("currOption", index);
        model.save_changes();
    });

    return container;
}

function render({ model, el }) {
    const data = model.get("data");
    const uniqueId = data["unique_id"] || "3";
    const pluginType = data["plugin_type"] || "multiple_choice";

    // Create question element
    let question = createElement("p", {
        classNames: ["question", "title"],
        innerHTML: data["question"],
    });

    // Create a flex container to hold the question and tooltip.
    let questionContainer = document.createElement("div");
    questionContainer.style.display = "flex";
    questionContainer.style.justifyContent = "space-between";
    questionContainer.style.alignItems = "flex-start";
    // Append the question element (renamed correctly)
    questionContainer.appendChild(question);

    // Create the info tooltip and add it to the question container.
    let mcInfoTooltip = createMCInfoTooltip();
    questionContainer.appendChild(mcInfoTooltip);

    // Create the form for options.
    let options = data["options"];
    let mc = createElement("form", { action: "javascript:void(0);" });
    let submitButton = createElement("button", {
        classNames: "check-button",
        innerHTML: "Check",
        type: "submit",
    });

    let result = createElement("div", {
        className: "result",
        style: "display: none;",
    });
    let restart_button = createElement("button", {
        classNames: "try-button",
        innerHTML: "Try again",
        disabled: true,
    });

    restart_button.addEventListener("click", () => {
        restart(mc, model, result);
        restart_button.disabled = true;
    });

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
            if (currOption < 0)
                showModal(
                    "Warning",
                    "Question unanswered! Please select an option to submit.",
                    "warning",
                    "OK",
                    () => {}
                );
            else checkAnswer(currOption, result, mc, uniqueId, pluginType, model);
        }
    });

    el.classList.add("mc");
    // Append the question container (with tooltip), form, result, and restart button
    el.append(...[questionContainer, mc, result, restart_button]);

    // Listen for custom messages from the plugin backend
    model.on("msg:custom", (msg) => {
        if (msg.command && msg.command === "verify_result") {
            const correct = msg.results;
            let selected = mc.children[model.get("currOption")];
            let icon = createElement("div", { classNames: "icon" });
            selected.insertBefore(
                icon,
                selected.querySelector("input[type='radio']")
            );

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
