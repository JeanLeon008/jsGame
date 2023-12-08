const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = innerHeight
canvas.width = innerWidth

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 25,
    color: '#3498db',
    speed: 5,
    health: 3,
    angle: 0
};

const bullets = [];
const mobs = [];
let killedMobs = 0;

const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

canvas.addEventListener('mousemove', (e) => {
    player.angle = Math.atan2(e.clientY - canvas.getBoundingClientRect().top - player.y,
                              e.clientX - canvas.getBoundingClientRect().left - player.x);
});

canvas.addEventListener('mousedown', shoot);

setInterval(() => {
    const mob = {
      x: Math.random() * canvas.width,
      y: -10,
      radius: 25,
      color: '#e74c3c',
      speed: 2
    };
    mobs.push(mob);
}, 2000);

function update() {
    if (player.health <= 0) {
      alert("Игра окончена! Вы проиграли.");
      resetGame();
      return;
    }

    movePlayer();
    moveMobs();
    updateBullets();
    checkCollisions();
    drawPlayer();
    drawMobs();
    drawBullets();

    requestAnimationFrame(update);
}

function movePlayer() {
    if (keys['KeyA'] && player.x - player.radius > 0) {
      player.x -= player.speed;
    }
    if (keys['KeyD'] && player.x + player.radius < canvas.width) {
      player.x += player.speed;
    }
    if (keys['KeyW'] && player.y - player.radius > 0) {
      player.y -= player.speed;
    }
    if (keys['KeyS'] && player.y + player.radius < canvas.height) {
      player.y += player.speed;
    }
}

function moveMobs() {
    for (const mob of mobs) {
      const angle = Math.atan2(player.y - mob.y, player.x - mob.x);
      mob.x += mob.speed * Math.cos(angle);
      mob.y += mob.speed * Math.sin(angle);

      if (mob.y - mob.radius > canvas.height) {
        mob.x = Math.random() * canvas.width;
        mob.y = -10;
      }
    }
}

function shoot() {
    const bullet = {
      x: player.x,
      y: player.y,
      radius: 5,
      color: '#e74c3c',
      speed: 8,
      direction: player.angle
    };
    bullets.push(bullet);
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.x += bullet.speed * Math.cos(bullet.direction);
      bullet.y += bullet.speed * Math.sin(bullet.direction);
      if (
        bullet.x + bullet.radius < 0 ||
        bullet.x - bullet.radius > canvas.width ||
        bullet.y + bullet.radius < 0 ||
        bullet.y - bullet.radius > canvas.height
      ) {
        bullets.splice(i, 1);
        i--;
      }
    }
}

function checkCollisions() {
    for (let i = 0; i < mobs.length; i++) {
      const mob = mobs[i];
      const distanceToPlayer = Math.sqrt((player.x - mob.x) ** 2 + (player.y - mob.y) ** 2);
      if (distanceToPlayer < player.radius + mob.radius) {
        player.health--;
        resetMob(i);
      }
      for (let j = 0; j < bullets.length; j++) {
        const bullet = bullets[j];
        const distanceToBullet = Math.sqrt((bullet.x - mob.x) ** 2 + (bullet.y - mob.y) ** 2);
        if (distanceToBullet < bullet.radius + mob.radius) {
          killedMobs++;
          resetMob(i);
          bullets.splice(j, 1);
          j--;
        }
      }
    }
}

function resetMob(index) {
    mobs[index].x = Math.random() * canvas.width;
    mobs[index].y = -10;
}
function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const playerSprite = new Image();
    playerSprite.src = 'img/player.png';  
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.drawImage(playerSprite, -player.radius, -player.radius, player.radius * 2,player.radius * 2);
    ctx.restore();

    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(10, 10, player.health * 30, 20);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(10, 10, 3 * 30, 20);

    ctx.fillStyle = '#fff';
    ctx.font = '26px Arial';
    ctx.fillText('Убито зомби: ' + killedMobs, canvas.width - 320, 50);
}

function drawMobs() {
    const mobSprite = new Image();
    mobSprite.src = 'img/mob.png';  
    for (const mob of mobs) {
      const angle = Math.atan2(player.y - mob.y, player.x - mob.x);
      ctx.save();
      ctx.translate(mob.x, mob.y);
      ctx.rotate(angle);
      ctx.drawImage(mobSprite, -mob.radius, -mob.radius, mob.radius * 2, mob.radius * 2);
      ctx.restore();
    }
}

function drawBullets() {
    const bulletSprite = new Image();
    bulletSprite.src = 'img/bullet.png';
    for (const bullet of bullets) {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.direction);
        ctx.drawImage(bulletSprite, -bullet.radius, -bullet.radius, bullet.radius * 2, bullet.radius * 2);
        ctx.restore();
    }
}

function resetGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.health = 3;
    bullets.length = 0;
    mobs.length = 0;
    killedMobs = 0;
}

update();

const cursor = document.querySelector(".cursor"); 
const mouseMove = function (e) { 
    let x = e.clientX;
    let y = e.clientY;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
};
document.addEventListener("mousemove", mouseMove);