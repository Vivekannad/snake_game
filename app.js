const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreText");
const resetBtn = document.getElementById("resetBtn");
const gameWidth = gameBoard.width;
const gameheight = gameBoard.height;
const backgroundColor  = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let xVelocity = unitSize;
let yVelocity = 0;
let running = false;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
]
const tunes = {
    backgroundMusic: new Audio("sound.mp3"),
    gameOverSound: new Audio("gameover.wav"),
    eatSound: new Audio("eat.mp3"),
    // moveSound: new Audio("move.wav"),
}
tunes.backgroundMusic.loop = true;
tunes.backgroundMusic.volume =  0.1;



window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", () => {
    if(running !== false){
        tunes.backgroundMusic.play();
    }
});


gameStart();


function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    
    nextTick();
}
function nextTick(){
    if(running) {
        setTimeout( () => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            
            nextTick();
        },150);
    }else {
        displayGameOver();
    }
}
function clearBoard(){
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0 , 0 , gameWidth , gameheight);
};
function createFood(){
     function randomFood (min , max) {
        // random place for food which must be multiple of unitSize
        const random = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return random;
     }
      foodX = randomFood(0 , gameWidth - unitSize);
      foodY = randomFood(0 , gameheight - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX , foodY , unitSize , unitSize);
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity , 
                    y : snake[0].y + yVelocity}
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x === foodX && snake[0].y === foodY){
        score +=1;
        tunes.eatSound.play();
        scoreText.textContent = score;
        createFood()
    }else {
        snake.pop();
    }
}
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x , snakePart.y , unitSize , unitSize);
        ctx.strokeRect(snakePart.x , snakePart.y , unitSize , unitSize);
    })
};
function changeDirection (event) {
    switch(event.key) {
        case "ArrowDown" :
            if(yVelocity !== unitSize && yVelocity !== -unitSize ){
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
        case "ArrowUp" :
            if(yVelocity !== -unitSize && yVelocity !== unitSize){
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;
        case "ArrowLeft" :
            if(xVelocity !== -unitSize && xVelocity !== unitSize){
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;
        case "ArrowRight" :
            if(xVelocity !== unitSize && xVelocity !== -unitSize){
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;
    }
}
function checkGameOver(){
    if(snake[0].x < 0 || snake[0].x >= gameWidth || snake[0].y < 0 || snake[0].y >= gameheight){
        running = false;
        tunes.gameOverSound.play();
        return;

    }
    for(let i = snake.length - 1; i > 0; i--){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            running = false;
            // tunes.gameOverSound.play();
            return;

        }
    }
}
function displayGameOver(){
        tunes.backgroundMusic.play();
        tunes.backgroundMusic.pause();
        tunes.backgroundMusic.currentTime = 0;
    ctx.font = "50px MV boli";

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", gameWidth / 2 , gameheight / 2);
    running = false;  
}
function resetGame(){
    score = 0; 
    xVelocity = unitSize; 
    yVelocity = 0;
    running = false;
    
    snake = [
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ]
    tunes.backgroundMusic.pause();
    tunes.backgroundMusic.currentTime = 0;


        gameStart();
}
