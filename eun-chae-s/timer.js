function render({ model, el }) {
  let container = document.createElement("div");
  container.className = "timer-widget";

  let timer_text = document.createElement("div");
  let minute = Math.floor(model.get("curr_val") / 60);
  let second = model.get("curr_val") % 60;
  timer_text.innerHTML = `${minute.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}:${second.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;
  timer_text.id = "timer-text";

  let timerInterval = null;

  let start_button = document.createElement("button");
  start_button.innerHTML = "Start";
  start_button.addEventListener("click", () => {
    if (timerInterval) {
      return;
    } else {
      timerInterval = setInterval(() => {
        model.set("curr_val", model.get("curr_val") + 1);
        minute = Math.floor(model.get("curr_val") / 60);
        second = model.get("curr_val") % 60;
        timer_text.innerHTML = `${minute.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}:${second.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`;
        model.save_changes();
      }, 1000);
    }
  });

  let stop_button = document.createElement("button");
  stop_button.innerHTML = "Stop";
  stop_button.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    model.save_changes();
  });

  let reset_button = document.createElement("button");
  reset_button.innerHTML = "Reset";
  reset_button.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    model.set("curr_val", 0);
    timer_text.innerHTML = "00:00";
    model.save_changes();
  });

  container.appendChild(timer_text);

  let button_container = document.createElement("div");
  button_container.id = "button-container";

  button_container.appendChild(start_button);
  button_container.appendChild(stop_button);
  button_container.appendChild(reset_button);

  container.appendChild(button_container);
  el.appendChild(container);
}
export default { render };
