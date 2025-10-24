// draw ground strip and road
function drawGround(offset,worldOffset) {
    // ground base
    ctx.save();
    // draw a continuous ground silhouette using groundHeightAt
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x += 4) {
        const worldX = x + offset;
        const y = groundHeightAt(worldX);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fillStyle = '#2f8b3a';
    ctx.fill();
    ctx.save();
    ctx.restore();
    // road band
    const roadYoffset = 20;
    ctx.moveTo(0,  canvas.height + roadYoffset);
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 4) {
        const worldX = x + offset;
        const y = groundHeightAt(worldX) + roadYoffset;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    // ctx.closePath();
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 30;
    ctx.stroke();

    ctx.save();
    ctx.restore();

    // road dashed center (simple)
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 30]);
    ctx.beginPath();
    ctx.moveTo(0, groundHeightAt(-100 + offset) + roadYoffset);
    for (let x = -100-worldOffset*0.35%48; x <= canvas.width + 200; x += 20) {
        const worldX = x + offset;
        const y = groundHeightAt(worldX) + roadYoffset;
        if (x === -100) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
}


// Terrain function (sine waves)
function groundHeightAt(worldX) {
    // worldX in pixels
    const scale = 0.003; // frequency scale
    // combine a few sine waves for hills
    const h = Math.sin(worldX * scale * 0.8) * 40 + Math.sin(worldX * scale * 1.7) * 18 + Math.sin(worldX * scale * 0.35) * 70;
    const base = canvas.height * 0.70;
    return base - h/128 * canvas.height*0.05;
}
function groundTangentAt(worldX) {
    // derivative approx to compute slope for tilt
    const dx = 1;
    const h1 = groundHeightAt(worldX);
    const h2 = groundHeightAt(worldX + dx);
    return (h2 - h1) / dx;
}