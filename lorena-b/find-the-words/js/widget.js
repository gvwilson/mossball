import "./widget.css";
import CONSTANTS from "./constants";
import ICONS from "./icons";
import Grid from "./grid";
import tippy from "https://esm.sh/tippy.js@6";
import Timer from "./timer";

function render({ model, el }) {
  let container = document.createElement("div");
  container.className = "container";
  el.appendChild(container);

  let data = model.data.data;

  let gameContainer = document.createElement("div");
  gameContainer.className = "game-container";
  container.appendChild(gameContainer);

  let title = document.createElement("h2");
  title.className = "title";
  title.innerHTML = data.title;

  const helpTooltip = document.createElement("div");
  helpTooltip.id = "help-tooltip";
  helpTooltip.innerHTML = ICONS.HelpIcon;

  title.appendChild(helpTooltip);
  gameContainer.appendChild(title);

  tippy(helpTooltip, {
    content: data.instructions,
    interactive: true,
    arrow: true,
    popperOptions: {
      modifiers: [
        {
          name: "arrow",
          options: {
            element: ".tippy-arrow",
          },
        },
      ],
    },
  });

  let mainArea = document.createElement("div");
  mainArea.className = "main-area";
  gameContainer.appendChild(mainArea);

  let leftColumn = document.createElement("div");
  leftColumn.className = "left-column";
  mainArea.appendChild(leftColumn);

  let rightColumn = document.createElement("div");
  rightColumn.className = "right-column";
  mainArea.appendChild(rightColumn);

  const { gridWidth, gridHeight, barColor } = data.config;

  let gridContainer = document.createElement("div");
  gridContainer.className = "grid";
  gridContainer.style.width = gridWidth * CONSTANTS.CELL_SIZE + "px";
  gridContainer.style.height = gridHeight * CONSTANTS.CELL_SIZE + 10 + "px";
  leftColumn.appendChild(gridContainer);

  const words = data.words;
  const grid = new Grid(words, gridWidth, gridHeight);
  const gridElement = grid.createGridElement(gridContainer);
  gridContainer.appendChild(gridElement);

  let wordBank = document.createElement("div");
  wordBank.className = "word-bank";
  wordBank.style.height = gridHeight * CONSTANTS.CELL_SIZE + 10 + "px";
  rightColumn.appendChild(wordBank);

  let wordTitle = document.createElement("h4");
  wordTitle.innerText = CONSTANTS.SEARCH_COPY;
  wordTitle.id = "word-title";
  wordBank.appendChild(wordTitle);

  words.forEach((word) => {
    let wordElement = document.createElement("div");
    wordElement.className = "word";
    wordElement.id = word.toLowerCase();
    wordElement.innerText = word;
    wordBank.appendChild(wordElement);
  });

  let bottomWrapper = document.createElement("div");
  bottomWrapper.className = "bottom-wrapper";
  leftColumn.appendChild(bottomWrapper);

  const { timed, countdown } = data.config.gameMode;

  if (timed) {
    leftColumn.style.position = "relative";
    let startGameOverlay = document.createElement("div");
    startGameOverlay.className = "start-game-overlay";
    leftColumn.appendChild(startGameOverlay);

    let startGameButton = document.createElement("button");
    startGameButton.className = "start-game-button";
    startGameButton.innerText = CONSTANTS.START_GAME_COPY;
    startGameOverlay.appendChild(startGameButton);

    startGameButton.addEventListener("click", () => {
      startGameOverlay.style.display = "none";
      timer.start(() => {
        resetGameState();
        alert("Time's up!");
      });
    });

    startGameOverlay.style.top = `${gridContainer.offsetTop}px`;
    startGameOverlay.style.left = `${gridContainer.offsetLeft}px`;
    startGameOverlay.style.width = gridContainer.style.width;
    startGameOverlay.style.height = gridContainer.style.height;
  }

  const timerMode = timed ? "COUNTDOWN" : "COUNTUP";
  const initialTime = timed ? countdown : 0;

  let timer = new Timer(initialTime, timerMode);
  let timerElement = timer.createTimerElement();
  bottomWrapper.appendChild(timerElement);

  let endButton = document.createElement("button");
  endButton.className = "end-button";
  endButton.innerText = CONSTANTS.END_BUTTON_COPY;
  bottomWrapper.appendChild(endButton);

  const resetGameState = () => {
    // Reset game state
    gridContainer.querySelectorAll(".selection-svg").forEach((bar) => {
      bar.remove();
    });
    wordBank.querySelectorAll(".word.found").forEach((word) => {
      word.classList.remove("found");
      word.querySelector(".checkmark")?.remove();
    });
    wordBank.querySelectorAll(".word.unfound").forEach((word) => {
      word.classList.remove("unfound");
      word.querySelector(".incorrect")?.remove();
    });

    // if start overlay exists, show it
    if (leftColumn.querySelector(".start-game-overlay")) {
      leftColumn.querySelector(".start-game-overlay").style.display = "flex";
    }
    updateScore();
    timer.reset();
  };

  endButton.addEventListener("click", () => {
    gridContainer.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.remove("selected");
    });
    // mark unfound words
    wordBank.querySelectorAll(".word").forEach((word) => {
      if (!word.classList.contains("found")) {
        let incorrectDiv = document.createElement("div");
        incorrectDiv.className = "incorrect";
        incorrectDiv.innerHTML = ICONS.Incorrect;
        word.appendChild(incorrectDiv);
        word.classList.add("unfound");
      }
    });

    setTimeout(() => {
      window.alert("Game over! Click OK to reset.");
      resetGameState();
    }, 0);
  });

  leftColumn.appendChild(bottomWrapper);

  let scoreCounter = document.createElement("div");
  scoreCounter.className = "score-counter";
  scoreCounter.innerHTML = `<b>0</b> of <b>${words.length}</b> words found`;
  rightColumn.appendChild(scoreCounter);

  const updateScore = () => {
    let foundWords = wordBank.querySelectorAll(".word.found").length;
    scoreCounter.innerHTML = `<b>${foundWords}</b> of <b>${words.length}</b> words found`;
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
      getSelectedCells(startCell, endCell);
    }
  });

  const checkSelectedWord = (selectedCells) => {
    const upperCaseWords = words.map((word) => word.toUpperCase());
    let selectedWord = selectedCells.map((cell) => cell.innerText).join("");
    let foundWord = upperCaseWords.includes(selectedWord);

    if (foundWord) {
      // Highlight selected cells
      selectedCells.forEach((cell) => {
        cell.classList.add("selected");
      });
      let wordElement = wordBank.querySelector(
        `#${selectedWord.toLowerCase()}`
      );
      wordElement.classList.add("found");
      if (!wordElement.querySelector(".checkmark")) {
        let checkmarkDiv = document.createElement("div");
        checkmarkDiv.className = "checkmark";
        checkmarkDiv.innerHTML = ICONS.Checkmark;
        wordElement.appendChild(checkmarkDiv);
      }
      updateScore();
    }

    return foundWord;
  };

  const getSelectedCells = (startCell, endCell) => {
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
      wordBank.querySelectorAll(".word.found").length === words.length;
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
