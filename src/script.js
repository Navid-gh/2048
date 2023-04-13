import Grid from "./Grid.js";
import Tile from "./Tile.js";
const gridElement = document.querySelector(".game-board");
const myGrid = new Grid(gridElement);
myGrid.randomEmptyCells().tile = new Tile(gridElement);
myGrid.randomEmptyCells().tile = new Tile(gridElement);
setupInput();
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}
async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }
  myGrid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(gridElement);
  myGrid.randomEmptyCells().tile = newTile;
  if (!canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveRight()) {
    newTile.waitForTrasitions(true).then(() => {
      alert("you lost");
    });
    return;
  }
  setupInput();
}
function moveUp() {
  return slideTiles(myGrid.cellsByColumn);
}
function moveDown() {
  return slideTiles(
    myGrid.cellsByColumn.map((column) => [...column].reverse())
  );
}
function moveLeft() {
  return slideTiles(myGrid.cellsByRow);
}
function moveRight() {
  return slideTiles(myGrid.cellsByRow.map((row) => [...row].reverse()));
}
function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((cellsGroup) => {
      const promises = [];
      for (let i = 1; i < cellsGroup.length; i++) {
        const cell = cellsGroup[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const movingToIt = cellsGroup[j];
          if (!movingToIt.canAccept(cell.tile)) break;
          lastValidCell = movingToIt;
        }
        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTrasitions());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}
function canMoveUp() {
  return canMove(myGrid.cellsByColumn);
}
function canMoveDown() {
  return canMove(myGrid.cellsByColumn.map((column) => [...column].reverse()));
}
function canMoveLeft() {
  return canMove(myGrid.cellsByRow);
}
function canMoveRight() {
  return canMove(myGrid.cellsByRow.map((Row) => [...Row].reverse()));
}
function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveTiItCell = group[index - 1];
      if (!moveTiItCell.canAccept(cell.tile)) return false;
      return true;
    });
  });
}
//# sourceMappingURL=script.js.map
