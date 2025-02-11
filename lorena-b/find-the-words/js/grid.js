/**
 * @file grid.js
 * @description Grid class and utils to generate and render the word search grid.
 */

import CONSTANTS from "./constants";

const DIRECTIONS = [
  [0, 1], // Vertical
  [1, 0], // Horizontal
  [1, 1], // Diagonal down
  //   [1, -1], // Diagonal up
];

class Grid {
  constructor(words, width, height) {
    this.words = words;
    this.width = width || CONSTANTS.GRID_WIDTH;
    this.height = height || CONSTANTS.GRID_HEIGHT;
    this.grid = this.generateGrid(width, height, words);
  }

  generateGrid(width, height, words) {
    let grid = Array(height)
      .fill()
      .map(() => Array(width).fill(""));

    // Place each word
    for (const word of words) {
      const direction =
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      if (!placeWord(grid, word, direction)) {
        console.warn(`Could not place word: ${word}`);
      }
    }

    // Fill remaining spaces with random letters
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = getRandomLetter();
        }
      }
    }

    return grid;
  }

  createGridElement(gridContainer) {
    const gridTable = document.createElement("table");
    gridTable.classList.add("grid-table");
    gridContainer.innerHTML = "";
    this.grid.forEach((row, rowIndex) => {
      let gridRow = document.createElement("tr");
      gridRow.className = "grid-row";
      row.forEach((col, colIndex) => {
        let gridCell = document.createElement("td");
        gridCell.className = "grid-cell";
        gridCell.innerText = col;
        gridCell.dataset.row = rowIndex;
        gridCell.dataset.col = colIndex;
        gridCell.style.width = CONSTANTS.CELL_SIZE + "px";
        gridCell.style.height = CONSTANTS.CELL_SIZE + "px";
        gridRow.appendChild(gridCell);
      });
      gridTable.appendChild(gridRow);
    });
    return gridTable;
  }
}

const getRandomLetter = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
};

const calculateSpacingScore = (grid, row, col, dy, dx, wordLength) => {
  let spacingScore = 0;
  const padding = 2; // padding around words

  // Check area around word
  for (let i = -padding; i <= wordLength + padding; i++) {
    for (let j = -padding; j <= padding; j++) {
      const checkRow = row + dy * i + j;
      const checkCol = col + dx * i + j;

      if (
        checkRow >= 0 &&
        checkRow < grid.length &&
        checkCol >= 0 &&
        checkCol < grid[0].length
      ) {
        if (grid[checkRow][checkCol] !== "") {
          spacingScore -= 3; // penalty for nearby words
        }
      }
    }
  }
  return spacingScore;
};

const placeWord = (grid, word, direction) => {
  word = word.toUpperCase();
  const [dy, dx] = direction;
  let bestScore = -Infinity;
  let bestPosition = null;

  // Start from center of grid
  const centerRow = Math.floor(grid.length / 2);
  const centerCol = Math.floor(grid[0].length / 2);

  for (
    let distance = 0;
    distance < Math.max(grid.length, grid[0].length);
    distance++
  ) {
    for (let row = centerRow - distance; row <= centerRow + distance; row++) {
      for (let col = centerCol - distance; col <= centerCol + distance; col++) {
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length)
          continue;
        if (
          row + dy * word.length > grid.length ||
          col + dx * word.length > grid[0].length
        )
          continue;

        let overlapScore = 0;
        let canPlace = true;

        // Check overlaps
        for (let i = 0; i < word.length; i++) {
          const cellRow = row + dy * i;
          const cellCol = col + dx * i;
          const existing = grid[cellRow][cellCol];

          if (existing !== "") {
            if (existing !== word[i]) {
              canPlace = false;
              break;
            }
            overlapScore += 1; // Reduced overlap weight
          }
        }

        if (canPlace) {
          const spacingScore = calculateSpacingScore(
            grid,
            row,
            col,
            dy,
            dx,
            word.length
          );
          const totalScore = overlapScore + spacingScore;

          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestPosition = { row, col };
          }
        }
      }
    }
  }

  if (bestPosition) {
    const { row, col } = bestPosition;
    for (let i = 0; i < word.length; i++) {
      grid[row + dy * i][col + dx * i] = word[i];
    }
    return true;
  }

  return false;
};

export default Grid;
