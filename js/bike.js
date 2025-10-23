  const bike = {
    wheelRadius: 20,
    wheelDistance: 70,
    bodyW: 120,
    bodyH: 36,
    tilt: 0,
    wheelRotation: 0 // radians
  };

  const bikeX = () => Math.max(120, canvas.width * 0.35); // fixed horizontal pos for bike



  // draw bike (simple stylized)
    function drawBike(worldOff, dt) {
        const x = bikeX();
        const worldX = x + worldOff;
        const y = groundHeightAt(worldX) - 14; // seat offset above ground
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
        // rear wheel
        drawWheel(-wd * 0.5, 0, wr, bike.wheelRotation);
        // front wheel
        drawWheel(wd * 0.5, 0, wr, bike.wheelRotation);

        // frame
        ctx.save();
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.moveTo(-wd * 0.5, -4);
        ctx.lineTo(-wd * 0.1, -10);
        ctx.lineTo(wd * 0.05, -18);
        ctx.lineTo(wd * 0.55, -8);
        ctx.lineTo(wd * 0.45, -3);
        ctx.lineTo(wd * 0.05, -10);
        ctx.lineTo(-wd * 0.5, -4);
        ctx.closePath();
        ctx.fill();

        // seat
        ctx.fillStyle = '#222';
        ctx.fillRect(-12, -22, 24, 6);

        // handlebar
        ctx.fillStyle = '#222';
        ctx.fillRect(wd * 0.52, -28, 4, 16);
        ctx.fillRect(wd * 0.62, -30, 24, 4);

        ctx.restore();
        ctx.restore();
    }

    function drawWheel(cx, cy, r, rot) {
        ctx.save();
        ctx.translate(cx, cy);
        // rim
        ctx.beginPath();
        ctx.fillStyle = '#0b0b0b';
        ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
        ctx.fill();
        // tyre
        ctx.beginPath();
        ctx.fillStyle = '#111';
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        // spokes
        ctx.save();
        ctx.rotate(rot);
        ctx.strokeStyle = 'rgba(220,220,220,0.9)';
        ctx.lineWidth = 2;
        const spokes = 8;
        for (let i = 0; i < spokes; i++) {
            const a = (i / spokes) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * (r - 6), Math.sin(a) * (r - 6));
            ctx.stroke();
        }
        ctx.restore();
        // hub
        ctx.beginPath();
        ctx.fillStyle = '#888';
        ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }