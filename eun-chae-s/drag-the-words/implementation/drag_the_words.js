// Variables
// Icons
//const correctAnswerIcon =
  '<span>&nbsp;</span><svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>';
//const wrongAnswerIcon =
  '<span>&nbsp;</span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>';

const correctAnswerIcon = `<svg fill="#0a6000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="checkmark">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" 
  stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>checkmark2</title> 
  <path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 
  12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 
  8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path> </g></svg>`;

const wrongAnswerIcon = `<svg fill="#8f0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="x-mark">
<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
</g><g id="SVGRepo_iconCarrier"> <title>cancel2</title> <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 
2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 
0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 
6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path> </g></svg>`;


// the word that is currently dragged
let draggedWord = null;
// key: each blank box ID, value: [its index in the solution list, the blank box HTML element, the selected word box HTML element]
let answerStatus = {};
let solution = [];
// key: word, value: [total count, current count]
let wordCount = {};

// helper functions
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

  // if the answer box was already filled with another word
  // then decrement the count of that word
  if (answerStatus[event.target.id][2] !== undefined) {
    answerStatus[event.target.id][2].className = "word-box";
    wordCount[event.target.innerText][1] -= 1;
    answerStatus[event.target.id][2].setAttribute("draggable", true);
    answerStatus[event.target.id][2].style.cursor = "pointer";
  }

  event.target.innerText = draggedWord.innerText;
  event.target.className = "filled";
  answerStatus[event.target.id][2] = draggedWord;
  wordCount[event.target.innerText][1] += 1;

  // if the current count of this word is same as the actual count of this word in all answers
  // then set the corresponding box to be disabled for dragging
  if (
    wordCount[event.target.innerText][0] ===
    wordCount[event.target.innerText][1]
  ) {
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

function checkAnswers() {
  Object.keys(answerStatus).forEach((answerID) => {
    var idx = answerStatus[answerID][0];
    if (answerStatus[answerID][1].innerText !== solution[idx]) {
      answerStatus[answerID][1].className += " incorrect";
      answerStatus[answerID][1].innerHTML += wrongAnswerIcon;
    } else {
      answerStatus[answerID][1].className += " correct";
      answerStatus[answerID][1].innerHTML += correctAnswerIcon;
    }
  });
}

/**
 *
 * @param {Boolean} clear_all: whether to clear all answer boxes or not
 */
function clearAnswers(clear_all = false) {
  Object.keys(answerStatus).forEach((answerID) => {
    var idx = answerStatus[answerID][0];
    if (
      clear_all ||
      !answerStatus[answerID][1].innerText.includes(solution[idx])
    ) {
      answerStatus[answerID][1].className = "blank";
      if (answerStatus[answerID][2] !== undefined) {
        wordCount[answerStatus[answerID][2].innerText][1] -= 1;
        answerStatus[answerID][2].className = "word-box";
        answerStatus[answerID][2].setAttribute("draggable", true);
        answerStatus[answerID][2].style.cursor = "pointer";
      }
      answerStatus[answerID][1].innerHTML = "";
      answerStatus[answerID][2] = undefined;
    } else {
      answerStatus[answerID][1].className = "filled correct";
      answerStatus[answerID][1].innerHTML = solution[idx];
    }
  });
}

function showSolution() {
  Object.keys(answerStatus).forEach((answerID) => {
    var idx = answerStatus[answerID][0];
    answerStatus[answerID][1].innerText = solution[idx];
    answerStatus[answerID][1].className = "revealed";
    answerStatus[answerID][2] = undefined;
  });

  // Reset the current count for all the words as 0
  Object.keys(wordCount).forEach((word) => {
    wordCount[word][1] = 0;
  });
}

function createWordBoxes() {
  let box_container = document.createElement("div");
  box_container.className = "words-container";
  box_container.innerHTML = "";
  const random_order = shuffleArray(Object.keys(wordCount));
  random_order.forEach((element, idx) => {
    let word = document.createElement("div");
    word.className = "word-box";
    word.id = `word-${idx}`;
    word.innerHTML = element;
    word.setAttribute("draggable", true);
    word.addEventListener("dragstart", (event) => dragWord(event));
    box_container.appendChild(word);
  });

  return box_container;
}

/**
 *
 * @param {String} question_text
 */
function createQuestionContainer(question_text) {
  let question = document.createElement("div");
  question.className = "question";

  // TODO: sanity check {{}} -- backend task?
  // replace {{solution}} with the box
  question.innerHTML = "";
  let lastIndex = 0;
  let matchIndex = 0;
  question_text.replace(/\{\{(.*?)\}\}/gi, (match, p1, offset) => {
    if (lastIndex !== offset) {
      let spanText = document.createElement("span");
      spanText.innerText = question_text.substring(lastIndex, offset);
      question.appendChild(spanText);
    }

    solution.push(p1);
    if (p1 in wordCount) {
      wordCount[p1][0] += 1;
    } else {
      wordCount[p1] = [1, 0];
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

// main render function
function render({ model, el }) {
  let container = document.createElement("div");
  container.className = "drag-words-widget";

  // instruction
  let instruction = document.createElement("div");
  instruction.className = "title";
  instruction.innerHTML = model.get("data")["instruction"];

  // question
  let question = createQuestionContainer(model.get("data")["question"]);

  // word boxes
  let box_container = createWordBoxes();

  // buttons
  let button_container = document.createElement("div");
  button_container.className = "bottom-banner";

  let submit_button = document.createElement("button");
  submit_button.innerHTML = "Check";
  submit_button.className = "check-button";

  let show_solution_button = document.createElement("button");
  show_solution_button.innerHTML = "Show Solution";
  show_solution_button.className = "try-button";

  let retry_button = document.createElement("button");
  retry_button.innerHTML = "Retry";
  retry_button.className = "try-button";

  let restart_button = document.createElement("button");
  restart_button.innerHTML = "Restart";
  restart_button.className = "try-button";

  submit_button.addEventListener("click", () => {
    checkAnswers();
    button_container.innerHTML = "";
    button_container.appendChild(show_solution_button);
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

  show_solution_button.addEventListener("click", () => {
    showSolution();
    button_container.innerHTML = "";
    button_container.appendChild(restart_button);
    container.removeChild(box_container);
  });

  restart_button.addEventListener("click", () => {
    clearAnswers(true);
    button_container.innerHTML = "";
    button_container.appendChild(submit_button);
    container.removeChild(button_container);
    box_container = createWordBoxes();
    container.appendChild(box_container);
    container.appendChild(button_container);
  });

  // on the initial render, we have Submit button visible
  button_container.appendChild(submit_button);

  container.appendChild(instruction);
  container.appendChild(question);
  container.appendChild(box_container);
  container.appendChild(button_container);
  el.appendChild(container);
}
export default { render };
