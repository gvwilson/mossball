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

function dragWord(event) {
  event.dataTransfer.clearData();
  draggedWord = event.target;
  event.dataTransfer.setData("text", event.target.id);
}

function dropWord(event) {
  event.preventDefault();
  console.log("dropping the word");
  const wordID = event.dataTransfer.getData("text");
  console.log("What's the item? ", wordID, draggedWord);
  event.target.innerText = draggedWord.innerText;
  event.target.className = "filled";
  if (answerStatus[event.target.id] !== undefined) {
    answerStatus[event.target.id].className = "word-box";
  }
  answerStatus[event.target.id] = draggedWord;
  draggedWord.className += " selected";
}

function createAnswerBox(index) {
  let blankBox = document.createElement("div");
  blankBox.className = "blank";
  blankBox.id = `answer-${index}`;
  // TODO: figure out why adding dragover should be added to make ondrop work
  blankBox.addEventListener("dragover", (event) => event.preventDefault());
  blankBox.addEventListener("drop", (event) => dropWord(event));
  answerStatus[blankBox.id] = undefined;

  return blankBox;
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
  // replace {{VAR*}} with the box
  const question_text = model.get("data")["question"];
  question.innerHTML = "";
  let lastIndex = 0;
  let matchIndex = 0;
  question_text.replace(/\{\{VAR\d\}\}/gi, (match, offset) => {
    if (lastIndex !== offset) {
      question.appendChild(
        document.createTextNode(question_text.substring(lastIndex, offset))
      );
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
  const solution = model.get("data")["solution"];
  let box_container = document.createElement("div");
  box_container.className = "words-container";
  const random_order = shuffleArray(solution);
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
  button_container.appendChild(submit_button);

  container.appendChild(instruction);
  container.appendChild(question);
  container.appendChild(box_container);
  container.appendChild(button_container);
  el.appendChild(container);
}
export default { render };
