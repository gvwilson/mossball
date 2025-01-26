import confetti from "https://esm.sh/canvas-confetti@1";
/** @typedef {{ value: number }} Model */

const createSubmitButton = () => {
	let submitButton = document.createElement("button");
	submitButton.classList.add("primary-btn");
	submitButton.type = "button";
	submitButton.textContent = "Check";
	return submitButton;
}

const createResetButton = () => {
	let resetButton = document.createElement("button");
	resetButton.classList.add("reset-btn");
	resetButton.type = "button";
	resetButton.textContent = "Reset";
	return resetButton;
}

const createSolutionButton = () => {
	let showSolutionButton = document.createElement("button");
	showSolutionButton.classList.add("primary-btn");
	showSolutionButton.type = "button";
	showSolutionButton.textContent = "Show Solution";
	return showSolutionButton;
}

const CLASS_STATES = {
    SELECTED: "selected",
    CORRECT: "correct",
    INCORRECT: "incorrect",
    DISABLED: "disabled",
};

/** @type {import("npm:@anywidget/types").Render<Model>} */
function render({ model, el }) {
	el.classList.add("multiple_choice");

	let form = document.createElement("div");
	form.classList.add("form-group");

	const questionData = model.data.data;
	const options = questionData.options;
	const titleText = questionData.title;

	const correct = questionData.correct;

	let title = document.createElement("h2");
	title.classList.add("title");
	title.textContent = titleText;
	el.appendChild(title);

	// Adding options to the form
	options.forEach((option) => {
		let inputGroup = document.createElement("div");
		inputGroup.classList.add("input-group");

		let input = document.createElement("input");
		input.type = "radio";
		input.name = "multiple_choice";
		input.value = option.value;
		input.id = `option-${option.value}`;

		input.addEventListener("change", () => {
			model.value = option.value;
			inputGroup.classList.add(CLASS_STATES.SELECTED);
			// remove selected from other groups
			Array.from(form.children).forEach((group) => {
				if (group !== inputGroup) {
					group.classList.remove(CLASS_STATES.SELECTED);
				}
			});
		});

		let label = document.createElement("label");
		label.htmlFor = input.id;
		label.textContent = option.label;

		inputGroup.appendChild(input);
		inputGroup.appendChild(label);

		form.appendChild(inputGroup);

		inputGroup.addEventListener("click", () => {
			input.checked = true;
			input.dispatchEvent(new Event("change"));
		});
	});

	let buttonGroup = document.createElement("div");
	buttonGroup.classList.add("button-group");

	// Show solution button handling
	const handleShowSolution = () => {
		// Reveal correct option
		let correctGroup = form.querySelector(`#option-${correct}`).parentNode;
		correctGroup.classList.add(CLASS_STATES.CORRECT);

		let inputGroups = Array.from(form.children);
		inputGroups.forEach((group) => {
			group.classList.add(CLASS_STATES.DISABLED);
		});
	}

	let solutionButton = createSolutionButton();
	solutionButton.addEventListener("click", handleShowSolution);

	// Submit button handling
	const handleSubmit = () => {
		let selected = form.querySelector(".selected");
		// if no option checked
		if (selected === null) {
			return;
		}
		if (model.value === correct) {
			// Mark selected option as correct
			if (selected) {
				selected.classList.add(CLASS_STATES.CORRECT);
			}
			confetti();
			buttonGroup.appendChild(resetButton);
		} else {
			// mark selected option as wrong
			if (selected) {
				selected.classList.add(CLASS_STATES.INCORRECT);
			}
			buttonGroup.appendChild(solutionButton);
			buttonGroup.appendChild(resetButton);
		}
		buttonGroup.removeChild(submitButton);
		// Disable the other options
		let inputGroups = Array.from(form.children);
		inputGroups.forEach((group) => {
			if (group !== selected) {
				group.classList.add(CLASS_STATES.DISABLED);
			}
		});
	}

	let submitButton = createSubmitButton();
	submitButton.addEventListener("click", handleSubmit);

	// Reset button handling
	const handleReset = () => {
		model.value = null;
		form.querySelector(".selected input").checked = false;
		// Reset input states
		Array.from(form.children).forEach((group) => {
			group.classList.remove(...Object.values(CLASS_STATES));
		});
		buttonGroup.removeChild(resetButton);
		if (buttonGroup.contains(solutionButton)) {
			buttonGroup.removeChild(solutionButton);
		}
		buttonGroup.appendChild(submitButton);
	}

	let resetButton = createResetButton();
	resetButton.addEventListener("click", handleReset);

	buttonGroup.appendChild(submitButton);

	el.appendChild(form);
	el.appendChild(buttonGroup);
}

export default { render };
