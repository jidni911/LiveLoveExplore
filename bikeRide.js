function init() {

    function frame(now) {
        const dt = Math.min(40, now - last); // ms (clamp)
        last = now;
        const seconds = dt / 1000;

        // advance time-of-day slowly
        timeOfDay += (seconds / cycleSeconds);
        timeOfDay = timeOfDay % 1;

        const speed = baseSpeed * speedMultiplier;
        worldOffsetDelta = speed * seconds * 120; // tune multiplier for feel
        worldOffset += worldOffsetDelta;
        document.getElementById('distanceMeter').textContent = worldOffset.toFixed(0) + ' meters' + ' (' + worldOffsetDelta.toFixed(1) + ' m/s)';

        // sky gradient
        // dayFactor: 0..1 where 0=night, 1=day. Use a smooth curve: highest at 0.25..0.75
        // We want sunrise at 0.0, noon at 0.25, sunset at 0.5, midnight at 0.75, back at 1.0
        // Use a cosine to smooth
        const dayFactor = 0.5 + 0.5 * Math.cos((timeOfDay - 0.25) * Math.PI * 2); // rough
        // but clamp and shape for nicer visuals
        const df = Math.pow(dayFactor, 1.0);

        const top = lerpColor(nightTop, dayTop, df);
        const bottom = lerpColor(nightBottom, dayBottom, df);

        // draw sky
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, rgbStr(top));
        g.addColorStop(1, rgbStr(bottom));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // sun
        drawSun(timeOfDay);

        // hills
        drawHills(worldOffset);

        // clouds
        drawClouds(dt);

        // trees
        drawTrees(worldOffset);

        // ground + road
        drawGround(worldOffset,worldOffset);

        // bike
        drawBike(worldOffset, dt);

        // serene overlay vignette or stars at night
        if (df < 0.25) {
            // night: draw stars faintly
            ctx.save();
            ctx.globalAlpha = 0.7 - df * 2;
            for (let i = 0; i < 60; i++) {
                const sx = (i * 37 + (worldOffset * 0.3)) % (canvas.width + 200) - 100;
                const sy = 20 + (i * 97) % (canvas.height * 0.45);
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fillRect(sx, sy, 1.5, 1.5);
            }
            ctx.restore();
        }

        requestAnimationFrame(frame);
    }

    // UI buttons


    const spUp = document.getElementById('speedUp');
    const spDown = document.getElementById('speedDown');
    const spLabel = document.getElementById('speedLabel');
    spUp.addEventListener('click', () => {
        speedMultiplier = Math.min(2.5, speedMultiplier + 0.1);
        spLabel.textContent = 'Speed: ' + speedMultiplier.toFixed(1) + 'x';
    });
    spDown.addEventListener('click', () => {
        speedMultiplier = Math.max(0.2, speedMultiplier - 0.1);
        spLabel.textContent = 'Speed: ' + speedMultiplier.toFixed(1) + 'x';
    });

    // start
    requestAnimationFrame(frame);

    // expose a quick debug restart on double-click
    canvas.addEventListener('dblclick', () => {
        // reposition trees
        for (let t of trees) {
            t.x = Math.random() * canvas.width * 2;
        }
    });

}

init();

document.addEventListener('keydown', event => {
    if (event.key === 'f') {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            canvas.requestFullscreen();
        }
    }
});
