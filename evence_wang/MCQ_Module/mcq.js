const createElement = (tag, classes = []) => {
  const element = document.createElement(tag);
  for (const cls of classes) {
    element.classList.add(cls);
  }
  return element;
};

const renderQuestion = (question, model) => {
  const questionWrapper = createElement("div", ["question-wrapper"]);

  const questionTitle = createElement("h2");
  questionTitle.innerText = question.question;
  questionWrapper.appendChild(questionTitle);

  const optionsList = createElement("ul");
  for (const option of question.options) {
    const li = createElement("li");

    const input = createElement("input");
    input.type = "radio";
    input.name = `question-${question.id}`;
    input.id = `${question.id}-${option}`;
    input.value = option;

    const checkDiv = createElement("div", ["check"]);
    const label = createElement("label");
    label.setAttribute("for", `${question.id}-${option}`);
    label.innerText = option;

    input.addEventListener("change", () => {
      const allOptions = optionsList.querySelectorAll("li");
      for (const opt of allOptions) {
        opt.classList.remove("selected", "correct", "incorrect");
      }

      li.classList.add("selected");

      const answers = model.get("answers") || {};
      const newAnswers = { ...answers, [question.id]: option };
      model.set("answers", newAnswers);
      model.save_changes();
    });

    li.appendChild(input);
    li.appendChild(checkDiv);
    li.appendChild(label);
    optionsList.appendChild(li);
  }

  questionWrapper.appendChild(optionsList);
  return questionWrapper;
};

const renderSubmitButton = (model, el) => {
  const submitButton = createElement("button", ["submit-button"]);
  submitButton.innerText = "Submit";
  submitButton.type = "button";

  let isSubmitted = false;

  submitButton.addEventListener("click", async () => {
    if (!isSubmitted) {
      try {
        const answers = model.get("answers") || {};
        const inputs = el.querySelectorAll('input[type="radio"]');
        for (const input of inputs) {
          input.disabled = true;
        }

        const response = await fetch('http://127.0.0.1:5000/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'http://localhost:2718'
          },
          mode: 'cors',
          body: JSON.stringify({ answers }),
      });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        const results = await response.json();

        const allOptions = el.querySelectorAll("li");
        for (const opt of allOptions) {
          opt.classList.remove("selected", "correct", "incorrect");
        }

        for (const [questionId, isCorrect] of Object.entries(results)) {
          const selectedInput = el.querySelector(`input[name="question-${questionId}"]:checked`);
          if (selectedInput) {
            const li = selectedInput.closest("li");
            li.classList.add(isCorrect ? "correct" : "incorrect");
          }
        }

        submitButton.innerText = "Reset";
        isSubmitted = true;
      } catch (error) {
        console.error('Error submitting answers:', error);
        const inputs = el.querySelectorAll('input[type="radio"]');
        for (const input of inputs) {
          input.disabled = false;
        }
        alert('Failed to submit answers. Please try again.');
      }
    } else {
      const inputs = el.querySelectorAll('input[type="radio"]');
      for (const input of inputs) {
        input.disabled = false;
        input.checked = false;
      }
      const allOptions = el.querySelectorAll("li");
      for (const opt of allOptions) {
        opt.classList.remove("selected", "correct", "incorrect");
      }

      model.set("answers", {});
      model.save_changes();
      submitButton.innerText = "Submit";
      isSubmitted = false;
    }
  });

  return submitButton;
};

export async function render({ model, el }) {
  try {
    const response = await fetch('http://127.0.0.1:5000/questions', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:2718'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const questions = await response.json();
    model.set("questions", questions);

    const initialRender = () => {
      el.innerHTML = "";
      const container = createElement("div", ["container"]);
      const form = createElement("form", ["mcq-form"]);

      for (const q of questions) {
        form.appendChild(renderQuestion(q, model));
      }

      const submitButton = renderSubmitButton(model, el);
      container.appendChild(form);
      container.appendChild(submitButton);
      el.appendChild(container);
    };

    const reRender = () => {
      const answers = model.get("answers") || {};
      const allOptions = el.querySelectorAll("li");
      for (const opt of allOptions) {
        opt.classList.remove("selected", "correct", "incorrect");
      }

      for (const [id, answer] of Object.entries(answers)) {
        const input = el.querySelector(`input[name="question-${id}"][value="${answer}"]`);
        if (input) {
          input.checked = true;
          const li = input.closest("li");
          li.classList.add("selected");
        }
      }
    };

    model.on("change:answers", reRender);
    initialRender();
  } catch (error) {
    console.error('Error rendering MCQ:', error);
    el.innerHTML = '<div class="alert">Failed to load questions. Please try again later.</div>';
  }
}

export default { render };
