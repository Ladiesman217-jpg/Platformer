const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 700;

const gravity = 0.7;

const player = {
    x: 50,
    y: 0,
    width: 50,
    height: 50,
    color: '#ff6347',
    dy: 0,
    onGround: false,
    speedX: 0,
    speedY: 0,
    jumping: false
};

const levels = [
    // ур 1
    {
        platforms: [
            {x:0, y:680, width:1200, height:20},
            {x:150, y:600, width:150, height:15},
            {x:400, y:550, width:120, height:15},
            {x:650, y:450, width:150, height:15}
        ],
        enemies: [
            {x:700, y:570, width:40, height:40, color:'purple', dx:3}
        ],
        food: [
            {x:200, y:570, width:25, height:25, color:'yellow'},
            {x:720, y:400, width:25, height:25, color:'yellow'}
        ],
        goal: {x:800, y:300, width:50, height:50}
    },
    // ур 2
    {
        platforms: [
            {x:0, y:680, width:1200, height:20},
            {x:150, y:600, width:150, height:15},
            {x:400, y:550, width:180, height:15},
            {x:700, y:450, width:300, height:15}
        ],
        enemies: [
            {x:1100, y:550, width:40, height:40, color:'purple', dx:-3},
            {x:550, y:400, width:40, height:40, color:'purple', dx:3}
        ],
        food: [
            {x:430, y:500, width:25, height:25, color:'yellow'}
        ],
        goal: {x:1100, y:400, width:50, height:50}
    },
    // ур 3
    {
        platforms: [
            {x:0, y:680, width:1200, height:20},
            {x:50, y:400, width:150, height:15},
            {x:300, y:400, width:50, height:15},
            {x:450, y:400, width:50, height:15},
            {x:600, y:400, width:50, height:15},
            {x:750, y:400, width:50, height:15},
            {x:900, y:400, width:50, height:15},
            {x:1050, y:400, width:50, height:15}
        ],
        enemies: [
            {x:600, y:500, width:200, height:150, color:'black', dx:-10}
        ],
        food: [
            {x:380, y:300, width:25, height:25, color:'yellow'},
            {x:830, y:300, width:25, height:25, color:'yellow'}
        ],
        goal: {x:1150, y:350, width:50, height:50}
    },
    // ур 4
    {
        platforms: [
            {x:0, y:680, width:1200, height:20},
            {x:50, y:400, width:150, height:15},
            {x:225, y:500, width:50, height:15},
            {x:300, y:400, width:150, height:15},
            {x:475, y:500, width:50, height:15},
            {x:550, y:400, width:150, height:15},
            {x:725, y:500, width:50, height:15},
            {x:800, y:400, width:150, height:15},
            {x:975, y:500, width:50, height:15},
            {x:1050, y:400, width:150, height:15},
        ],
        enemies: [
            {x:600, y:550, width:200, height:125, color:'black', dx:-15},
            {x:1100, y:250, width:75, height:150, color:'green', dx:-2}
        ],
        food: [
            {x:600, y:350, width:25, height:25, color:'yellow'},
            {x:600, y:570, width:25, height:25, color:'yellow'}
        ],
        goal: {x:1150, y:350, width:50, height:50}
    },
    // ур 5
    {
        platforms: [
            {x:0, y:680, width:1200, height:20},
            {x:50, y:400, width:150, height:15},
            {x:225, y:500, width:50, height:15},
            {x:300, y:400, width:150, height:15},
            {x:475, y:500, width:50, height:15},
            {x:550, y:400, width:150, height:15},
            {x:725, y:500, width:50, height:15},
            {x:800, y:400, width:150, height:15},
            {x:975, y:500, width:50, height:15},
            {x:1050, y:400, width:150, height:15},
        ],
        enemies: [
            {x:600, y:550, width:200, height:125, color:'black', dx:-15},
            {x:1100, y:250, width:75, height:150, color:'green', dx:-2},
            {x:100, y:450, width:50, height:50, color:'purple', dx:-3},
            {x:200, y:250, width:75, height:150, color:'green', dx:2},
        ],
        food: [
            {x:600, y:350, width:25, height:25, color:'yellow'},
            {x:600, y:570, width:25, height:25, color:'yellow'}
        ],
        goal: {x:1150, y:350, width:50, height:50}
    },
];

let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

let score = 0;
let levelCompleted = false; 
let gameOver = false; 

const keys = {};
document.addEventListener('keydown', e => {
    keys[e.key] = true;
});
document.addEventListener('keyup', e => {
    keys[e.key] = false;
});

document.addEventListener('keydown', e => {
    keys[e.key] = true;
    
    if (e.key === ' ') {
        e.preventDefault(); 
        
        if (gameOver) {
            resetGame();
        } else if (levelCompleted) {
            nextLevel();
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        e.preventDefault();
    }
}, false);

function nextLevel() {
    if (currentLevelIndex < levels.length - 1) {
        currentLevelIndex++;
        loadLevel(currentLevelIndex);
        levelCompleted = false;
        gameOver = false;
    } else {
        alert('Поздравляем! Вы прошли все уровни! Итоговые очки: ' + score);
        resetGame();
    }
}

function resetGame() {
    currentLevelIndex = 0;
    score = 0;
    loadLevel(0);
    levelCompleted = false;
    gameOver = false;
}


function gameLoop() {
    if (!levelCompleted && !gameOver) {
        if (keys['ArrowRight']) player.x += 3;
        if (keys['ArrowLeft']) player.x -= 3;
        if (keys[' ']) {
            if (player.onGround) {
                player.dy = -15;
                player.onGround = false;
            }
        }

        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        player.dy += gravity;
        player.y += player.dy;

        player.onGround = false;
        for (const p of currentLevel.platforms) {
            if (
                player.x < p.x + p.width &&
                player.x + player.width > p.x &&
                player.y < p.y + p.height &&
                player.y + player.height > p.y
            ) {
                if (player.dy > 0) {
                    player.y = p.y - player.height;
                    player.dy = 0;
                    player.onGround = true;
                }
            }
        }

        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.dy = 0;
            player.onGround = true;
        }

        for (const enemy of currentLevel.enemies) {
            enemy.x += enemy.dx;
            if (enemy.x < 0 || enemy.x + enemy.width > canvas.width)
                enemy.dx = -enemy.dx;
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                gameOver = true;
            }
        }

        for (let i = 0; i < currentLevel.food.length; i++) {
            const foodItem = currentLevel.food[i];
            if (
                player.x < foodItem.x + foodItem.width &&
                player.x + player.width > foodItem.x &&
                player.y < foodItem.y + foodItem.height &&
                player.y + player.height > foodItem.y
            ) {
                currentLevel.food.splice(i, 1);
                score += 10;
            }
        }

        if (
            player.x < currentLevel.goal.x + currentLevel.goal.width &&
            player.x + player.width > currentLevel.goal.x &&
            player.y < currentLevel.goal.y + currentLevel.goal.height &&
            player.y + player.height > currentLevel.goal.y
        ) {
            levelCompleted = true;
        }
    }

    drawGame();

    requestAnimationFrame(gameLoop);
}

function loadLevel(index) {
    currentLevel = JSON.parse(JSON.stringify(levels[index]));
    player.x = 50;
    player.y = 0;
    player.dy = 0;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#8B4513';
    ctx.shadowColor = '#4A2810';
    ctx.shadowBlur = 5;
    for (const p of currentLevel.platforms) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.strokeStyle = '#5A2E0C';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.width, p.height);
    }
    ctx.shadowBlur = 0;

    for (const enemy of currentLevel.enemies) {
        ctx.fillStyle = enemy.color;
        ctx.shadowColor = '#4B0082';
        ctx.shadowBlur = 10;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(enemy.x + 10, enemy.y + 10, 5, 0, Math.PI * 2);
        ctx.arc(enemy.x + enemy.width - 10, enemy.y + 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(enemy.x + 10 + (enemy.dx > 0 ? 2 : -2), enemy.y + 10, 2, 0, Math.PI * 2);
        ctx.arc(enemy.x + enemy.width - 10 + (enemy.dx > 0 ? 2 : -2), enemy.y + 10, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    for (const f of currentLevel.food) {
        ctx.fillStyle = f.color;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(f.x + f.width/2, f.y + f.height/2, f.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(f.x + f.width/3, f.y + f.height/3, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFA500';
    ctx.shadowBlur = 15;
    ctx.fillRect(currentLevel.goal.x, currentLevel.goal.y, currentLevel.goal.width, currentLevel.goal.height);
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(currentLevel.goal.x + 40, currentLevel.goal.y + 10);
    ctx.lineTo(currentLevel.goal.x + 40, currentLevel.goal.y + 40);
    ctx.lineTo(currentLevel.goal.x + 60, currentLevel.goal.y + 25);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = '#8B0000';
    ctx.shadowBlur = 10;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 15, 5, 0, Math.PI * 2);
    ctx.arc(player.x + player.width - 12, player.y + 15, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(player.x + 12, player.y + 15, 2, 0, Math.PI * 2);
    ctx.arc(player.x + player.width - 12, player.y + 15, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.arc(player.x + player.width/2, player.y + 30, 8, 0, Math.PI);
    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(5, 5, 300, 60);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Очки: ' + score, 70, 35);
    ctx.fillText('Уровень: ' + (currentLevelIndex + 1) + '/' + levels.length, 70, 65);

    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FF4444';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 80);

        const buttonX = canvas.width / 2 - 200;
        const buttonY = canvas.height / 2;
        const buttonWidth = 400;
        const buttonHeight = 80;

        ctx.fillStyle = '#4CAF50';
        ctx.shadowColor = '#45a049';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#45a049';
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('Начать заново', canvas.width / 2, buttonY + buttonHeight / 2);
        ctx.shadowBlur = 0;

        canvas.onclick = function(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (gameOver && 
                x >= buttonX && x <= buttonX + buttonWidth && 
                y >= buttonY && y <= buttonY + buttonHeight) {
                resetGame();
            }
        };
    }
    else if (levelCompleted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Уровень пройден!', canvas.width / 2, canvas.height / 2 - 80);

        ctx.fillStyle = '#4CAF50';
        ctx.shadowColor = '#45a049';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#45a049';
        ctx.lineWidth = 4;
        
        const buttonX = canvas.width / 2 - 150;
        const buttonY = canvas.height / 2;
        const buttonWidth = 300;
        const buttonHeight = 70;

        ctx.beginPath();
        ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (currentLevelIndex < levels.length - 1) {
            ctx.fillText('Следующий уровень →', canvas.width / 2, buttonY + buttonHeight / 2);
        } else {
            ctx.fillText('Завершить игру', canvas.width / 2, buttonY + buttonHeight / 2);
        }

        ctx.shadowBlur = 0;

        canvas.onclick = function(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (levelCompleted && 
                x >= buttonX && x <= buttonX + buttonWidth && 
                y >= buttonY && y <= buttonY + buttonHeight) {
                nextLevel();
            }
        };
    } else {
        canvas.onclick = null;
    }
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
};

gameLoop();