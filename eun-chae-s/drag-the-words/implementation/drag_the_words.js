// helper functions
function shuffleArray(array) {
  const newArr = array.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }

  return newArr;
}

// Status of all answer blanks + currently dragging word
let draggedWord = null;
let answerStatus = {};
let solution = [];
let wordCount = {};

function dragWord(event) {
  event.dataTransfer.clearData();
  draggedWord = event.target;
  event.dataTransfer.setData("text", event.target.id);
}

function dropWord(event) {
  event.preventDefault();

  if (answerStatus[event.target.id][2] !== undefined) {
    answerStatus[event.target.id][2].className = "word-box";
    wordCount[event.target.innerText][1] -= 1;
    answerStatus[event.target.id][2].setAttribute("draggable", true);
    answerStatus[event.target.id][2].style.cursor = "pointer";
    // console.log(
    //   "count decreased for",
    //   event.target.innerText,
    //   wordCount[event.target.innerText]
    // );
  }

  event.target.innerText = draggedWord.innerText;
  event.target.className = "filled";
  answerStatus[event.target.id][2] = draggedWord;
  wordCount[event.target.innerText][1] += 1;
  if (
    wordCount[event.target.innerText][0] ===
    wordCount[event.target.innerText][1]
  ) {
    draggedWord.className += " selected";
    draggedWord.setAttribute("draggable", false);
    draggedWord.style.cursor = "default";
  }
  console.log("after dropping the word", wordCount);
}

function createAnswerBox(index) {
  let blankBox = document.createElement("div");
  blankBox.className = "blank";
  blankBox.id = `answer-${index}`;
  // TODO: figure out why adding dragover should be added to make ondrop work
  blankBox.addEventListener("dragover", (event) => event.preventDefault());
  blankBox.addEventListener("drop", (event) => dropWord(event));
  answerStatus[blankBox.id] = [index, blankBox, undefined];

  return blankBox;
}

function checkAnswers(solution) {
  Object.keys(answerStatus).forEach((answerID) => {
    var idx = answerStatus[answerID][0];
    if (answerStatus[answerID][1].innerText !== solution[idx]) {
      answerStatus[answerID][1].className += " incorrect";
      answerStatus[answerID][1].innerHTML +=
        '<span>&nbsp;</span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>';
    } else {
      answerStatus[answerID][1].className += " correct";
      answerStatus[answerID][1].innerHTML +=
        '<span>&nbsp;</span><svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>';
    }
  });
}

function clearAnswers(solution) {
  Object.keys(answerStatus).forEach((answerID) => {
    var idx = answerStatus[answerID][0];
    if (!answerStatus[answerID][1].innerText.includes(solution[idx])) {
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
  // console.log("Retry: wordcount", wordCount);
}

function showSolution(solution) {
  Object.keys(answerStatus).forEach((answerID) => {
    var idx = answerStatus[answerID][0];
    answerStatus[answerID][1].innerText = solution[idx];
    answerStatus[answerID][1].className = "revealed";
  });
}

// main render function
function render({ model, el }) {
  let container = document.createElement("div");
  container.className = "drag-words-widget";

  // instruction text
  let instruction = document.createElement("div");
  instruction.className = "instruction-text";
  instruction.innerHTML = model.get("data")["instruction"];

  // question text
  let question = document.createElement("div");
  question.className = "question";
  // replace {{solution}} with the box
  const question_text = model.get("data")["question"];
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

  // word boxes
  let box_container = document.createElement("div");
  box_container.className = "words-container";
  console.log(wordCount);
  // // get
  // wordCount = solution.reduce((acc, word) => {
  //   acc[word] = [(acc[word]?.[0] || 0) + 1, 0];
  //   return acc;
  // }, {});

  const random_order = shuffleArray(Object.keys(wordCount));
  random_order.forEach((element, idx) => {
    // TODO: define this element as a new element
    let word = document.createElement("div");
    word.className = "word-box";
    word.id = `word-${idx}`;
    word.innerHTML = element;
    word.setAttribute("draggable", true);
    word.addEventListener("dragstart", (event) => dragWord(event));
    box_container.appendChild(word);
  });

  let button_container = document.createElement("div");
  button_container.className = "bottom-banner";
  let submit_button = document.createElement("button");
  submit_button.innerHTML = "Submit";
  submit_button.className = "submit";

  let show_solution_button = document.createElement("button");
  show_solution_button.innerHTML = "Show Solution";
  show_solution_button.className = "show-solution";

  let retry_button = document.createElement("button");
  retry_button.innerHTML = "Retry";
  retry_button.className = "retry";

  submit_button.addEventListener("click", () => {
    checkAnswers(solution);
    button_container.removeChild(submit_button);
    button_container.appendChild(show_solution_button);
    button_container.appendChild(retry_button);
  });

  retry_button.addEventListener("click", () => {
    clearAnswers(solution);
    button_container.removeChild(retry_button);
    if (button_container.contains(show_solution_button)) {
      button_container.removeChild(show_solution_button);
    }
    button_container.appendChild(submit_button);
    if (!container.contains(box_container)) {
      container.appendChild(box_container);
    }
  });

  show_solution_button.addEventListener("click", () => {
    showSolution(solution);
    button_container.removeChild(show_solution_button);
    button_container.removeChild(retry_button);
    container.removeChild(box_container);
  });

  button_container.appendChild(submit_button);

  container.appendChild(instruction);
  container.appendChild(question);
  container.appendChild(box_container);
  container.appendChild(button_container);
  el.appendChild(container);
}
export default { render };
