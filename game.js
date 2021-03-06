/* game.js

This code handles the game elements and interactions on game.html. 
Most of your work will be here!
*/

/***INITIALIZING VARIABLES AND OBJECTS***/
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 40; //distance between elements
var count = 0;
var score = 0;
var snake = {
  x: 120,
  y: 120,
  x_step: grid, //snake velocity. moves one grid length every frame in either the x or y direction
  y_step: 0,
  cells: [],  //an array that keeps track of all grids the snake body occupies
  currentLength: 4, //current length of the snake. grows when eating an apple. 
  color: ["#91B5A9","#D2BCC3","#859FAC","#C8B8DB"]
};
/* TO DO: create apple object below */
var apple = {
  x: 0,
  y: 0,
  color: "#ff6781"
}
const crunchSound = document.querySelector('audio');
const failSound = document.querySelectorAll('audio')[1];
failSound.volume = .3;
var gameOver = document.getElementById("gameOver");
var startOver = gameOver.querySelector("button");

var isGameOver = false;

/***MAIN FUNCTIONS***/

/* start the game */
requestAnimationFrame(snakeSquadLoop);

/* Listen to keyboard events to move the snake */
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.x_step === 0) {
    snake.x_step = -grid; //positive value inverts axis
    snake.y_step = 0;     //non-zero value makes snake go diagonally
  }
  // up arrow key
  else if (e.which === 38 && snake.y_step === 0) {
    snake.y_step = -grid;
    snake.x_step = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.x_step === 0) {
    snake.x_step = grid;
    snake.y_step = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.y_step === 0) {
    snake.y_step = grid;
    snake.x_step = 0;
  }
});

/***HELPER FUNCTIONS***/

/*snakeSquadLoop: This is the main code that is run each time the game loops*/
function snakeSquadLoop() {
  if(isGameOver) {
    return;
  }
  requestAnimationFrame(snakeSquadLoop);
  // if count < 16, then keep looping. Don't animate until you get to the 16th frame. This controls the speed of the animation.
  if (count < 16) {
    count++;
    return;
  }
  //Otherwise, it's time to animate. 
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  /*TO DO:which functions do we need to run for this game to work, and in what order?*/
  calculateSnakeMove();
  drawSnake();
  drawApple();
  
  if(snakeTouchesApple()) {
    lengthenSnakeByOne();
    randomlyGenerateApple();
  }
  
  if(checkCrashItself()) {
    return endGame();
  }
}

function calculateSnakeMove(){
  // move snake by its velocity
  snake.x += snake.x_step;
  snake.y += snake.y_step;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.currentLength) {
    snake.cells.pop();
  }
}

/*drawApple
uses context functions to fill the cell at apple.x and apple.y with apple.color 
*/
function drawApple(){
  /* TO DO */
  const game = document.getElementById('game');
  const ctx = game.getContext('2d');
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, 30, 30);
}


/*drawSnake
For each cell of the snake, fill in the grid at the location (cell.x, cell.y) with the snake.color 
If the cell is the first cell in the array, use the drawCellWithBitmoji function to draw that cell as the user's bitmoji 
*/
function drawSnake(){
  /* TO DO */
  let num = 0;
  for(var i=0;i<snake.cells.length;i++) {
    if(i===0) {
      drawCellWithBitmoji(snake.cells[0]);
    } 
    else {
      const currentCell = snake.cells[i];
      const game = document.getElementById('game');
      const ctx = game.getContext('2d');
      ctx.fillStyle = snake.color[num];
      num++;
      if(num > snake.color.length - 1) {
        num = 0;
      }
      ctx.fillRect(currentCell.x, currentCell.y, 30, 30);
    }
  }
}

/*drawCellWithBitmoji
Takes a cell (with an x and y property) and fills the cell with a bitmoji instead of a square
*/
function drawCellWithBitmoji(cell) {
  var avatar_url = localStorage.getItem('avatarurl');
  document.getElementById('avatar').src = avatar_url;
  context.drawImage(document.getElementById('avatar'), 0, 0, 200, 200, cell.x, cell.y, grid, grid);
}

/*snakeTouchesApple
checks if any cell in the snake is at the same x and y location of the apple
returns true (the snake is eating the apple) or false (the snake is not eating the apple)
*/
function snakeTouchesApple(){
  /* TO DO */
  if(snake.cells[0].x === apple.x && snake.cells[0].y === apple.y) {
    score++;
    document.getElementById('scoreboard').textContent = "Score: " + score;
    playSound(crunchSound,1);
    return true; //lengthenSnakeByOne & randomlyGenerateApple already called in snakeSquadLoop
  }
}

/*lengthenSnakeByOne
increments the currentLength property of the snake object by one to show that the snake has eaten an apple
*/
function lengthenSnakeByOne(){
  snake.currentLength += 1;
}

/*randomlyGenerateApple
uses getRandomInt to generate a new x and y location for the apple within the grid
this function does not draw the apple itself, it only stores the new locations in the apple object
*/
function randomlyGenerateApple(){
  apple.x = getRandomInt(0, 15) * grid;
  apple.y = getRandomInt(0, 15) * grid;
}

/*checkCrashItself
checks if any cell in the snake is at the same x and y location of the any other cell of the snake
returns true (the snake crashed into itself) or false (the snake is not crashing) 
*/
function checkCrashItself(){
  /* TO DO */
  for(let i=0;i<snake.cells.length;i++) {
    let snakeHead = snake.cells[i];
    for(let j=i+1; j<snake.cells.length; j++) {
      let snakeBody = snake.cells[j];
      if(snakeHead.x === snakeBody.x && snakeHead.y === snakeBody.y) {
        return true;
      }
    }
  }
}

/*endGame
displays an alert and reloads the page
*/
function endGame(){
  isGameOver = true;
  playSound(failSound,3);
  // context.clearRect(0, 0, canvas.width, canvas.height); //clears character from screen
  gameOver.style.display = "block";
  gameOver.querySelectorAll("p")[1].textContent = "High Score: " + score;
  return;
}

startOver.addEventListener("click", () => {
  document.location.reload();
});


/*getRandomInt
takes a mininum and maximum integer
returns a whole number randomly in that range, inclusive of the mininum and maximum
see https://stackoverflow.com/a/1527820/2124254
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function playSound(sound,time) {
  sound.play();
  let int = setInterval(function() {
    if(sound.currentTime > time) {
      sound.pause();
      clearInterval(int);
      sound.currentTime = 0;
    }
  }, 1);
 
  //i think the failSound is playing for every part of the snake body the head runs into, need to figure out how to make the snake stop moving when endGame triggers
}