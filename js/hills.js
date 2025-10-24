const hills = [];

// hills
for (let i = 0; i < 5; i++) {
    hills.push({
        x: i * 400,
        w: 800 + Math.random() * 600,
        h: 40 + i * 20 + Math.random() * 80,
        colorOffset: -10 + Math.random() * 20
    });
}


// draw hills
function drawHills(offset) {
    hills.forEach((hill, index) => {
        const par = 0.2 + index * 0.15;
        ctx.save();
        ctx.beginPath();
        const startX = -500;
        ctx.moveTo(startX, canvas.height);
        for (let x = startX; x <= canvas.width + 500; x += 6) {
            const worldX = (x + offset * par);
            const y = hillHeightAt(worldX,index);
            // const y = canvas.height - 30 - Math.sin(worldX * 0.0006 + index) * hill.h - (index * 15);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width + 500, canvas.height);
        ctx.closePath();
        // color slightly darker for farther layers
        const shade = 40 + index * 10;
        // ctx.fillStyle = `red`;
        ctx.fillStyle = `rgb(${80 - shade},${140 - shade},${90 - shade})`;
        ctx.fill();
        ctx.restore();
    });
}


function hillHeightAt(worldX,index) {
    // worldX in pixels
    const scale = 0.008; // frequency scale
    // combine a few sine waves for hills
    const h = Math.sin((worldX+index*1000) * scale * 0.8) * 40 + Math.sin((worldX+index*1000) * scale * 1.7) * 18 + Math.sin((worldX+index*1000) * scale * 0.35) * 70;
    const base = canvas.height * 0.70;
    return base + h/128 * canvas.height*0.15;
}