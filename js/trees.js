const trees = [];


// init trees (bgObjects)
function spawnTree(layer) {
    // layer: 0 far, 1 mid, 2 near
    const baseY = canvas.height * 0.72;
    const size = [0.6, 1.0, 1.6][layer] * (30 + Math.random() * 60);
    return {
        x: Math.random() * canvas.width * 2,
        y: baseY - (layer * 30) - (Math.random() * 60),
        size,
        layer,
        speed: [0.15, 0.35, 0.9][layer] * (0.6 + Math.random() * 0.8)
    }
}
for (let i = 0; i < 20; i++) {
    const layer = Math.floor(Math.random() * 3);
    trees.push(spawnTree(layer));
}


function drawTree(x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    // trunk
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(-size * 0.08, 0, size * 0.16, size * 0.7);
    // crowns: layered circles / ovals
    ctx.fillStyle = '#145a2a';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.1, size * 0.55, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-size * 0.25, -size * 0.35, size * 0.38, size * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.25, -size * 0.35, size * 0.38, size * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// draw trees parallax
    function drawTrees(offset) {
        trees.forEach(t => {
            const par = [0.25, 0.6, 1.0][t.layer];
            const x = t.x - offset * par;
            // if offscreen to left, respawn on right
            if (x < -200) {
                t.x += canvas.width * 1.8 + Math.random() * 200;
            }
            // far trees muted color
            ctx.save();
            ctx.globalAlpha = 0.95;
            ctx.translate(x, t.y);
            const scale = t.size / 100;
            ctx.scale(scale, scale);
            drawTree(0, 0, t.size * 0.8);
            ctx.restore();
        });
    }