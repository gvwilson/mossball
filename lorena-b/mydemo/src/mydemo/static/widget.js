import confetti from "https://esm.sh/canvas-confetti@1";

/** @typedef {{ value: number }} Model */

/** @type {import("npm:@anywidget/types").Render<Model>} */
const render = ({ model, el }) => {
	let btn = document.createElement("button");
	btn.innerHTML = `Count ${model.get("value")} !`;
	btn.addEventListener("click", () => {
		model.set("value", model.get("value") + 1);
		model.save_changes();
	});
	model.on("change:value", () => {
		confetti();
		btn.innerHTML = `Count ${model.get("value")} !`;
	});
	el.classList.add("mydemo");
	el.appendChild(btn);
}

export default { render };
