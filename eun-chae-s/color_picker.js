function render({ model, el }) {
      let container = document.createElement("div");
      container.className="picker-widget";

      let input = document.createElement("input");
      input.type = "color";
      input.id = "picker"

      let button = document.createElement("button");
      button.innerHTML = "Confirm";

      button.addEventListener("click", () => {
        model.set("colour", input.value);
        container.style.backgroundColor = input.value;
        span.innerHTML = model.get("colour") === "" ? "Now choose the color!" : `You chose ${model.get("colour")}`;
        model.save_changes();
      });

      let span = document.createElement("span");
      span.innerHTML = model.get("colour") === "" ? "Now choose the color!" : `You chose ${model.get("colour")}`;

      el.classList.add("picker-widget");
      container.appendChild(input);
      container.appendChild(button);
      container.appendChild(span);
      el.appendChild(container);
    }
    export default { render };