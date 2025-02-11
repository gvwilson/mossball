/**
 * @file timer.js
 * @description A Timer class to handle elapsed and countdown time.
 */
import ICONS from "./icons";

const TimerMode = {
  COUNTDOWN: "COUNTDOWN",
  COUNTUP: "COUNTUP",
};

class Timer {
  constructor(time, mode) {
    this.initialTime = time || 0;
    this.time = time || 0;
    this.interval = null;
    this.mode = mode || TimerMode.COUNTUP;
    this.element = null;
    this.isTimerRunning = false;
  }

  createTimerElement() {
    this.element = document.createElement("div");
    this.element.classList.add("timer");
    this.element.innerHTML = ICONS.TimerIcon + " " + this.getFormattedTime();
    return this.element;
  }

  getFormattedTime() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  updateTimer() {
    this.element.innerHTML = ICONS.TimerIcon + " " + this.getFormattedTime();
  }

  start(callback) {
    if (this.isTimerRunning) {
      return;
    }
    this.isTimerRunning = true;
    this.interval = setInterval(() => {
      this.time += this.mode === TimerMode.COUNTDOWN ? -1 : 1;
      this.updateTimer();
      if (this.time === 0 && this.mode === TimerMode.COUNTDOWN) {
        clearInterval(this.interval);
        callback();
      }
    }, 1000);
  }

  stop() {
    this.isTimerRunning = false;
    clearInterval(this.interval);
    this.interval = null;
  }

  reset() {
    this.stop();
    this.time = this.initialTime;
    this.updateTimer();
  }
}

export default Timer;
