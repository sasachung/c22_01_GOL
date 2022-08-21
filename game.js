const unitLength = 20;
const boxColor = 150;

const strokeColor = 50;
const randomNumber = [0, 1];
let isGameContinue = true;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth, windowHeight - 200); //
  canvas.parent(document.querySelector("#canvas")); //element div into canvas
  //framerate

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  console.log(columns);
  console.log(rows);
  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = []; //array (underdefined)
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = []; //assign 吉的ARRAY
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}

function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = { value: 0, times: 0, static: false };
      nextBoard[i][j] = { value: 0, times: 0, static: false };

      //每個格仔，assign value=0
    }
  }

  //drawPattern(snake, 10, 5);
}

function initRandom() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j].value = random(randomNumber);
      nextBoard[i][j].value = random(randomNumber);
      //每個格仔，assign value=0
    }
  }
}

function draw() {
  let speedSlider = document.querySelector(".slidecontainer input");
  //   console.log(speedSlider.value);
  frameRate(parseInt(speedSlider.value));
  background(115, 157, 181); //畫布的底色
  generate(); //下面才是畫格仔
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j].value == 1) {
        if (currentBoard[i][j].times == 1) {
          fill(237, 101, 101);
        } else if (
          currentBoard[i][j].times >= 2 &&
          currentBoard[i][j].times <= 3
        ) {
          fill(168, 192, 99);
        } else if (currentBoard[i][j].times == 4) {
          fill(190, 137, 164);
        } else if (currentBoard[i][j].times >= 5) {
          fill(98, 70, 80); //背景的顏色
        }
      }
      stroke("white"); //格線的顏色
      square(i * unitLength, j * unitLength, unitLength, unitLength, 30); //draw a rectangle
      fill(243, 244, 246); //背景的顏色
    }
  }
}
let robertStr = [
  ".......OO...............OO.......",
  "........O...............O........",
  "......O...................O......",
  "......OOOOO...........OOOOO......",
  "..........O...........O..........",
  "....OOOO.................OOOO....",
  "....O..O.................O..O....",
  ".....................O...........",
  ".....................O...........",
  ".........O....OO.OO..O.OO........",
  "........OOO...OO.O......OO.......",
  ".......O..OO......O..............",
  ".......OOO............O..........",
  "......................O.O........",
  "...OO...........OO....O..O..OO...",
  "...O............OO.....OO....O...",
  "OO.O............OO...........O.OO",
  "O.OO.OO...................OO.OO.O",
  ".....O.....................O.....",
  ".....O.O.................O.O.....",
  "......OO.................OO......",
  "..........O...........O..........",
  "......OOOOO...........OOOOO......",
  "......O...................O......",
  "........O...............O........",
  ".......OO...............OO.......",
];
let snakeStr = [
  "......OO...OO....",
  "......OO..O.OOO..",
  "..........O....O.",
  "......OOOO.OO..O.",
  "......O..O.O.O.OO",
  ".........O.O.O.O.",
  "..........OO.O.O.",
  "..............O..",
  ".................",
  "OO...............",
  ".O.......OO......",
  ".O.O.....OO......",
  "..OO.............",
  ".................",
  ".................",
  ".................",
  ".................",
  ".................",
  ".................",
  "............OO...",
  "...OO.......O....",
  "..O.O........OOO.",
  "....O..........O.",
];
let spaceshipStr = [
  "..................................O.....",
  "........O.......................OOO.OOO.",
  ".......OOOO....................OO......O",
  "..O...O...OO.OO...........O...O..O...OO.",
  ".OOOO.....O..OO..........OOOO...........",
  "O...O.......O..O........O...O...........",
  ".O.O..O..................O.O..O.........",
  ".....O.......................O..........",
];

function drawPattern(pattern, x, y) {
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      if (pattern[i][j] === 0) {
        currentBoard[x + j][y + i].value = 0;
      } else currentBoard[x + j][y + i].value = 1;

      // generatePattern(pattern);
    }
  }
}

function generatePattern(str) {
  let result = [];
  for (let i = 0; i < str.length; i++) {
    let p = [];
    for (let j = 0; j < str[i].length; j++) {
      if (str[i][j] == "O") {
        p.push(1);
      } else if (str[i][j] == ".") {
        p.push(0);
      }
    }
    result.push(p);
  }
  return result;
}

document.querySelector(".pattern-btn").addEventListener("click", function () {
  const robert = generatePattern(robertStr);
  const snake = generatePattern(snakeStr);
  const spaceship = generatePattern(spaceshipStr);

  let patternArray = [robert, snake, spaceship];
  init();
  drawPattern(patternArray[Math.floor(Math.random() * 3)], 10, 3);
});

function generate() {
  if (isGameContinue) {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        // Count all living members in the Moore neighborhood(8 boxes surrounding)
        let neighbors = 0;
        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            //點解-1， 這是INDEX 左上左邊
            if (i == 0 && j == 0) {
              // the cell itself is not its own neighbor// 計NEIGHOUR
              continue;
            }
            // The modulo operator is crucial for wrapping on the edge
            neighbors +=
              currentBoard[(x + i + columns) % columns][(y + j + rows) % rows]
                .value;
          }
        }
        const formOfSurvival = document.querySelector(
          ".inputIndexOfSurvival input"
        );
        const formOfReproduction = document.querySelector(
          ".inputIndexOfReproduction input"
        );
        if (
          currentBoard[x][y].value == 1 &&
          neighbors < parseInt(formOfSurvival.value)
        ) {
          // Die of Loneliness
          nextBoard[x][y].value = 0;
        } else if (currentBoard[x][y].value == 1 && neighbors > 3) {
          nextBoard[x][y].value = 0; // Die of Overpopulation
        } else if (
          currentBoard[x][y].value == 0 &&
          neighbors == parseInt(formOfReproduction.value)
        ) {
          // New life due to Reproduction
          nextBoard[x][y].value = 1;
          nextBoard[x][y].times++;
        } else {
          // Stasis
          nextBoard[x][y].value = currentBoard[x][y].value;
        }
      }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
  } //swap action
} //以下是加生命的部份
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y].value = 1;
  fill(237, 101, 101);
  stroke("white");
  circle(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop(); //causes draw() to only execute once
  mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
  loop(); //再開始返個GAME
}

document.querySelector("#reset-game").addEventListener("click", function () {
  init();
  isGameContinue = true;
});

document.querySelector(".pause-btn").addEventListener("click", function () {
  if (isGameContinue) {
    isGameContinue = false;
  }
});
document.querySelector(".start-btn").addEventListener("click", function () {
  if (isGameContinue == false) {
    isGameContinue = true;
  }
});
document.querySelector(".init-btn").addEventListener("click", function () {
  initRandom();
  draw();
});

// document.body.addEventListener("keydown", function (event) {
//   const startingPoint = currentBoard[1][2];
//   if (event.keyCode == 38) {
//   } else if (event.keyCode == 40) {
//     console.log("DOWN pressed");
//   } else if (event.keyCode == 37) {
//     console.log("LEFT pressed");
//   } else if (event.keyCode == 39) {
//     console.log("RIGHT pressed");
//   }
// });
let keyCodeX = 0;
let keyCodeY = 0;
function keyPressed() {
  if (keyCode == 73) {
    noLoop();
    keyCodeY -= unitLength;
  } else if (keyCode == 75) {
    noLoop();
    keyCodeY += unitLength;
  } else if (keyCode == 74) {
    noLoop();
    keyCodeX -= unitLength;
  } else if (keyCode == 76) {
    noLoop();
    keyCodeX += unitLength;
  } else if (keyCode == 13) {
    loop();
    keyCodeX = 0;
    keycodeY = 0;
  }
  if (keyCodeX > unitLength * columns || keyCodeY > unitLength * rows) {
    return;
  }

  const x = Math.floor(keyCodeX / unitLength);
  const y = Math.floor(keyCodeY / unitLength);
  currentBoard[x][y].value = 1;
  fill(237, 101, 101);
  stroke("white");
  circle(x * unitLength, y * unitLength, unitLength);
}
