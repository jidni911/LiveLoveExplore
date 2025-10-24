// 🌄 BACKGROUND: Hills + Trees Combined

const hills = [];
const trees = [];

// ---- HILLS ----
for (let i = 0; i < 5; i++) {
    hills.push({
        w: 800 + Math.random() * 600,
        h: 40 + i * 20 + Math.random() * 80,
        colorOffset: -10 + Math.random() * 20,
        parallax: i * 0.1
    });
}

// Hill height function
function hillHeightAt(worldX, index) {
    const scale = 0.008;
    const h =
        Math.sin((worldX + index * 1000) * scale * 0.8) * 40 +
        Math.sin((worldX + index * 1000) * scale * 1.7) * 18 +
        Math.sin((worldX + index * 1000) * scale * 0.35) * 70;
    const base = canvas.height * 0.75;
    return base + (h / 128) * canvas.height * 0.15;
}

// ---- TREES ----
function spawnTree(layer) {
    const size = layer * 4 + (40 + Math.random() * 60); // tree size
    const x = Math.random() * canvas.width * 2;
    const maxY = hillHeightAt(x, layer) - size * 0.8; // align with hill
    const y = maxY + Math.random() * (canvas.height - maxY);
    return { x, y, size, layer };
}

// Spawn initial trees
for (let i = 0; i < 25; i++) {
    const layer = i % 5; // match hill layers
    trees.push(spawnTree(layer));
}

// Draw one tree
function drawTree(x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    // trunk
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(-size * 0.08, 0, size * 0.16, size * 0.7);

    // crown
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

// Draw hills
function drawHills(offset, timeOfDay) {
    hills.forEach((hill, index) => {
        const par = hill.parallax;//0.1, 0.2, 0.3, 0.4, 0.5
        ctx.save();
        ctx.beginPath();
        const startX = -500;
        ctx.moveTo(startX, canvas.height);

        for (let x = startX; x <= canvas.width + 500; x += 6) {
            const worldX = x + offset * par;
            const y = hillHeightAt(worldX, index);
            ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width + 500, canvas.height);
        ctx.closePath();

        ctx.fillStyle = getLightingColor(timeOfDay, index);
        ctx.fill();
        ctx.restore();
        trees.slice(index * 5, (index + 1) * 5).forEach(tree => {
            const hillIndex = tree.layer;
            const worldX = tree.x - offset * par;
            const maxY = hillHeightAt(tree.x, hillIndex);
            tree.y =  maxY; // always on hill
            drawTree(worldX, tree.y, tree.size);
        });
    });
}


// ---- MAIN DRAW ----
function drawBackground(offset, timeOfDay) {
    drawHills(offset, timeOfDay);
}

// ---- DAY-NIGHT LIGHTING ----
function getLightingColor(time, layerIndex) {
    const cycle = time;
    const nightFactor = (Math.sin(cycle * Math.PI * 2 - Math.PI / 2) + 1) / 2;

    const dayColor = { r: 70, g: 140, b: 90 };
    const nightColor = { r: 40, g: 60, b: 100 };

    const r = dayColor.r * (1 - nightFactor) + nightColor.r * nightFactor - layerIndex * 8;
    const g = dayColor.g * (1 - nightFactor) + nightColor.g * nightFactor - layerIndex * 8;
    const b = dayColor.b * (1 - nightFactor) + nightColor.b * nightFactor - layerIndex * 8;

    return `rgb(${r}, ${g}, ${b})`;
}
