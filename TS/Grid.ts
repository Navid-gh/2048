import Tile from "./Tile";
const GRID_SIZE = 4;
const CELL_SIZE = 20;
const GAP_SIZE = 2;

export type CellGridArray = Cell[];
export type CellGridType = CellGridArray[];

//now we have access to all our css variables

export default class Grid {
  // for having private value in js we should use # before our variable
  // and access it with this.#name
  // we are making those variables because we dont need any acces out of their classes and methods to prevent any
  //wrong action
  private _cells: Cell[];
  constructor(public gridElement: HTMLDivElement) {
    // we are doing this in constructor because we wanna have these created and ready when we call our class constructor
    // when we call new Class its constructor gets runned
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
  private get _emptyCells() {
    return this._cells.filter((cell) => cell.tile == undefined);
  }
  randomEmptyCells() {
    const randomIndex = Math.floor(Math.random() * this._emptyCells.length);
    return this._emptyCells[randomIndex];
  }

  get cellsByColumn() {
    return this._cells.reduce((cellGrid: CellGridType, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }
  get cellsByRow() {
    return this._cells.reduce((cellGrid: CellGridType, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get cells() {
    return this._cells;
  }
  /*
  The reduce() method works by iterating over each element of the _cells array and applying a function to accumulate the results.

The reduce() method used in this code has two arguments:

A function that is executed on each element of the _cells array, which accepts two parameters:
cellGrid: The accumulator that is initialized as an empty array ([]) in this case.
cell: The current element of the _cells array being processed.
An initial value for the cellGrid accumulator, which is an empty array in this case.
On each iteration, the function checks whether there is 
already an array at the index corresponding to the current cell's x-coordinate in the cellGrid. 
If not, it creates a new array at that index.

Then, it sets the current cell object as the element at the index in the nested array that corresponds to its y-coordinate.

After all cells have been processed, the final cellGrid accumulator value is returned.

In this specific code, the reduce() method is used 
to group the cells by their x-coordinate into a 2D array where each sub-array contains the cells 
in a particular column of the grid.
  */
}

class Cell {
  private _tile!: Tile | null;
  private _mergeTile!: Tile | null;
  constructor(
    private _cellElement: HTMLDivElement,
    private _x: number,
    private _y: number
  ) {}
  get tile() {
    return this._tile;
  }
  set tile(tileElement: Tile | null) {
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

  canAccept(tile: Tile) {
    return (
      this.tile == null ||
      (this._mergeTile == null && this._tile!.value === tile.value)
      //why we did this and create a prop for merge?
      //in the game,if we have merged a tile with a move, in that move we dont want to merge it again
    );
  }

  set mergeTile(tile: Tile | null) {
    this._mergeTile = tile;
    if (tile == null) return;
    this._mergeTile!.x = this.x;
    this._mergeTile!.y = this.y;
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

function createCellsElement(gridElement: HTMLDivElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
