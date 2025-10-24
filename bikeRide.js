function init() {

    function frame(now) {
        const dt = running ? Math.min(40, now - last) : 0; // ms (clamp)
        last = now;
        const seconds = dt / 1000;

        // advance time-of-day slowly
        timeOfDay += (seconds / cycleSeconds);
        timeOfDay = timeOfDay % 1;

        const speed = baseSpeed * speedMultiplier;
        worldOffsetDelta = speed * seconds * 120; // tune multiplier for feel
        worldOffset += worldOffsetDelta;
        document.getElementById('distanceMeter').textContent = worldOffset.toFixed(0) + ' meters' + ' (' + worldOffsetDelta.toFixed(1) + ' m/s)';

        drawSky(timeOfDay);

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

       

        requestAnimationFrame(frame);
    }

    // UI buttons


    const spUp = document.getElementById('speedUp');
    const spDown = document.getElementById('speedDown');
    const spLabel = document.getElementById('speedLabel');
    spUp.addEventListener('click', () => {
        speedMultiplier = Math.min(2.5, speedMultiplier + 0.1);
        spLabel.textContent = 'Speed: ' + speedMultiplier.toFixed(1) + 'x';
        cycleSeconds /= 2;
    });
    spDown.addEventListener('click', () => {
        speedMultiplier = Math.max(0.2, speedMultiplier - 0.1);
        spLabel.textContent = 'Speed: ' + speedMultiplier.toFixed(1) + 'x';
        cycleSeconds *= 2;
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

document.addEventListener('keydown', event => {
    if (event.key === ' ') {
        running = !running;
        if (running) {
            // document.getElementById('playHint').style.display = 'none';
        }
    }
});


