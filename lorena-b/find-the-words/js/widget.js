import "./widget.css";
import CONSTANTS from "./constants";
import ICONS from "./icons";
import {
  Grid,
  getSelectedDirection,
  getDiagonalCells,
  getHorizontalCells,
  getVerticalCells,
} from "./grid";
import Timer from "./timer";
import { createElement, setupLayout } from "./utils";

function render({ model, el }) {
  // extract params from model
  const DATA = model.data.data;

  const { leftColumn, rightColumn } = setupLayout(el, DATA);
  const { gridWidth, gridHeight, barColor } = DATA.config;

  let gridContainer = createElement("div", {
    className: "grid",
    style: `width: ${gridWidth * CONSTANTS.CELL_SIZE}px; height: ${
      gridHeight * CONSTANTS.CELL_SIZE + CONSTANTS.CELL_PADDING
    }px;`,
  });
  leftColumn.appendChild(gridContainer);

  const WORDS = DATA.words;

  // Initalize the playing grid and word bank
  const grid = new Grid(WORDS, gridWidth, gridHeight);
  const gridElement = grid.createGridElement(gridContainer);
  gridContainer.appendChild(gridElement);

  let bottomWrapper = createElement("div", { className: "bottom-wrapper" });
  leftColumn.appendChild(bottomWrapper);

  let wordBank = createElement("div", {
    className: "word-bank",
    style: `height: ${
      gridHeight * CONSTANTS.CELL_SIZE + CONSTANTS.CELL_PADDING
    }px;`,
  });

  let wordTitle = createElement("h4", {
    innerText: CONSTANTS.SEARCH_COPY,
    id: "word-title",
  });

  wordBank.appendChild(wordTitle);
  rightColumn.appendChild(wordBank);

  WORDS.forEach((word) => {
    let wordElement = createElement("div", {
      className: "word",
      id: word.toLowerCase(),
      innerText: word,
    });
    wordBank.appendChild(wordElement);
  });

  const { timed, countdown } = DATA.config.gameMode;

  const setupStartGameOverlay = () => {
    let startGameOverlay = createElement("div", {
      className: "start-game-overlay",
      style: {
        top: `${gridContainer.offsetTop}px`,
        left: `${gridContainer.offsetLeft}px`,
        width: gridContainer.style.width,
        height: gridContainer.style.height,
      },
    });
    let startGameButton = createElement("button", {
      className: "start-game-button",
      innerText: CONSTANTS.START_GAME_COPY,
    });
    startGameOverlay.appendChild(startGameButton);
    leftColumn.appendChild(startGameOverlay);

    startGameButton.addEventListener("click", () => {
      startGameOverlay.style.display = "none";
      timer.start(() => {
        resetGameState();
        alert("Time's up!");
      });
    });
  };

  // if gamemode is timed, then show an overlay over the grid to start the game
  if (timed) {
    setupStartGameOverlay();
  }

  const timerMode = timed ? "COUNTDOWN" : "COUNTUP";
  const initialTime = timed ? countdown : 0;

  let timer = new Timer(initialTime, timerMode);
  let timerElement = timer.createTimerElement();

  let endButton = createElement("button", {
    className: "end-button",
    innerText: CONSTANTS.END_BUTTON_COPY,
  });

  bottomWrapper.appendChild(timerElement);
  bottomWrapper.appendChild(endButton);

  const WORD_STATES = {
    FOUND: "found",
    UNFOUND: "unfound",
    INCORRECT: ".incorrect",
    CHECKMARK: ".checkmark",
  };

  const showStartOverlay = () => {
    // if start overlay exists (timed mode), show it
    let startOverlay = leftColumn.querySelector(".start-game-overlay");
    if (startOverlay) {
      startOverlay.style.display = "flex";
    }
  };

  const resetWordBank = () => {
    // Reset word bank
    wordBank.querySelectorAll(".word").forEach((word) => {
      word.classList.remove(WORD_STATES.FOUND);
      word.classList.remove(WORD_STATES.UNFOUND);
      // remove the icons
      word.querySelector(WORD_STATES.CHECKMARK)?.remove();
      word.querySelector(WORD_STATES.INCORRECT)?.remove();
    });
  };

  const resetGameState = () => {
    // Remove selection bars from grid
    gridContainer.querySelectorAll(".selection-svg").forEach((bar) => {
      bar.remove();
    });
    resetWordBank();
    showStartOverlay();
    updateScore();
    timer.reset();
  };

  const handleEndButton = () => {
    gridContainer.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.remove("selected");
    });
    // mark unfound words
    wordBank.querySelectorAll(".word").forEach((word) => {
      if (!word.classList.contains("found")) {
        let incorrectIcon = createElement("div", {
          className: "incorrect",
          innerHTML: ICONS.Incorrect,
        });
        word.appendChild(incorrectIcon);
        word.classList.add("unfound");
      }
    });

    setTimeout(() => {
      window.alert("Game over! Click OK to reset.");
      resetGameState();
    }, 0);
  };

  endButton.addEventListener("click", handleEndButton);

  const setScoreCounter = (foundWords) => {
    return `<b>${foundWords}</b> of <b>${WORDS.length}</b> words found`;
  };

  let scoreCounter = createElement("div", {
    className: "score-counter",
    innerHTML: setScoreCounter(0),
  });

  rightColumn.appendChild(scoreCounter);

  const updateScore = () => {
    let foundWords = wordBank.querySelectorAll(".word.found").length;
    scoreCounter.innerHTML = setScoreCounter(foundWords);
  };

  // Grid selection listeners
  let isMouseDown = false;
  let svgOverlay = null;
  let startCell = null;

  const initSvgOverlay = () => {
    // Initialize selection overlay
    svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.classList.add("selection-svg");
    gridContainer.appendChild(svgOverlay);
  };

  gridContainer.addEventListener("mousedown", (e) => {
    timer.start(() => {
      resetGameState();
      alert("Time's up!");
    });
    if (e.target.classList.contains("grid-cell")) {
      isMouseDown = true;
      startCell = e.target;
      initSvgOverlay();
    }
  });

  gridContainer.addEventListener("mousemove", (e) => {
    if (isMouseDown && svgOverlay && e.target.classList.contains("grid-cell")) {
      let endCell = e.target;
      updateSelectionPath(startCell, endCell);
      getSelectedCells(startCell, endCell);
    }
  });

  const validateWord = (selectedCells) => {
    const upperCaseWords = WORDS.map((word) => word.toUpperCase());
    let selectedWord = selectedCells.map((cell) => cell.innerText).join("");
    let isWordFound = upperCaseWords.includes(selectedWord);
    return {
      isWordFound,
      selectedWord,
    };
  };

  const markFoundWord = (word) => {
    let wordElement = wordBank.querySelector(`#${word.toLowerCase()}`);
    if (!wordElement.querySelector(".checkmark")) {
      const checkMarkIcon = createElement("div", {
        className: "checkmark",
        innerHTML: ICONS.Checkmark,
      });
      wordElement.appendChild(checkMarkIcon);
    }
    wordElement.classList.add("found");
  };

  const checkSelectedWord = (selectedCells) => {
    const { isWordFound, selectedWord } = validateWord(selectedCells);
    if (!isWordFound) {
      return false;
    }
    markFoundWord(selectedWord);
    updateScore();
    return isWordFound;
  };

  const calculatePathPoints = (startCell, endCell) => {
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const containerRect = gridContainer.getBoundingClientRect();

    const pathStartX =
      startRect.left + startRect.width / 2 - containerRect.left;
    const pathStartY = startRect.top + startRect.height / 2 - containerRect.top;
    const pathEndX = endRect.left + endRect.width / 2 - containerRect.left;
    const pathEndY = endRect.top + endRect.height / 2 - containerRect.top;

    return {
      pathStartX,
      pathStartY,
      pathEndX,
      pathEndY,
      cellHeight: startRect.height,
    };
  };

  const createSelectionPath = () => {
    let selectionPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    selectionPath.classList.add("selection-path");
    svgOverlay.appendChild(selectionPath);
    return selectionPath;
  };

  const setPathAttrs = (selectionPath, startCell, endCell, pathPoints) => {
    const { pathStartX, pathStartY, pathEndX, pathEndY, cellHeight } =
      pathPoints;
    // Update path
    const pathD = `M ${pathStartX} ${pathStartY} L ${pathEndX} ${pathEndY}`;
    selectionPath.setAttribute("d", pathD);
    selectionPath.setAttribute(
      "stroke",
      barColor || CONSTANTS.DEFAULT_BAR_COLOR
    );
    selectionPath.setAttribute("stroke-opacity", "0.4");
    selectionPath.setAttribute("stroke-width", `${cellHeight}px`);
    selectionPath.setAttribute("stroke-linecap", "round");
    selectionPath.dataset.startRow = startCell.dataset.row;
    selectionPath.dataset.startCol = startCell.dataset.col;
    selectionPath.dataset.endRow = endCell.dataset.row;
    selectionPath.dataset.endCol = endCell.dataset.col;
  };

  const updateSelectionPath = (startCell, endCell) => {
    const pathPoints = calculatePathPoints(startCell, endCell);
    // Create or update path
    let selectionPath =
      svgOverlay.querySelector(".selection-path") || createSelectionPath();
    setPathAttrs(selectionPath, startCell, endCell, pathPoints);
  };

  const getSelectedCells = (startCell, endCell) => {
    // Handle cell selection based on direction
    let direction = getSelectedDirection(startCell, endCell);
    const selectedCells = [];
    if (direction) {
      switch (direction.type) {
        case "horizontal":
          selectedCells.push(
            ...getHorizontalCells(startCell, endCell, gridContainer)
          );
          break;
        case "vertical":
          selectedCells.push(
            ...getVerticalCells(startCell, endCell, gridContainer)
          );
          break;
        case "diagonal":
          selectedCells.push(
            ...getDiagonalCells(startCell, endCell, gridContainer)
          );
          break;
      }
    }
    return selectedCells;
  };

  const cleanupSelection = () => {
    if (svgOverlay) {
      gridContainer.removeChild(svgOverlay);
      svgOverlay = null;
    }
    startCell = null;
  };

  const allWordsFound = () => {
    return wordBank.querySelectorAll(".word.found").length === WORDS.length;
  };

  gridContainer.addEventListener("mouseup", (e) => {
    if (isMouseDown) {
      isMouseDown = false;
      const selectedCells = getSelectedCells(startCell, e.target);
      const isWordFound = checkSelectedWord(selectedCells);

      if (!isWordFound) {
        cleanupSelection();
      }

      // keep the current svg overlay on the screen
      svgOverlay.querySelector(".selection-path")?.classList.add("found-word");
      svgOverlay = null;
      startCell = null;
    }
    // Check if all words have been found
    if (allWordsFound()) {
      alert("Congratulations! You found all the words!");
      timer.stop();
    }
  });

  gridContainer.addEventListener("mouseleave", () => {
    if (!isMouseDown) {
      return;
    }
    isMouseDown = false;
    cleanupSelection();
  });
}

export default { render };
