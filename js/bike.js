const bike = {
    wheelRadius: 16,
    wheelDistance: 70,
    bodyW: 120,
    bodyH: 120,
    tilt: 0,
    wheelRotation: 0 // radians
};

const bikeX = () => Math.max(120, canvas.width * 0.3); // fixed horizontal pos for bike
const image = document.getElementById("source");


// draw bike (simple stylized)
function drawBike(worldOff, dt) {
    const x = bikeX();
    const worldX = x + worldOff;
    const y = groundHeightAt(worldX); // seat offset above ground
    const slope = groundTangentAt(worldX); // dy/dx
    const angle = Math.atan(slope);

    // wheel rotation based on world speed (distance moved -> rotation)
    const speed = baseSpeed * speedMultiplier;
    bike.wheelRotation += (worldOffsetDelta * 0.02) / (bike.wheelRadius * 0.06);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * 0.9); // tilt with slope
    // draw wheels
    const wr = bike.wheelRadius;
    const wd = bike.wheelDistance;
    
    
    // frame
    const image = document.getElementById("source");
    ctx.drawImage(image, -bike.bodyW * 0.5-3, -bike.bodyH * 0.5-9, bike.bodyW+7, bike.bodyH);
    
    ctx.save();
    // rear wheel
    drawWheel(-wd * 0.5, 0, wr, bike.wheelRotation);
    // front wheel
    drawWheel(wd * 0.5, 0, wr, bike.wheelRotation);
    // ctx.fillStyle = '#222';
    // ctx.beginPath();
    // ctx.moveTo(-wd * 0.5, 0);
    // ctx.lineTo(-wd * 0.1, -35);
    // ctx.lineTo(wd * 0.05, -25);
    // // ctx.lineTo(wd * 0.55, -8);
    // // ctx.lineTo(wd * 0.45, -3);
    // // ctx.lineTo(wd * 0.05, -10);
    // // ctx.lineTo(-wd * 0.5, -4);
    // ctx.closePath();
    // ctx.fill();

    // // seat
    // ctx.fillStyle = '#222';
    // ctx.fillRect(-12, -22, 24, 6);

    // // handlebar
    // ctx.fillStyle = '#222';
    // ctx.fillRect(wd * 0.52, -28, 4, 16);
    // ctx.fillRect(wd * 0.62, -30, 24, 4);

    ctx.restore();
    ctx.restore();
}

function drawWheel(cx, cy, r, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    // tyre base
    ctx.beginPath();
    ctx.strokeStyle = '#000000ff';
    ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.stroke();
    // tyre wall
    ctx.beginPath();
    ctx.strokeStyle = '#964b00ff'; // coffee brown
    ctx.arc(0, 0, r + 1, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.stroke();
    // rim
    ctx.beginPath();
    ctx.strokeStyle = '#666666ff'; // steel color
    ctx.arc(0, 0, r - 1, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // spokes
    ctx.save();
    ctx.rotate(rot);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)'; // golden shiny
    ctx.lineWidth = 2;
    const spokes = 8;
    for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * (r - 3), Math.sin(a) * (r - 3));
        ctx.stroke();
    }
    ctx.restore();
    // hub
    // ctx.beginPath();
    // ctx.fillStyle = '#000000ff';
    // ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
    // ctx.fill();
    ctx.restore();
}