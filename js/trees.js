const trees = [];

// 🌿 Initialize trees (background objects)
function spawnTree(layer) {
    // layer: 0 = far, 1 = mid, 2 = near
    const size = [0.6, 1.0, 1.6][layer] * (30 + Math.random() * 60);
    const x = Math.random() * canvas.width * 2;
    const y = hillHeightAt(x, layer) - size * 0.8; // position based on hill
    return {
        x,
        y,
        size,
        layer,
        speed: [0.15, 0.35, 0.9][layer] * (0.6 + Math.random() * 0.8),
        colorShift: Math.random() * 30 - 15, // small color variation
        swayOffset: Math.random() * Math.PI * 2 // random phase for wind sway
    };
}

// spawn initial trees
for (let i = 0; i < 20; i++) {
    const layer = Math.floor(Math.random() * 3);
    trees.push(spawnTree(layer));
}

// 🌲 Draw one tree
function drawTree(x, y, size, colorShift = 0, sway = 0) {
    ctx.save();
    ctx.translate(x + sway, y);

    // trunk
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(-size * 0.08, 0, size * 0.16, size * 0.7);

    // crown (slight color variation for realism)
    const baseG = 90 + colorShift;
    const baseR = 30 + colorShift * 0.3;
    const baseB = 40 + colorShift * 0.2;
    ctx.fillStyle = `rgb(${baseR},${baseG},${baseB})`;

    // crowns: 3-layer canopy
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

// 🌳 Draw all trees with parallax, hill alignment, and wind sway
function drawTrees(offset, time = 0) {
    trees.forEach(t => {
        const par = [0.25, 0.6, 1.0][t.layer];
        const hillIndex = t.layer;
        const worldX = t.x - offset * par;

        // if tree moves offscreen, respawn far right maintaining layer
        if (worldX < -200) {
            t.x += canvas.width * 1.8 + Math.random() * 200;
            t.y = hillHeightAt(t.x, hillIndex) - t.size * 0.8;
        }

        const yOnHill = hillHeightAt(t.x, hillIndex);

        // 🌬️ Wind sway — gentle for near, subtle for far
        const swayStrength = [0.3, 0.8, 2.0][t.layer]; // pixels
        const sway = Math.sin(time * 0.0015 + t.swayOffset) * swayStrength;

        ctx.save();
        ctx.globalAlpha = 0.92 - t.layer * 0.1; // far layers faded
        ctx.translate(worldX, yOnHill - t.size * 0.8);
        const scale = t.size / 100;
        ctx.scale(scale, scale);
        drawTree(0, 0, t.size * 0.8, t.colorShift, sway);
        ctx.restore();
    });
}
