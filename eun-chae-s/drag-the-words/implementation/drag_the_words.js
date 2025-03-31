import tippy from "https://esm.sh/tippy.js@6";

const correctAnswerIcon = `<svg fill="#0a6000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="checkmark">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <title>checkmark2</title>
    <path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path>
  </g>
</svg>`;

const wrongAnswerIcon = `<svg fill="#8f0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="x-mark">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <title>cancel2</title>
    <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path>
  </g>
</svg>`;

const deleteAnswerIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;

// Gloabl objects
// the word that is currently dragged
let draggedWord = null;
// key: each blank box ID (answer-{num}), value: [its index in the solution list, the blank box HTML element, the selected word box HTML element]
let answerStatus = {};
let wordCount = {};

// helper functions


/**
 * Create an info tooltip button for the DragWords widget.
 * This button displays additional instructions when hovered.
 * @returns {HTMLElement} The tooltip button element.
 */
function createDragInfoTooltip() {
  const infoButton = document.createElement("button");
  infoButton.className = "info-tooltip";
  infoButton.textContent = "i";

  tippy(infoButton, {
      content: "Drag the words into the correct positions. Alternatively, click the blank to choose an option.",
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
 * Shuffle the list of words in a random order to be placed in its container
 * @param {Array} array
 * @returns
 */
function shuffleArray(array) {
  const newArr = array.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
}

/**
 * Handle the word that is in drag
 * @param {*} event
 */
function dragWord(event) {
  event.dataTransfer.clearData();
  draggedWord = event.target;
  event.dataTransfer.setData("text", event.target.id);
}

/**
 * Handle the word that is just dropped on the answer box with ID (answer-{num})
 * @param {*} event
 */
function dropWord(event) {
  event.preventDefault();

  if (answerStatus[event.target.id][2] !== undefined) {
    let prevWordBox = answerStatus[event.target.id][2];
    let prevWord = prevWordBox.innerText;
    wordCount[prevWord][1] -= 1;
    prevWordBox.className = "word-box";
    prevWordBox.setAttribute("draggable", true);
    prevWordBox.style.cursor = "pointer";
  }

  // A "X-mark" button next to the dragged word
  const removeAnswerButton = document.createElement("button");
  removeAnswerButton.innerHTML = deleteAnswerIcon;
  removeAnswerButton.id = `remove-${event.target.id}`;
  removeAnswerButton.addEventListener("click", () => {
    const answerID = removeAnswerButton.id.substring(7);

    // reset the answer box as blank
    answerStatus[answerID][1].className = "blank";

    // decrement the total counts for using the previously selected word
    if (answerStatus[answerID][2] !== undefined) {
      wordCount[answerStatus[answerID][2].innerText][1] -= 1;
      answerStatus[answerID][2].className = "word-box";
      answerStatus[answerID][2].setAttribute("draggable", true);
      answerStatus[answerID][2].style.cursor = "pointer";
    }
    answerStatus[answerID][1].innerHTML = "";
    answerStatus[answerID][2] = undefined;
  });

  event.target.innerText = draggedWord.innerText;
  // add the x-mark button to be able to remove the answer
  event.target.append(removeAnswerButton);
  event.target.className = "filled";

  answerStatus[event.target.id][2] = draggedWord;

  let newWord = draggedWord.innerText;
  wordCount[newWord][1] += 1;

  if (wordCount[newWord][1] === wordCount[newWord][0]) {
    draggedWord.className += " selected";
    draggedWord.setAttribute("draggable", false);
    draggedWord.style.cursor = "default";
  }
}

/**
 * Create a blank answer box and Add its entry to the global object `answerStatus`
 * @param {*} index
 * @returns
 */
function createAnswerBox(index) {
  let blankBox = document.createElement("div");
  blankBox.className = "blank";
  blankBox.id = `answer-${index}`;
  blankBox.addEventListener("dragover", (event) => event.preventDefault());
  blankBox.addEventListener("drop", (event) => dropWord(event));
  answerStatus[blankBox.id] = [index, blankBox, undefined];
  return blankBox;
}

function createQuestionContainer(question_text) {
  let question = document.createElement("div");
  question.className = "question instruction";
  question.innerHTML = "";
  let lastIndex = 0;
  let matchIndex = 0;
  question_text.replace(/\{\{(.*?)\}\}/gi, (match, p1, offset) => {
    if (lastIndex !== offset) {
      let spanText = document.createElement("span");
      spanText.innerText = question_text.substring(lastIndex, offset);
      question.appendChild(spanText);
    }
    const answerBox = createAnswerBox(matchIndex);
    question.appendChild(answerBox);
    lastIndex = offset + match.length;
    matchIndex++;
  });
  if (lastIndex < question_text.length) {
    question.appendChild(
      document.createTextNode(question_text.substring(lastIndex))
    );
  }
  return question;
}

function createWordBoxes(choices) {
  // some words appear multiple times, so create an array containing each unique word
  var unique_choices = [];
  wordCount = {};
  choices.forEach((word) => {
    if (word in wordCount) {
      wordCount[word][0] += 1;
    } else {
      wordCount[word] = [1, 0];
      unique_choices.push(word);
    }
  });

  let box_container = document.createElement("div");
  box_container.className = "words-container";
  box_container.innerHTML = "";
  const random_order = shuffleArray(unique_choices);
  random_order.forEach((word, idx) => {
    let wordBox = document.createElement("div");
    wordBox.className = "word-box";
    wordBox.id = `word-${idx}`;
    wordBox.innerText = word;
    wordBox.setAttribute("draggable", true);
    wordBox.addEventListener("dragstart", (event) => dragWord(event));
    box_container.appendChild(wordBox);
  });
  return box_container;
}

/**
 * Clear answer boxes.
 * @param {Boolean} clear_all - if true, clear all fields; if false, retain correct answers.
 */
function clearAnswers(clear_all = false) {
  Object.keys(answerStatus).forEach((answerID) => {
    let answerBox = answerStatus[answerID][1];
    if (!clear_all && answerBox.classList.contains("correct")) {
      return;
    }

    if (answerStatus[answerID][2] !== undefined) {
      let wordBox = answerStatus[answerID][2];
      wordBox.className = "word-box";
      wordBox.setAttribute("draggable", true);
      wordBox.style.cursor = "pointer";
    }
    answerBox.className = "blank";
    answerBox.innerText = "";
    answerStatus[answerID][2] = undefined;
  });

  Object.keys(wordCount).forEach((word) => {
    wordCount[word][1] = 0;
  });
  if (!clear_all) {
    Object.keys(answerStatus).forEach((answerID) => {
      let answerBox = answerStatus[answerID][1];
      if (answerBox.classList.contains("correct")) {
        let wordUsed = answerBox.innerText.trim();
        if (wordUsed in wordCount) {
          wordCount[wordUsed][1] += 1;
        }
      }
    });
  }
}

function verifyAnswers(model, result) {
  const answers = [];
  Object.keys(answerStatus).forEach((answerID) => {
    answers.push(answerStatus[answerID][1].innerText.trim());
  });

  result.innerHTML = "Verifying...";
  result.style.display = "block";

  model.send({
    command: "verify",
    unique_id: model.get("unique_id"),
    plugin_type: model.get("plugin_type"),
    answer: answers,
  });
}

function render({ model, el }) {
  let container = document.createElement("div");
  container.className = "drag-words-widget";
  const content = model.get("data");

  const instructionContainer = document.createElement("div");
  instructionContainer.style.display = "flex";
  instructionContainer.style.justifyContent = "space-between";
  instructionContainer.style.alignItems = "flex-start";

  let instruction = document.createElement("div");
  instruction.className = "title";
  instruction.innerHTML = content.instruction;

  const dragInfoTooltip = createDragInfoTooltip();
  instructionContainer.appendChild(instruction);
  instructionContainer.appendChild(dragInfoTooltip);

  let question = createQuestionContainer(content.question);
  let box_container = createWordBoxes(content.choices);
  let button_container = document.createElement("div");
  button_container.className = "bottom-banner";

  let submit_button = document.createElement("button");
  submit_button.innerHTML = "Check";
  submit_button.className = "check-button";

  let retry_button = document.createElement("button");
  retry_button.innerHTML = "Retry";
  retry_button.className = "try-button";

  let restart_button = document.createElement("button");
  restart_button.innerHTML = "Restart";
  restart_button.className = "try-button";

  let reset_button = document.createElement("button");
  reset_button.innerHTML = "Reset";
  reset_button.className = "try-button";

  let result = document.createElement("div");
  result.className = "result";
  result.style.display = "none";

  let totalCount = Object.keys(answerStatus).length;

  submit_button.addEventListener("click", () => {
    Array.from(box_container.children).forEach((elem) => {
      elem.setAttribute("draggable", false);
      elem.style.pointerEvents = "none";
    });

    verifyAnswers(model, result);
    button_container.innerHTML = "";
  });

  retry_button.addEventListener("click", () => {
    clearAnswers();
    result.innerHTML = "";
    button_container.innerHTML = "";
    button_container.appendChild(submit_button);
    button_container.appendChild(reset_button);
    if (!container.contains(box_container)) {
      container.appendChild(box_container);
    }
    Array.from(box_container.children).forEach((elem) => {
      elem.setAttribute("draggable", true);
      elem.style.pointerEvents = "auto";
    });
  });

  restart_button.addEventListener("click", () => {
    clearAnswers(true);
    button_container.innerHTML = "";
    result.innerHTML = "";
    result.style.display = "none";
    button_container.appendChild(submit_button);
    button_container.appendChild(reset_button);
    container.removeChild(box_container);
    box_container = createWordBoxes(content.choices);
    container.appendChild(box_container);
    container.appendChild(result);
    container.appendChild(button_container);
  });

  reset_button.addEventListener("click", () => {
    clearAnswers(true);
  });

  button_container.appendChild(submit_button);
  button_container.appendChild(reset_button);

  container.appendChild(instructionContainer);
  container.appendChild(question);
  container.appendChild(box_container);
  container.appendChild(result);
  container.appendChild(button_container);
  el.appendChild(container);

  model.on("msg:custom", (content) => {
    if (content.command === "verify_result") {
      const results = content.results;
      let correctCount = 0;
      Object.keys(answerStatus).forEach((answerID, idx) => {
        let answerBox = answerStatus[answerID][1];
        if (answerBox.classList.contains("correct")) {
          correctCount++;
        } else {
          if (results[idx] === true) {
            if (!answerBox.classList.contains("correct")) {
              answerBox.classList.add("correct");
            }

            answerBox.innerHTML = answerBox.innerText + correctAnswerIcon;
            correctCount++;
          } else {
            if (!answerBox.classList.contains("incorrect")) {
              answerBox.classList.add("incorrect");
            }

            answerBox.innerHTML = answerBox.innerText + wrongAnswerIcon;
          }
        }
      });

      if (correctCount === totalCount) {
        result.innerHTML = "All correct!";
        button_container.innerHTML = "";
        button_container.appendChild(restart_button);
      } else {
        result.innerHTML = `Score: ${correctCount} / ${totalCount}`;
        button_container.innerHTML = "";
        button_container.appendChild(retry_button);
      }
    }
  });
}

export default { render };
