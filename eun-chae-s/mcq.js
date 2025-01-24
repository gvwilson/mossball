function render({ model, el }) {
  let container = document.createElement("div");
  container.className = "mcq-widget";
  let questions = model.get("questions").questions;

  questions.forEach((element, question_index) => {
    let question_box = document.createElement("div");
    question_box.className = "question";
    let question = document.createElement("span");
    question.className = "question-title";
    question.innerHTML = element.question;
    let options = document.createElement("ol");

    element.options.forEach((option, option_index) => {
      let item = document.createElement("li");
      item.id = `option-${question_index}-${option_index}`;
      let radio = document.createElement("input");
      radio.type = "radio";
      radio.value = option;
      radio.name = question_index;
      radio.id = `${question_index}-${option_index}`;

      let label = document.createElement("label");
      label.setAttribute("for", `${question_index}-${option_index}`);
      label.innerHTML = option;
      item.appendChild(radio);
      item.appendChild(label);

      // onSelected
      radio.addEventListener("click", () => {
        let original_selection = model.get("_selected_options");
        if (original_selection.length == 0) {
          original_selection = [...Array(questions.length)].map((x) => -1);
        }

        original_selection[question_index] = option_index;
        model.set("_selected_options", original_selection);
        model.save_changes();
      });

      options.appendChild(item);
    });

    question_box.appendChild(question);
    question_box.appendChild(options);
    container.appendChild(question_box);
  });

  // TODO: show the total number of correct questions by clicking submit button
  let submit_button = document.createElement("button");
  submit_button.innerText = "Submit";
  submit_button.className = "submit";
  submit_button.addEventListener("click", () => {
    let selection = model.get("_selected_options");
    let total_correct = 0;
    selection.forEach((option, question_index) => {
      let question = container.childNodes.item(question_index);
      question.childNodes.item(1).childNodes.forEach((item) => {
        item.className = "";
      });

      let option_item = question.childNodes.item(1).childNodes.item(option);

      if (option == questions[question_index].correct_answer) {
        total_correct += 1;
        option_item.className = "correct";
        // Enhancement idea: add icon
      } else {
        option_item.className = "incorrect";
        // Enhancement idea: add icon
        // Enhancement idea: whether to show the correct answer as well
      }
    });
  });

  container.appendChild(submit_button);
  el.appendChild(container);
}
export default { render };
