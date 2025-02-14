import "./widget.css";
import CONSTANTS from "./constants";
import ICONS from "./icons";
import Grid from "./grid";
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

    return foundWord;
  };

  const updateSelectionPath = (startCell, endCell) => {
    const containerRect = gridContainer.getBoundingClientRect();
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    // Calculate centers and path
    const pathStartX =
      startRect.left + startRect.width / 2 - containerRect.left;
    const pathStartY = startRect.top + startRect.height / 2 - containerRect.top;
    const pathEndX = endRect.left + endRect.width / 2 - containerRect.left;
    const pathEndY = endRect.top + endRect.height / 2 - containerRect.top;

    // Create or update path
    let selectionPath = svgOverlay.querySelector(".selection-path");
    if (!selectionPath) {
      selectionPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      selectionPath.classList.add("selection-path");
      svgOverlay.appendChild(selectionPath);
    }

    // Update path
    const pathD = `M ${pathStartX} ${pathStartY} L ${pathEndX} ${pathEndY}`;
    selectionPath.setAttribute("d", pathD);
    selectionPath.setAttribute(
      "stroke",
      barColor || CONSTANTS.DEFAULT_BAR_COLOR
    );
    selectionPath.setAttribute("stroke-opacity", "0.4");
    selectionPath.setAttribute("stroke-width", `${startRect.height}px`);
    selectionPath.setAttribute("stroke-linecap", "round");
    selectionPath.dataset.startRow = startCell.dataset.row;
    selectionPath.dataset.startCol = startCell.dataset.col;
    selectionPath.dataset.endRow = endCell.dataset.row;
    selectionPath.dataset.endCol = endCell.dataset.col;
  };

  const getSelectedCells = (startCell, endCell) => {
    // Handle cell selection based on direction
    let direction = getSelectedDirection(startCell, endCell);
    const selectedCells = [];
    if (direction) {
      switch (direction.type) {
        case "horizontal":
          selectedCells.push(...getHorizontalCells(startCell, endCell));
          break;
        case "vertical":
          selectedCells.push(...getVerticalCells(startCell, endCell));
          break;
        case "diagonal":
          selectedCells.push(...getDiagonalCells(startCell, endCell));
          break;
      }
    }

    return selectedCells;
  };

  const getSelectedDirection = (startCell, endCell) => {
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    // Calculate angle
    const deltaX = endRect.left - startRect.left;
    const deltaY = endRect.top - startRect.top;
    const angle = ((Math.atan2(deltaY, deltaX) * 180) / Math.PI + 360) % 360;

    // Define valid directions
    const directions = [
      { angle: 0, type: "horizontal" },
      { angle: 45, type: "diagonal" },
      { angle: 90, type: "vertical" },
      { angle: 135, type: "diagonal" },
      { angle: 180, type: "horizontal" },
      { angle: 225, type: "diagonal" },
      { angle: 270, type: "vertical" },
      { angle: 315, type: "diagonal" },
    ];

    const snapThreshold = 20; // degrees

    // Find nearest direction
    const nearestDirection = directions.reduce(
      (nearest, current) => {
        const diff = Math.abs(((angle + 360) % 360) - current.angle);
        return diff < nearest.diff ? { ...current, diff } : nearest;
      },
      { diff: Infinity }
    );

    return nearestDirection.diff < snapThreshold ? nearestDirection : null;
  };

  const getHorizontalCells = (start, end) => {
    // get the horizontal cells between start and end
    const startRow = parseInt(start.dataset.row);
    const startCol = parseInt(start.dataset.col);
    const endRow = parseInt(end.dataset.row);
    const endCol = parseInt(end.dataset.col);

    const cells = [];
    if (startRow === endRow) {
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);
      for (let col = minCol; col <= maxCol; col++) {
        const cell = gridContainer.querySelector(
          `.grid-cell[data-row="${startRow}"][data-col="${col}"]`
        );
        cells.push(cell);
      }
    }

    return cells;
  };

  const getVerticalCells = (start, end) => {
    // get the vertical cells between start and end
    const startRow = parseInt(start.dataset.row);
    const startCol = parseInt(start.dataset.col);
    const endRow = parseInt(end.dataset.row);
    const endCol = parseInt(end.dataset.col);

    const cells = [];
    if (startCol === endCol) {
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      for (let row = minRow; row <= maxRow; row++) {
        const cell = gridContainer.querySelector(
          `.grid-cell[data-row="${row}"][data-col="${startCol}"]`
        );
        cells.push(cell);
      }
    }

    return cells;
  };

  const getDiagonalCells = (start, end) => {
    // get the diagonal cells between start and end
    const startRow = parseInt(start.dataset.row);
    const startCol = parseInt(start.dataset.col);
    const endRow = parseInt(end.dataset.row);
    const endCol = parseInt(end.dataset.col);

    const cells = [];
    const dx = startCol < endCol ? 1 : -1;
    const dy = startRow < endRow ? 1 : -1;
    const slope = (endRow - startRow) / (endCol - startCol);

    if (Math.abs(slope) === 1) {
      let row = startRow;
      let col = startCol;
      while (row !== endRow && col !== endCol) {
        const cell = gridContainer.querySelector(
          `.grid-cell[data-row="${row}"][data-col="${col}"]`
        );
        cells.push(cell);
        row += dy;
        col += dx;
      }
      cells.push(
        gridContainer.querySelector(
          `.grid-cell[data-row="${endRow}"][data-col="${endCol}"]`
        )
      );
    }

    return cells;
  };

  const cleanupSelection = () => {
    if (svgOverlay) {
      gridContainer.removeChild(svgOverlay);
      svgOverlay = null;
    }
    startCell = null;
  };

  gridContainer.addEventListener("mouseup", (e) => {
    if (isMouseDown) {
      isMouseDown = false;
      const selectedCells = getSelectedCells(startCell, e.target);
      const isWordFound = checkSelectedWord(selectedCells);
      if (isWordFound) {
        // keep the current svg overlay on the screen
        svgOverlay
          .querySelector(".selection-path")
          ?.classList.add("found-word");
        svgOverlay = null;
        startCell = null;
      } else {
        cleanupSelection();
      }
    }

    // Check if all words have been found
    const allWordsFound =
      wordBank.querySelectorAll(".word.found").length === WORDS.length;
    if (allWordsFound) {
      alert("Congratulations! You found all the words!");
      timer.stop();
    }
  });

  gridContainer.addEventListener("mouseleave", () => {
    if (isMouseDown) {
      isMouseDown = false;
      cleanupSelection();
    }
  });
}

export default { render };
