import confetti from "https://esm.sh/canvas-confetti@1";
/** @typedef {{ value: number }} Model */

const createSubmitButton = () => {
	let submitButton = document.createElement("button");
	submitButton.classList.add("submit-btn");
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
	showSolutionButton.classList.add("solution-btn");
	showSolutionButton.type = "button";
	showSolutionButton.textContent = "Show Solution";
	return showSolutionButton;
}

const CLASS_STATES = [
	"selected",
	"correct",
	"incorrect",
	"disabled",
	"disabled-correct",
]

/** @type {import("npm:@anywidget/types").Render<Model>} */
function render({ model, el }) {
	el.classList.add("multiple_choice");
	let form = document.createElement("div");
	form.classList.add("form-group");

	let options = model.data.options;
	let titleText = model.data.title;

	let title = document.createElement("h2");
	title.classList.add("title");
	title.textContent = titleText;
	el.appendChild(title);

	options.forEach((option) => {
		let inputGroup = document.createElement("div");
		inputGroup.classList.add("input-group");

		let input = document.createElement("input");
		input.type = "radio";
		input.name = "multiple_choice";
		input.value = option.value;
		input.id = `option${option.value}`;

		input.addEventListener("change", () => {
			model.value = option.value;
			inputGroup.classList.add("selected");
			// remove selected from other groups
			Array.from(form.children).forEach((group) => {
				if (group !== inputGroup) {
					group.classList.remove("selected");
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

	let solutionButton = createSolutionButton();
	solutionButton.addEventListener("click", () => {
		// Reveal correct option
		let correct = options.find((option) => option.correct).value;
		let correctGroup = form.querySelector(`#option${correct}`).parentNode;
		correctGroup.classList.add("correct");

		let inputGroups = Array.from(form.children);
		inputGroups.forEach((group) => {
			console.log(group);
			group.classList.add("disabled");
		});
	});

	let submitButton = createSubmitButton();
	submitButton.addEventListener("click", () => {
		let selected = form.querySelector(".selected");
		let correct = options.find((option) => option.correct).value;

		// if no option checked
		if (selected === null) {
			return;
		}

		if (model.value === correct) {
			// Mark selected option as correct
			if (selected) {
				selected.classList.add("correct");
			}
			confetti();
			buttonGroup.appendChild(resetButton);

			let inputGroups = Array.from(form.children);
			inputGroups.forEach((group) => {
				if (group !== selected) {
					group.classList.add("disabled");
				}
			});
		} else {
			buttonGroup.appendChild(solutionButton);
			buttonGroup.appendChild(resetButton);

			// mark selected option as wrong
			if (selected) {
				selected.classList.add("incorrect");
			}
		}
	});

	let resetButton = createResetButton();
	resetButton.addEventListener("click", () => {
		model.value = null;
		form.querySelector(".selected input").checked = false;

		Array.from(form.children).forEach((group) => {
			group.classList.remove(...CLASS_STATES);
		});
		buttonGroup.removeChild(resetButton);
		if (buttonGroup.contains(solutionButton)) {
			buttonGroup.removeChild(solutionButton);
		}
	});

	buttonGroup.appendChild(submitButton);

	el.appendChild(form);
	el.appendChild(buttonGroup);
}

export default { render };
