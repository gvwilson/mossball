function render({ model, el }) {
    let container = document.createElement("div");
    container.innerHTML = model.get("slides")[model.get("currSlide")];

    let prev = document.createElement("button");
    prev.innerHTML = "Prev";
    prev.disabled = model.get("currSlide") === 0;
    let next = document.createElement("button");
    next.innerHTML = "Next";
    next.disabled = model.get("currSlide") === model.get("slides").length - 1;
    prev.addEventListener("click", () => {
        let curr = model.get("currSlide");
        if (curr > 0) {
            model.set("currSlide", curr - 1);
            model.save_changes();
        }
    });
    next.addEventListener("click", () => {
        let curr = model.get("currSlide");
        if (curr < model.get("slides").length - 1) {
            model.set("currSlide", curr + 1);
            model.save_changes();
        }
    });

    model.on("change:currSlide", () => {
        container.innerHTML = model.get("slides")[model.get("currSlide")];
        prev.disabled = model.get("currSlide") === 0;
        next.disabled = model.get("currSlide") === model.get("slides").length - 1;
    });
    el.classList.add("slides-widget");
    el.appendChild(container);
    el.appendChild(prev);
    el.appendChild(next);
  }
  export default { render };