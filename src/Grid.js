const GRID_SIZE = 4;
const CELL_SIZE = 20;
const GAP_SIZE = 2;
export default class Grid {
  constructor(gridElement) {
    this.gridElement = gridElement;
    gridElement.style.setProperty("--grid-size", `${GRID_SIZE}`);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--gap-size", `${GAP_SIZE}vmin`);
    this._cells = createCellsElement(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
    console.log(this._cells);
  }
  get _emptyCells() {
    return this._cells.filter((cell) => cell.tile == undefined);
  }
  randomEmptyCells() {
    const randomIndex = Math.floor(Math.random() * this._emptyCells.length);
    return this._emptyCells[randomIndex];
  }
  get cellsByColumn() {
    return this._cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }
  get cellsByRow() {
    return this._cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }
  get cells() {
    return this._cells;
  }
}
class Cell {
  constructor(_cellElement, _x, _y) {
    this._cellElement = _cellElement;
    this._x = _x;
    this._y = _y;
  }
  get tile() {
    return this._tile;
  }
  set tile(tileElement) {
    this._tile = tileElement;
    if (tileElement == null) return;
    tileElement.x = this._x;
    tileElement.y = this._y;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  canAccept(tile) {
    return (
      this.tile == null ||
      (this._mergeTile == null && this._tile.value === tile.value)
    );
  }
  set mergeTile(tile) {
    this._mergeTile = tile;
    if (tile == null) return;
    this._mergeTile.x = this.x;
    this._mergeTile.y = this.y;
  }
  get mergeTile() {
    return this._mergeTile;
  }
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this._mergeTile?.remove();
    this._mergeTile = null;
  }
}
function createCellsElement(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
//# sourceMappingURL=Grid.js.map
