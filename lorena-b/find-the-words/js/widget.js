import "./widget.css";
import CONSTANTS from "./constants";
import ICONS from "./icons";
import { generateGrid, renderGrid } from "./grid";

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
  title.innerHTML = data.title + ICONS.HelpIcon;
  gameContainer.appendChild(title);

  let mainArea = document.createElement("div");
  mainArea.className = "main-area";
  gameContainer.appendChild(mainArea);

  let leftColumn = document.createElement("div");
  leftColumn.className = "left-column";
  mainArea.appendChild(leftColumn);

  let rightColumn = document.createElement("div");
  rightColumn.className = "right-column";
  mainArea.appendChild(rightColumn);

  let gridContainer = document.createElement("div");
  gridContainer.className = "grid";
  gridContainer.style.width = CONSTANTS.GRID_WIDTH;
  gridContainer.style.height = CONSTANTS.GRID_HEIGHT;
  leftColumn.appendChild(gridContainer);

  let grid = generateGrid(15, 15);
  renderGrid(grid, gridContainer);

  let wordBank = document.createElement("div");
  wordBank.className = "word-bank";
  wordBank.style.height = CONSTANTS.GRID_HEIGHT;
  rightColumn.appendChild(wordBank);

  let words = data.words;
  let wordTitle = document.createElement("h4");
  wordTitle.innerText = CONSTANTS.SEARCH_COPY;
  wordTitle.id = "word-title";
  wordTitle.innerHTML += ICONS.SearchIcon;
  wordBank.appendChild(wordTitle);

  words.forEach((word) => {
    let wordElement = document.createElement("div");
    wordElement.className = "word";
    wordElement.innerText = word;
    wordBank.appendChild(wordElement);
  });

  let bottomWrapper = document.createElement("div");
  bottomWrapper.className = "bottom-wrapper";
  leftColumn.appendChild(bottomWrapper);

  let timer = document.createElement("div");
  timer.className = "timer";
  timer.innerHTML = ICONS.TimerIcon + "00:00";
  bottomWrapper.appendChild(timer);

  let endButton = document.createElement("button");
  endButton.className = "end-button";
  endButton.innerText = CONSTANTS.END_BUTTON_COPY;
  bottomWrapper.appendChild(endButton);

  endButton.addEventListener("click", () => {
    gridContainer.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.remove("selected");
    });
    gridContainer.querySelectorAll(".selection-bar").forEach((bar) => {
      bar.remove();
    });

    alert("Game over!");
  });

  leftColumn.appendChild(bottomWrapper);

  let scoreCounter = document.createElement("div");
  scoreCounter.className = "score-counter";
  scoreCounter.innerHTML = `<b>0</b> of <b>${words.length}</b> words found`;
  rightColumn.appendChild(scoreCounter);

  // Grid selection listeners
  let isMouseDown = false;
  let selectionBar = null;
  let startCell = null;

  gridContainer.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("grid-cell")) {
      isMouseDown = true;
      startCell = e.target;

      // Initialize selection bar
      selectionBar = document.createElement("div");
      selectionBar.className = "selection-bar";
      gridContainer.appendChild(selectionBar);

      selectionBar.style.width = `${cellRect.width}px`;
      selectionBar.style.height = `${cellRect.height}px`;
    }
  });

  gridContainer.addEventListener("mousemove", (e) => {
    if (
      isMouseDown &&
      selectionBar &&
      e.target.classList.contains("grid-cell")
    ) {
      let endCell = e.target;
      getSelectedCells(startCell, endCell);
    }
  });

  const getSelectedCells = (startCell, endCell) => {
    const containerRect = container.getBoundingClientRect();

    const startRow = parseInt(startCell.dataset.row);
    const startCol = parseInt(startCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);

    if (startRow === endRow) {
      // Horizontal selection
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);

      for (let col = minCol; col <= maxCol; col++) {
        console.log(`row: ${startRow}, col: ${col}`);
        const cell = gridContainer.querySelector(
          `.grid-cell[data-row="${startRow}"][data-col="${col}"]`
        );
        // cell.classList.add("selected");
      }

      const leftCell = gridContainer.querySelector(
        `.grid-cell[data-row="${startRow}"][data-col="${minCol}"]`
      );
      const rightCell = gridContainer.querySelector(
        `.grid-cell[data-row="${startRow}"][data-col="${maxCol}"]`
      );

      const leftRect = leftCell.getBoundingClientRect();
      const rightRect = rightCell.getBoundingClientRect();
      const width = rightRect.right - leftRect.left;

      selectionBar.style.width = `${width}px`;
      selectionBar.style.height = `${leftRect.height}px`;
      selectionBar.style.left = `${leftRect.left - containerRect.left}px`;
      selectionBar.style.top = `${leftRect.top - containerRect.top}px`;
    } else if (startCol === endCol) {
      // Vertical selection
      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);

      for (let row = minRow; row <= maxRow; row++) {
        console.log(`row: ${row}, col: ${startCol}`);
        const cell = gridContainer.querySelector(
          `.grid-cell[data-row="${row}"][data-col="${startCol}"]`
        );
        // cell.classList.add("selected");
      }

      const topCell = gridContainer.querySelector(
        `.grid-cell[data-row="${minRow}"][data-col="${startCol}"]`
      );
      const bottomCell = gridContainer.querySelector(
        `.grid-cell[data-row="${maxRow}"][data-col="${startCol}"]`
      );

      const topRect = topCell.getBoundingClientRect();
      const bottomRect = bottomCell.getBoundingClientRect();
      const height = bottomRect.bottom - topRect.top;

      selectionBar.style.width = `${topRect.width}px`;
      selectionBar.style.height = `${height}px`;
      selectionBar.style.left = `${topRect.left - containerRect.left}px`;
      selectionBar.style.top = `${topRect.top - containerRect.top}px`;
    }
  };

  gridContainer.addEventListener("mouseup", () => {
    if (isMouseDown) {
      isMouseDown = false;
      if (selectionBar) {
        gridContainer.removeChild(selectionBar);
        selectionBar = null;
      }
      startCell = null;
    }
  });

  gridContainer.addEventListener("mouseleave", () => {
    if (isMouseDown) {
      isMouseDown = false;
      if (selectionBar) {
        gridContainer.removeChild(selectionBar);
        selectionBar = null;
      }
      document.querySelectorAll(".grid-cell.selected").forEach((cell) => {
        cell.classList.remove("selected");
      });
      startCell = null;
    }
  });
}

export default { render };
