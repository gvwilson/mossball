// helper functions
function shuffleArray(array) {
  const newArr = array.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }

  return newArr;
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
  question.innerHTML = `${question_text.replaceAll(
    /\{\{VAR\d\}\}/gi, // TODO: define this element as a new element
    `<div class="answer-box"></div>`
  )}`;

  // word boxes
  const solution = model.get("data")["solution"];
  let box_container = document.createElement("div");
  box_container.className = "words-container";
  const random_order = shuffleArray(solution);
  random_order.forEach((element) => {
    // TODO: define this element as a new element
    let word = document.createElement("div");
    word.className = "word-box";
    word.innerHTML = element;
    box_container.appendChild(word);
  });

  container.appendChild(instruction);
  container.appendChild(question);
  container.appendChild(box_container);
  el.appendChild(container);
}
export default { render };
