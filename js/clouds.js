const clouds = [];

// init clouds
for (let i = 0; i < 6; i++) {
    clouds.push({
        x: Math.random() * canvas.width * 1.5,
        y: 40 + Math.random() * (canvas.height * 0.25),
        w: 80 + Math.random() * 160,
        h: 30 + Math.random() * 30,
        speed: 0.2 + Math.random() * 0.6,
        color : Math.random() < 0.5 ? 'rgba(255,255,255,0.95)' : 'rgba(104, 104, 104, 0.89)'
    });
}

// draw clouds
function drawClouds(dt) {
    clouds.forEach(c => {
        ctx.save();
        ctx.globalAlpha = 0.95;
        const sx = Math.round(c.x);
        ctx.beginPath();
        // three overlapping ellipses
        ctx.ellipse(sx, c.y, c.w * 0.6, c.h * 0.7, 0, 0, Math.PI * 2);
        ctx.ellipse(sx + c.w * 0.4, c.y + 6, c.w * 0.55, c.h * 0.6, 0, 0, Math.PI * 2);
        ctx.ellipse(sx - c.w * 0.4, c.y + 4, c.w * 0.52, c.h * 0.58, 0, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.restore();

        // move
        c.x -= c.speed * dt * 0.05;
        if (c.x < -300) c.x = canvas.width + 300 + Math.random() * 600;
    });
}