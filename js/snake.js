const fild = document.querySelector(".fild");
const ctx = fild.getContext("2d");
const contador = document.querySelector('.contador');
const begin = document.querySelector(".begin_game");
const pause = document.querySelector(".pause");
const textGameOver = document.querySelector(".game_over");
const counterTime = document.querySelector(".counter");
let snake = [
  {x: 50, y: 50},
];
let beginGame = false;
let score = 0;
let food_x;
let food_y;
let dx = 1;
let dy = 0;
let velocity = 110;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = true;
let changingDirection = false;
window.addEventListener("load", ()=>{
    drawFood()
    drawSnake();
    generarFood();
    window.addEventListener("keydown", keyDownHandler);
    begin.addEventListener("click", ()=>{ 
        begin.style.display = "none";
        pause.style.display = "block"
        pause.style.position = "absolute";
        pause.style.top = "-31vh";
        pause.style.left = "36vw";
        beginGame = true;
        update();
    });
    pause.addEventListener("click", ()=>{
        beginGame = false;
        begin.style.display = "block"
        begin.innerHTML = "Continue"
    });
});
function update(){
    if(beginGame){
        if(gameOver()){ 
            pause.style.display = "none";
            textGameOver.style.display = "block";
            counterTime.style.display = "block";
            setInterval(()=>{
                counterTime.innerHTML -= 1;
                if(counterTime.innerHTML == "0") location.reload();
            },1000);
            return;
        };
        setTimeout(()=>{
            changingDirection = false;
            clear_board();
            drawFood();
            moveSnake();
            drawSnake();
            update();            
        }, velocity);
    };
};
function clear_board(){
    ctx.fillStyle = "#ccc";
    ctx.strokeStyle = "#000";
    ctx.fillRect(0, 0, fild.width, fild.height);
    ctx.strokeRect(0, 0, fild.width, fild.height);
};
function drawSnake(){
    snake.forEach((element)=>{
        drawSnakePart(element);
    });
};
function drawSnakePart(snakePart){
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#fff";
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
};
function drawFood(){
    ctx.beginPath()
    ctx.arc(food_x, food_y, 6, 8, 16)
    ctx.stroke();
    ctx.fillStyle = "#48e"
    ctx.fill();
    ctx.closePath()
};
function gameOver(){
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    };
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > fild.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > fild.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
};
function generarFood(){
    food_x = Math.floor((Math.random() * ((fild.width - 10) - 0) + 0) / 10) * 10;
    food_y = Math.floor((Math.random() * ((fild.height - 10) - 0) + 0) / 10) * 10;
    snake.forEach((part)=>{
        if(part.x == food_x && part.y == food_y){ generarFood() };
    });
};
function keyDownHandler(event){
    const left = 37, right = 39, up = 38, down = 40;
    if(changingDirection) return ;
    changingDirection = true;
    let key = event.keyCode;
    if(key === left && moveRight != true){
        moveLeft = true; moveRight = false; moveDown = false; moveUp = false;
    };
    if(key === right && moveLeft != true){
        moveRight = true; moveLeft = false; moveDown = false; moveUp = false;
    };
    if(key === up && moveDown != true){
        moveUp = true; moveRight = false; moveDown = false; moveLeft = false;
    };
    if(key === down && moveUp != true){
        moveDown = true; moveRight = false; moveLeft = false; moveUp = false;
    };
    if(moveLeft){dx = -1, dy = 0};
    if(moveRight){dx = 1, dy = 0};
    if(moveUp){dx = 0, dy = -1;};
    if(moveDown){dx = 0, dy = 1;};
};
function moveSnake(){
  const head = {x: snake[0].x + (dx * 10), y: snake[0].y + (dy * 10)};
  snake.unshift(head);
  if((snake[0].x + 10) >= food_x && (snake[0].x - 5) <= food_x && (snake[0].y + 10) >= food_y && (snake[0].y - 5) <= food_y){
    score += 1;
    contador.innerHTML = score;
    velocity -= 0.75;
    generarFood();
  }else{ snake.pop() };
};