    // Sun color
    const sunDay = [255, 210, 70];
    const moonColor = [220, 230, 255];

    function drawSun(t) {
        // t in 0..1 cycles day->night
        const phi = t * Math.PI * 2; // angle around
        // sun x: map phi to left->right horizontally
        const sx = canvas.width * (0.1 + 0.8 * t);
        // sun y: arch across the sky (lower at edges)
        const sunY = canvas.height * 0.18 + Math.sin(Math.PI * t) * canvas.height * 0.18;
        const size = 40 + Math.sin(Math.PI * t) * 12;
        // color lerp: daytime sun vs moon
        const sc = lerpColor(sunDay, moonColor, Math.max(0, 1 - Math.abs(0.5 - t) * 2));
        ctx.save();
        // glow
        const g = ctx.createRadialGradient(sx, sunY, 0, sx, sunY, size * 6);
        const color = `rgba(${sc[0]},${sc[1]},${sc[2]},`;
        g.addColorStop(0, color + '0.9)');
        g.addColorStop(0.5, color + '0.25)');
        g.addColorStop(1, color + '0.0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sx, sunY, size * 6, 0, Math.PI * 2);
        ctx.fill();

        // sun/moon circle
        ctx.beginPath();
        ctx.arc(sx, sunY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${sc[0]},${sc[1]},${sc[2]})`;
        ctx.fill();
        ctx.restore();
    }