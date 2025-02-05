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

function shuffleArray(array) {
    let positions = [...Array(array.length).keys()];
    let shuffledArray = [...array];
    for (let currIndex = 0; currIndex < array.length; currIndex++) {
        let randIndex = Math.floor(Math.random() * currIndex);
        [shuffledArray[currIndex], shuffledArray[randIndex]] = [shuffledArray[randIndex], shuffledArray[currIndex]];
        [positions[currIndex], positions[randIndex]] = [positions[randIndex], positions[currIndex]];
    }
    return [shuffledArray, positions];
}

function createRow(text, stepNum, el) {
    let arrow = createElement("button", { classNames: "arrow-button", innerHTML: dropdownSVG });
    let dropdown = createElement("div", { classNames: "dropdown", children: [arrow] });
    let step = createElement("div", { classNames: "step", textContent: `${stepNum}` });
    let container = createElement("div", { 
        classNames: ["container", "draggable"], 
        textContent: text, 
        draggable: "true", 
        id: `text${stepNum}`,
        children: [dropdown]
    });

    let icon = createElement("div", { classNames: "drag-icon", innerHTML: dragSVG });
    container.insertBefore(icon, container.firstChild);

    container.addEventListener("dragstart", (event) => {
        container.classList.add("dragging");
        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        event.dataTransfer.setDragImage(img, 0, 0);
        // setTimeout(() => {
        //     container.classList.add("placeholder");
        // }, 0);
    });

    container.addEventListener("dragend", () => {
        container.classList.remove("dragging");
        // container.classList.remove("dragging", "placeholder");
    });

    return [step, container];
}

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


function restart(textContainer, result, reset) {
    Array.from(textContainer.children).forEach((child) => {
        let icon = child.firstChild;
        child.disabled = false;
        child.classList.remove("disabled");
        icon.innerHTML = dragSVG;
        icon.classList.remove("result-icon");
        if (reset) {
            if (child.classList.contains("correct")) {
                child.classList.remove("correct");
            } else if (child.classList.contains("incorrect")) {
                child.classList.remove("incorrect");
            }
        } else {
            if (child.classList.contains("incorrect")) {
                child.classList.remove("incorrect");
            } else {
                child.disabled = true;
                child.classList.remove("draggable");
            }
        }
        child.querySelector(".arrow-button").disabled = false;
        
    });
    result.style.display = "none";
}


function render({ model, el }) {
    let title = createElement("h1", { classNames: "title", textContent: "Sort the Paragraphs"});
    let description = createElement("h1", { classNames: "description", textContent: "Drag & drop or select to sort"});
    let question = createElement("p", { classNames: "question", innerHTML: model.get("question")});
    let reset = model.get("reset");
    let instructionSummary = createElement("summary", { textContent: "Instructions for Sorting the Paragraphs"});
    let instructionText = createElement("p", { innerHTML: "Dragging instructions: Drag any sequence item on the right into its correct position. <br> Dropdown instructions: Click the dropdown button next to a sequence number to place a sequence item into the corresponding position."})
    let instruction = createElement("details", { classNames: "instruction", children: [instructionSummary, instructionText] });
    let stepsContainer = createElement("div", { classNames: "stepsContainer" });
    let textsContainer = createElement("div", { classNames: "textsContainer" });
    let exerciseContainer = createElement("div", { classNames: "exerciseContainer", children: [stepsContainer, textsContainer] });
    let form = createElement("form", { action: "javascript:void(0);", children: [exerciseContainer]});
    let texts = [];

    let sortedTexts = model.get("sorted_texts");
    let [shuffledTexts, positions] = shuffleArray(sortedTexts);

    shuffledTexts.forEach((text, index) => {
        let [step, container] = createRow(text, index + 1, el);
        stepsContainer.appendChild(step);
        textsContainer.appendChild(container);
        texts.push(text);
    });

    // Correct order of the shuffled IDs 
    let correctOrder = [...positions];
    positions.forEach((pos, index) => {
        correctOrder[pos] = `text${index + 1}`;
    })

    let options = []
    texts.forEach((text, index) => {
        let option = createElement("button", { classNames: "option", value: `text${index + 1}`, textContent: text });
        options.push(option);
    })

    
    Array.from(textsContainer.children).forEach((container) => {
        let dropdown = container.querySelector(".dropdown");
        let optionsList = createElement("div", { classNames: "option-list" });
        
        for (const option of options) {
            let clonedOption = option.cloneNode(true);
            clonedOption.addEventListener("click", () => {
                let allContainers = Array.from(textsContainer.children);
                console.log(allContainers);
                let selectedContainer = el.querySelector(`#${clonedOption.value}`);
                let index = allContainers.indexOf(container);

                if (index === sortedTexts.length - 1) {
                    textsContainer.appendChild(selectedContainer);
                } else {
                    
                    if (allContainers.indexOf(selectedContainer) < index) { // selected container is above target
                        textsContainer.insertBefore(selectedContainer, container.nextSibling);
                    } else { // selected container is below target
                        textsContainer.insertBefore(selectedContainer, container); 
                    }
                }

                optionsList.style.display = "none";
            })
            optionsList.appendChild(clonedOption);
        }
        dropdown.appendChild(optionsList);

        let arrowButton = dropdown.querySelector(".arrow-button");
        arrowButton.addEventListener("click", () => {
            let textsWidth = textsContainer.getBoundingClientRect().width;
            optionsList.style.width = `${textsWidth * 0.5}px`;
            optionsList.style.display = optionsList.style.display === "block" ? "none" : "block";
        });
        

        el.addEventListener("click", (event) => {
            if (!optionsList.contains(event.target) && !arrowButton.contains(event.target)) {
                optionsList.style.display = "none";
            }
        })
    });

    console.log(textsContainer);
    textsContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
        let afterElem = getDragAfterElem(textsContainer, event.clientY);
        let draggable = el.querySelector(".dragging");

        // if (!draggable) return;

        if (afterElem) {
            textsContainer.insertBefore(draggable, afterElem);
        } else {
            textsContainer.appendChild(draggable);
        }
    });

    let submitButton = createElement("button", {
        classNames: "form-button",
        innerHTML: checkmarkCircleSVG + "Check",
        type: "submit"
    });
    
    let result = createElement("div", { className: "result", style: "display: none;" });

    let restart_button = createElement("button", {
        classNames: "form-button",
        innerHTML: "Try again",
        disabled: true
    });

    restart_button.addEventListener("click", () => {
        restart(textsContainer, result, reset);
        restart_button.disabled = true;
        submitButton.disabled = false;
    });

    form.appendChild(submitButton);
    
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        let score = 0;
        if (!submitButton.disabled) {
            const draggableElements = el.querySelectorAll('.draggable');

            draggableElements.forEach((element, index) => {
                element.disabled = true;
                element.classList.add("disabled");
                let icon = element.firstChild;
                icon.classList.add("result-icon");
                if (element.id == correctOrder[index]) {
                    element.classList.add("correct");
                    icon.innerHTML = checkmarkSVG;
                    score++;
                } else {
                    element.classList.add("incorrect");
                    restart_button.disabled = false;
                    icon.innerHTML = xMarkSVG;
                }
            });
        }

        submitButton.disabled = true;
        if (score === sortedTexts.length) {
            restart_button.disabled = true;
            
        } else {
            restart_button.disabled = false;
        }
        Array.from(stepsContainer.children).forEach((step) => {
            step.querySelector(".arrow-button").disabled = true;
        });
        
        result.innerHTML = `Score: ${score} / ${sortedTexts.length}`;
        result.style.display = "block";
    });
    el.classList.add("stp");
    el.append(...[title, description, instruction, question, form, result, restart_button]);
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

const dragSVG = `<svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923"></path> </g></svg>`

const dropdownSVG = `<svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#000000"></path> </g></svg>`




// /**
//  * Creates an HTML element with the given attributes
//  * @param {String} tag The HTML tag of the element
//  * @param {Objects} attributes The attributes to apply to the element
//  * @param {String|Array} classNames The class(es) to apply to the element
//  * @param {Array} children The children to append to the element 
//  * @returns The created HTML element
//  */
// function createElement(tag, { classNames = "", children = [], ...attrs} = {}) {
//     const element = document.createElement(tag);
//     if (classNames) element.classList.add(...[].concat(classNames));

//     // Add rest of attributes and children
//     Object.entries(attrs).forEach(([key, value]) => element[key] = value);
//     children.forEach((child) => element.appendChild(child));
//     return element;
// }

// function shuffleArray(array) {
//     let positions = [...Array(array.length).keys()];
//     let shuffledArray = [...array];
//     for (let currIndex = 0; currIndex < array.length; currIndex++) {
//         let randIndex = Math.floor(Math.random() * currIndex);
//         [shuffledArray[currIndex], shuffledArray[randIndex]] = [shuffledArray[randIndex], shuffledArray[currIndex]];
//         [positions[currIndex], positions[randIndex]] = [positions[randIndex], positions[currIndex]];
//     }
//     return [shuffledArray, positions];
// }

// function createRow(text, stepNum, el) {
//     let arrow = createElement("button", { classNames: "arrow-button", innerHTML: dropdownSVG });
//     let dropdown = createElement("div", { classNames: "dropdown", children: [arrow] });
//     let step = createElement("div", { classNames: "step", textContent: `${stepNum}`, children: [dropdown] });
//     let container = createElement("div", { classNames: ["container", "draggable"], textContent: text, draggable: "true", id: `text${stepNum}`});

//     let icon = createElement("div", { classNames: "drag-icon", innerHTML: dragSVG });
//     container.insertBefore(icon, container.firstChild);

//     container.addEventListener("dragstart", () => {
//         container.classList.add("dragging");
//         setTimeout(() => {
//             container.classList.add("placeholder");
//         }, 0);
//     });

//     container.addEventListener("dragend", () => {
//         container.classList.remove("dragging", "placeholder");
//     });

//     return [step, container];
// }

// function getDragAfterElem(container, y) {
//     let draggableElems = [...container.children].filter(child =>
//         child.classList.contains("draggable") && !child.classList.contains("dragging")
//     );

//     let closest = null;
//     let closestOffset = Number.NEGATIVE_INFINITY;

//     draggableElems.forEach(element => {
//         let box = element.getBoundingClientRect();
//         let offset = y - box.top - box.height / 2;
//         if (offset < 0 && offset > closestOffset) {
//             closestOffset = offset;
//             closest = element;
//         }
//     })

//     return closest;
// }


// function restart(textContainer, stepsContainer, result, reset) {
//     Array.from(textContainer.children).forEach((child) => {
//         let icon = child.firstChild;
//         child.disabled = false;
//         child.classList.remove("disabled");
//         icon.innerHTML = dragSVG;
//         icon.classList.remove("result-icon");
//         if (reset) {
//             if (child.classList.contains("correct")) {
//                 child.classList.remove("correct");
//             } else if (child.classList.contains("incorrect")) {
//                 child.classList.remove("incorrect");
//             }
//         } else {
//             if (child.classList.contains("incorrect")) {
//                 child.classList.remove("incorrect");
//             } else {
//                 child.disabled = true;
//                 child.classList.remove("draggable");
//             }
//         }
        
//     });
//     result.style.display = "none";

//     Array.from(stepsContainer.children).forEach((step) => {
//         step.querySelector(".arrow-button").disabled = false;
//     });
// }


// function render({ model, el }) {
//     let title = createElement("h1", { classNames: "title", textContent: "Sort the Paragraphs"});
//     let description = createElement("h1", { classNames: "description", textContent: "Drag & drop or select to sort"});
//     let question = createElement("p", { classNames: "question", innerHTML: model.get("question")});
//     let reset = model.get("reset");
//     let instructionSummary = createElement("summary", { textContent: "Instructions for Sorting the Paragraphs"});
//     let instructionText = createElement("p", { innerHTML: "Dragging instructions: Drag any sequence item on the right into its correct position. <br> Dropdown instructions: Click the dropdown button next to a sequence number to place a sequence item into the corresponding position."})
//     let instruction = createElement("details", { classNames: "instruction", children: [instructionSummary, instructionText] });
//     let stepsContainer = createElement("div", { classNames: "stepsContainer" });
//     let textsContainer = createElement("div", { classNames: "textsContainer" });
//     let exerciseContainer = createElement("div", { classNames: "exerciseContainer", children: [stepsContainer, textsContainer] });
//     let form = createElement("form", { action: "javascript:void(0);", children: [exerciseContainer]});
//     let texts = [];

//     let sortedTexts = model.get("sorted_texts");
//     let [shuffledTexts, positions] = shuffleArray(sortedTexts);

//     shuffledTexts.forEach((text, index) => {
//         let [step, container] = createRow(text, index + 1, el);
//         stepsContainer.appendChild(step);
//         textsContainer.appendChild(container);
//         texts.push(text);
//     });

//     // Correct order of the shuffled IDs 
//     let correctOrder = [...positions];
//     positions.forEach((pos, index) => {
//         correctOrder[pos] = `text${index + 1}`;
//     })

//     let options = []
//     texts.forEach((text, index) => {
//         let option = createElement("button", { classNames: "option", value: `text${index + 1}`, textContent: text });
//         options.push(option);
//     })

//     Array.from(stepsContainer.children).forEach((step, index) => {
//         let dropdown = step.querySelector(".dropdown");
//         let optionsList = createElement("div", { classNames: "option-list" });
        
//         for (const option of options) {
//             let clonedOption = option.cloneNode(true);
//             clonedOption.addEventListener("click", () => {
//                 let selectedContainer = el.querySelector(`#${clonedOption.value}`);
//                 let allContainers = Array.from(textsContainer.children);

//                 if (index === sortedTexts.length - 1) {
//                     textsContainer.appendChild(selectedContainer);
//                 } else {
//                     let targetContainer = allContainers[index];
//                     if (allContainers.indexOf(selectedContainer) < index) { // selected container is above target
//                         textsContainer.insertBefore(selectedContainer, targetContainer.nextSibling);
//                     } else { // selected container is below target
//                         textsContainer.insertBefore(selectedContainer, targetContainer); 
//                     }
//                 }

//                 optionsList.style.display = "none";
//             })
//             optionsList.appendChild(clonedOption);
//         }
//         dropdown.appendChild(optionsList);

//         let arrowButton = dropdown.querySelector(".arrow-button");
//         arrowButton.addEventListener("click", () => {
//             optionsList.style.display = optionsList.style.display === "block" ? "none" : "block";
//         });
//         el.addEventListener("click", (event) => {
//             if (!optionsList.contains(event.target) && !arrowButton.contains(event.target)) {
//                 optionsList.style.display = "none";
//             }
//         })
//     });

    
//     textsContainer.addEventListener("dragover", (event) => {
//         event.preventDefault();
//         let afterElem = getDragAfterElem(textsContainer, event.clientY);
//         let draggable = el.querySelector(".dragging");

//         // if (!draggable) return;

//         if (afterElem) {
//             textsContainer.insertBefore(draggable, afterElem);
//         } else {
//             textsContainer.appendChild(draggable);
//         }
//     });

//     let submitButton = createElement("button", {
//         classNames: "form-button",
//         innerHTML: checkmarkCircleSVG + "Check",
//         type: "submit"
//     });
    
//     let result = createElement("div", { className: "result", style: "display: none;" });

//     let restart_button = createElement("button", {
//         classNames: "form-button",
//         innerHTML: "Try again",
//         disabled: true
//     });

//     restart_button.addEventListener("click", () => {
//         restart(textsContainer, stepsContainer, result, reset);
//         restart_button.disabled = true;
//         submitButton.disabled = false;
//     });

//     form.appendChild(submitButton);
    
//     submitButton.addEventListener("click", (event) => {
//         event.preventDefault();
//         let score = 0;
//         if (!submitButton.disabled) {
//             const draggableElements = el.querySelectorAll('.draggable');

//             draggableElements.forEach((element, index) => {
//                 element.disabled = true;
//                 element.classList.add("disabled");
//                 let icon = element.firstChild;
//                 icon.classList.add("result-icon");
//                 if (element.id == correctOrder[index]) {
//                     element.classList.add("correct");
//                     icon.innerHTML = checkmarkSVG;
//                     score++;
//                 } else {
//                     element.classList.add("incorrect");
//                     restart_button.disabled = false;
//                     icon.innerHTML = xMarkSVG;
//                 }
//             });
//         }

//         submitButton.disabled = true;
//         if (score === sortedTexts.length) {
//             restart_button.disabled = true;
            
//         } else {
//             restart_button.disabled = false;
//         }
//         Array.from(stepsContainer.children).forEach((step) => {
//             step.querySelector(".arrow-button").disabled = true;
//         });
        
//         result.innerHTML = `Score: ${score} / ${sortedTexts.length}`;
//         result.style.display = "block";
//     });

//     el.classList.add("stp");
//     el.append(...[title, description, instruction, question, form, result, restart_button]);
// }
// export default { render };


// // SVG constants (TODO: Move these to a separate file and import)
// const checkmarkCircleSVG = `<svg viewBox="0 0 24 24" fill="none" 
//                             xmlns="http://www.w3.org/2000/svg" class="checkmark-circle"
//                             stroke="#ffffff"><g id="SVGRepo_bgCarrier" 
//                             stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
//                             <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" 
//                             d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 
//                             1 18.0751 1 12ZM18.4158 9.70405C18.8055 9.31268 18.8041 8.67952 18.4127 8.28984L17.7041 7.58426C17.3127 
//                             7.19458 16.6796 7.19594 16.2899 7.58731L10.5183 13.3838L7.19723 10.1089C6.80398 9.72117 6.17083 9.7256 
//                             5.78305 10.1189L5.08092 10.8309C4.69314 11.2241 4.69758 11.8573 5.09083 12.2451L9.82912 16.9174C10.221 
//                             17.3039 10.8515 17.301 11.2399 16.911L18.4158 9.70405Z" fill="#ffffff"></path> </g></svg>`;

// const checkmarkSVG = `<svg fill="#0a6000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="checkmark">
//                     <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" 
//                     stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark2</title> 
//                     <path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 
//                     12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 
//                     8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path> </g></svg>`;

// const xMarkSVG = `<svg fill="#8f0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="x-mark">
//                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
//                 </g><g id="SVGRepo_iconCarrier"> <title>cancel2</title> <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 
//                 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 
//                 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 
//                 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path> </g></svg>`;

// const dragSVG = `<svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" fill="#121923"></path> </g></svg>`

// const dropdownSVG = `<svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#000000"></path> </g></svg>`
