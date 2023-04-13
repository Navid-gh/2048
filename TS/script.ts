/*
When you use commonjs as the module target in your TypeScript configuration file 
and try to run the generated JavaScript code in an HTML file, you may encounter the error "Uncaught ReferenceError: 
exports is not defined". This is because the exports object is not available in a browser environment.

To resolve this issue, you should change the module setting in your tsconfig.json file to es2015 or higher, 
which will produce JavaScript code that can be run directly in the browser without the need for a module loader like CommonJS.

{
  "compilerOptions": {
    "target": "es2016",
    "module": "es2015",
    // ...
  }
}
If you need to use CommonJS modules in your TypeScript code, you can still do so by using a 
build tool like Webpack or Browserify to bundle your code before serving it to the browser. 
These tools will handle the module loading for you and ensure that your code works correctly in a browser environment.
*/

/*
In JavaScript, flatMap() is a method that is available on arrays. 
It is used to map each element of an array to a new array, 
and then flatten the result into a single array. Here's how it works:

The flatMap() method takes a callback function as its argument. 
This function should return an array for each element in the original array. 
The flatMap() method then concatenates all these arrays together into a single flattened array.

Here's an example:

const arr = [1, 2, 3];

const mappedArr = arr.flatMap((num) => [num * 2]);

console.log(mappedArr); // Output: [2, 4, 6]
In this example, we have an array arr containing the numbers 1, 2, and 3. 
We use flatMap() to map each element of the array to a new array that contains its double value. 
This results in a new array [2, 4, 6].

Note that the callback function passed to flatMap() can also return multiple values for each element, 
which will be flattened as well.
*/

import Grid, { CellGridType } from "./Grid";
import Tile from "./Tile";

const gridElement = document.querySelector(".game-board") as HTMLDivElement;

const myGrid = new Grid(gridElement);
// now we need two random tile for start, one of them 2 and other 4
myGrid.randomEmptyCells().tile = new Tile(gridElement);
myGrid.randomEmptyCells().tile = new Tile(gridElement);

// until here all we did was for rendering our to tiles
// now we should think about the user input and moving our tiles

setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
  // what doest the once mean ? it means if every key pressed this callback only excuted oncle
  // but why ? if user press a key we need to do our animations and movings without before again user press a key
}
async function handleInput(e: KeyboardEvent) {
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
      //if that pressed key wasnt the key we need and we care again set our listener
      return;
  }
  myGrid.cells.forEach((cell) => cell.mergeTiles());
  // but for merging our animations dont good perfectly
  // because in here when one of those functions above is invoked, when its excuting
  // the slideTiles function when doing its movements it hs some css animations behind the scene
  // when the slideTiles is finished our animations arent done yet but doing forEach immediately
  // ruing our animations
  // so we can use promises, for this we need to slideTiles returns a promise

  //so now we need our new element to add to the board

  const newTile = new Tile(gridElement);
  myGrid.randomEmptyCells().tile = newTile;
  // but its not complete, e need what ? when we cant move to right or left or ...
  // we dont need new tile

  if (!canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveRight()) {
    newTile.waitForTrasitions(true).then(() => {
      alert("you lost");
    });
    //here we waited first for the new tile to shows up and then finish the game
    return;
  }

  setupInput(); //if that pressed key was the key we need and we care again set our listener
  // so why this implement works ? due js engine as eariler we learned
  // the handleInput func stays in stack and opened until the function that is invoked in one of cases gets finished
  // and then itself gets finished and closed
}

function moveUp() {
  return slideTiles(myGrid.cellsByColumn);
}
function moveDown() {
  return slideTiles(
    myGrid.cellsByColumn.map((column) => [...column].reverse())
    //why we used a copy of column ? because the reverse mutate the actula array and
    //changes the undrlying array satate in our myGrid
    //but we dont want that and only need to modify this instace
    //in normal and for going top we checked cells from top
    //so now we check from bottom
  );
}
function moveLeft() {
  return slideTiles(myGrid.cellsByRow);
}
function moveRight() {
  return slideTiles(myGrid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells: CellGridType) {
  // at this function firstly we should loop through all our columns and then again a loop through our cells
  return Promise.all(
    // cells.forEach((cellsGroup) => {
    cells.flatMap((cellsGroup) => {
      const promises = [];
      //we need this for pur promises and at last flattens out our promise array
      // for every cellsGroup into one-dimensional array and return that array
      for (let i = 1; i < cellsGroup.length; i++) {
        //notice we here started with i = 1 means we start from one step further
        // imagine the columns, if we wanna move to up,up of our last tile should be empty so we start
        // from the scond one for ex x=0 , y=1 ,if its top is empty, move to it and if not , can we merge them? merge them and if not
        // do nothing because if the toppest one cn not move so its belown one cant too
        const cell = cellsGroup[i];
        if (cell.tile == null) continue; //if it hasnt any tile,so go for the next cell
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          //the second loop is for that how many we can go to top for ex
          const movingToIt = cellsGroup[j];
          if (!movingToIt.canAccept(cell.tile)) break; // can we go to our top cell or merge with it?
          lastValidCell = movingToIt; //lastvalidcell is the latest place we could go
        }
        if (lastValidCell != null) {
          //its not null ? so our cell tile can move
          promises.push(cell.tile.waitForTrasitions());
          // add a promise because we can have a move so we have animations
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null; //why we did this? if we can move our tile to a new place, so we should the tile of the
          // old place
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

function canMove(cells: CellGridType) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveTiItCell = group[index - 1];
      if (!moveTiItCell.canAccept(cell.tile)) return false;
      return true;
    });
  });
  // so here we are checking we can move any of our tiles in any group or not?
  // if only one tile can move it still returns true
}
