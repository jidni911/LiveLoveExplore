const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const skyColor = '#87CEEB';
const groundColor = '#6BBE44';
const roadColor = '#555';
const horizon = canvas.height * 0.7;

const bgObjects = [];
for (let i = 0; i < 10; i++) {
  bgObjects.push({
    x: Math.random() * canvas.width,
    y: horizon - 50 - Math.random() * 100,
    size: 30 + Math.random() * 70,
    speed: 0.3 + Math.random() * 0.3,
  });
}

const bike = {
  x: canvas.width / 2 - 50,
  y: horizon - 30,
  width: 100,
  height: 100,
  frame: 0
};

const bikeImg = new Image();
bikeImg.src = 'bike.png'; // replace with your image in /assets

const clouds = Array.from({length: 5}, () => ({
  x: Math.random() * canvas.width,
  y: 50 + Math.random() * 200,
  speed: 0.5 + Math.random() * 0.3
}));


function drawScene() {
  ctx.fillStyle = skyColor;
  ctx.fillRect(0, 0, canvas.width, horizon);
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, horizon, canvas.width, canvas.height - horizon);

  ctx.fillStyle = roadColor;
  ctx.fillRect(0, horizon + 20, canvas.width, 40);
}

function drawBackground() {
  ctx.fillStyle = '#3C9D4C';
  bgObjects.forEach(obj => {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.size / 2, 0, Math.PI * 2);
    ctx.fill();
    obj.x -= obj.speed;
    if (obj.x + obj.size < 0) obj.x = canvas.width + Math.random() * 200;
  });
}

function drawBike() {
  if (bikeImg.complete) {
    ctx.drawImage(bikeImg, bike.x, bike.y, bike.width, bike.height);
  } else {
    ctx.fillStyle = 'black';
    ctx.fillRect(bike.x, bike.y, bike.width, bike.height);
  }
}

function drawClouds() {
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  clouds.forEach(cloud => {
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, 60, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    cloud.x -= cloud.speed;
    if (cloud.x < -100) cloud.x = canvas.width + 100;
  });
}

function animate() {
  drawScene();
  drawBackground();
  drawBike();
  drawClouds();
  requestAnimationFrame(animate);
}

animate();
