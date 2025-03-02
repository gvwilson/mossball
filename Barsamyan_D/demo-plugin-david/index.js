import confetti from "https://esm.sh/canvas-confetti@1.6.0"

function render({ model, el }) {
    let count = () => model.get("value");

    let btn = document.createElement("button");
    btn.classList.add("counter-button");
    btn.innerHTML = `count: ${count()}`;
    btn.addEventListener("click", () => {
        model.set("value", count() + 1);
        model.save_changes();
    });

    let resetBtn = document.createElement("button");
    resetBtn.classList.add("reset-button");
    resetBtn.innerHTML = "reset";
    resetBtn.addEventListener("click", () => {
        model.set("value", 0);
        model.save_changes();
    });

    model.on("change:value", () => {
        btn.innerHTML = `count: ${count()}`;
        confetti({ angle: count() * 10, spread: count() * 10, particleCount: count() * 10 });
    });

    el.appendChild(btn);
    el.appendChild(resetBtn);
}

export default { render };
