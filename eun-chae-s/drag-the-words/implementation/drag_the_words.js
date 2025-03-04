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

let draggedWord = null;
let answerStatus = {};
let wordCount = {};

function shuffleArray(array) {
  const newArr = array.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
}

function dragWord(event) {
  event.dataTransfer.clearData();
  draggedWord = event.target;
  event.dataTransfer.setData("text", event.target.id);
}

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

  event.target.innerText = draggedWord.innerText;
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
  question.className = "question";
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
    question.appendChild(document.createTextNode(question_text.substring(lastIndex)));
  }
  return question;
}

function createWordBoxes(choices) {
  wordCount = {};
  choices.forEach((word) => {
    if (word in wordCount) {
      wordCount[word][0] += 1;
    } else {
      wordCount[word] = [1, 0];
    }
  });

  let box_container = document.createElement("div");
  box_container.className = "words-container";
  box_container.innerHTML = "";
  const random_order = shuffleArray(choices);
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

function verifyAnswers(model) {
  const answers = [];
  Object.keys(answerStatus).forEach((answerID) => {
    answers.push(answerStatus[answerID][1].innerText.trim());
  });

  model.send({
    command: "verify",
    unique_id: model.get("unique_id"),
    plugin_type: model.get("plugin_type"),
    answer: answers
  });
}

function render({ model, el }) {
  let container = document.createElement("div");
  container.className = "drag-words-widget";
  const content = model.get("data");

  let instruction = document.createElement("div");
  instruction.className = "title";
  instruction.innerHTML = content.instruction;

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

  submit_button.addEventListener("click", () => {
    verifyAnswers(model);
    button_container.innerHTML = "";
    button_container.appendChild(retry_button);
  });

  retry_button.addEventListener("click", () => {
    clearAnswers();
    button_container.innerHTML = "";
    button_container.appendChild(submit_button);
    if (!container.contains(box_container)) {
      container.appendChild(box_container);
    }
  });

  restart_button.addEventListener("click", () => {
    clearAnswers(true);
    button_container.innerHTML = "";
    button_container.appendChild(submit_button);
    container.removeChild(box_container);
    box_container = createWordBoxes(content.choices);
    container.appendChild(box_container);
    container.appendChild(button_container);
  });

  button_container.appendChild(submit_button);

  container.appendChild(instruction);
  container.appendChild(question);
  container.appendChild(box_container);
  container.appendChild(button_container);
  el.appendChild(container);

  model.on("msg:custom", (content) => {
    if (content.command === "verify_result") {
      const results = content.results;
      Object.keys(answerStatus).forEach((answerID, idx) => {
        let answerBox = answerStatus[answerID][1];
        if (!answerBox.classList.contains("correct")) {
          if (results[idx] === true) {
            answerBox.classList.add("correct");
            answerBox.innerHTML += correctAnswerIcon;
          } else {
            answerBox.classList.add("incorrect");
            answerBox.innerHTML += wrongAnswerIcon;
          }
        }
      });

      let allCorrect = true;
      Object.keys(answerStatus).forEach((answerID) => {
        let answerBox = answerStatus[answerID][1];
        if (!answerBox.classList.contains("correct")) {
          allCorrect = false;
        }
      });
      if (allCorrect) {
        button_container.innerHTML = "";
        button_container.appendChild(restart_button);
      }
    }
  });
}

export default { render };
