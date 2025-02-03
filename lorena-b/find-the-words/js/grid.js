import CONSTANTS from "./constants";

const getRandomLetter = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
};

const generateGrid = (width, height) => {
  let grid = [];
  for (let i = 0; i < height; i++) {
    let row = [];
    for (let j = 0; j < width; j++) {
      row.push(getRandomLetter());
    }
    grid.push(row);
  }
  return grid;
};

const renderGrid = (grid, gridContainer) => {
  const gridTable = document.createElement("table");
  gridTable.className = "grid-table";
  gridContainer.innerHTML = "";
  grid.forEach((row, rowIndex) => {
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
  gridContainer.appendChild(gridTable);
};

export { generateGrid, renderGrid };
