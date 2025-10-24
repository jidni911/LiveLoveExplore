    // Sky colors: day sky and night sky
    const dayTop = [135, 206, 235]; // light sky
    const dayBottom = [224, 246, 255];
    const nightTop = [10, 14, 40]; // deep
    const nightBottom = [26, 32, 60];

    function drawSky(t){
        
        // sky gradient
        // dayFactor: 0..1 where 0=night, 1=day. Use a smooth curve: highest at 0.25..0.75
        // We want sunrise at 0.0, noon at 0.25, sunset at 0.5, midnight at 0.75, back at 1.0
        // Use a cosine to smooth
        const dayFactor = 0.5 + 0.5 * Math.cos((t - 0.25) * Math.PI * 2); // rough
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
    }
