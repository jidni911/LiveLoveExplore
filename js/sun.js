// Sun color
const sunDay = [255, 210, 70];
const moonColor = [220, 230, 255];


// new code
// nicer palette for sun phases (RGB arrays)
const SUN_SUNRISE = [255, 170, 85];   // warm orange
const SUN_NOON = [255, 235, 165];  // bright golden
const SUN_SUNSET = [255, 150, 70];   // deep orange/red
const MOON_COLOR = [190, 205, 255];  // cool moonlight

// smooth interpolation helper (makes transitions softer)
function smoothstep(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return x * x * (3 - 2 * x);
}

// Realistic moon colors (RGB)
const MOON_COLORS = {
    bright: [230, 240, 255],  // full moon - bright white
    pale: [210, 220, 245],    // normal moonlight
    yellow: [255, 230, 200],  // near horizon - warm yellow
    orange: [255, 200, 160],  // low moon - atmospheric orange
    blue: [180, 200, 255]     // cold bluish tint (high altitude)
};

// end new code

function drawSun(t) {//t in 0..1 => day->night
    const virtualTime = t * 24 + 6;
    const minutes = Math.floor(virtualTime * 60 % 60);
    const hours = Math.floor(virtualTime);
    const ampm = hours < 12 ? 'AM' : 'PM';
    document.getElementById('clockface').innerText = `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    // t in 0..1 cycles day->night
    const phi = t * Math.PI * 2; // angle around
    // sun x: map phi to left->right horizontally
    const sx = t < 0.5 ? (canvas.width + 700) * (0.8 * t) * 2 - 350 : (canvas.width + 700) * (0.8 * (t - 0.5)) * 2 - 350;
    // sun y: arch across the sky (lower at edges)
    const sunY = canvas.height * 0.5 - Math.abs(Math.sin(Math.PI * t * 2) * canvas.height * 0.4);
    const size = 40 + Math.sin(Math.PI * t) * 12;
    // color lerp: daytime sun vs moon
    // const sc = lerpColor(sunDay, moonColor, Math.max(0, 1 - Math.abs(0.5 - t) * 2));
    // const sc = lerpColor(sunDay, moonColor, Math.max(0, 1 - Math.abs(12 - virtualTime) / 12));
    // new code
    const hour = (virtualTime % 24 + 24) % 24; // safe wrap
    let sc; // resulting color array

    if (hour >= 6 && hour < 8) {
        // sunrise: 5:00 -> 8:00 : SUN_SUNRISE -> SUN_NOON
        let p = (hour - 5) / 3;
        p = smoothstep(p);
        sc = lerpColor(SUN_SUNRISE, SUN_NOON, p);

    } else if (hour >= 8 && hour < 16) {
        // mid day: 8:00 -> 16:00 : close to SUN_NOON
        let p = (hour - 8) / 8;
        p = smoothstep(p);
        sc = lerpColor(SUN_NOON, SUN_NOON, p); // stays near noon color

    } else if (hour >= 16 && hour < 18) {
        // sunset: 16:00 -> 19:00 : SUN_NOON -> SUN_SUNSET
        let p = (hour - 16) / 3;
        p = smoothstep(p);
        sc = lerpColor(SUN_NOON, SUN_SUNSET, p);

    } else {
        // night: blend to moon color. For deep night use MOON_COLOR.
        // compute how deep night: between 19..24 and 0..5
        sc = getMoonColor(hour);
    }
    // end new code

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



function getMoonColor(hour) {
    // hour 0–5 or 19–24 = night
    // we'll blend between orange at sunset, yellow when rising,
    // to pale/blue as it climbs high

    let c1, c2, p;

    if (hour >= 19 && hour < 21) {
        // early night: orange → yellow
        c1 = MOON_COLORS.orange;
        c2 = MOON_COLORS.yellow;
        p = (hour - 19) / 2;
    } else if (hour >= 21 && hour < 23) {
        // mid-evening: yellow → pale
        c1 = MOON_COLORS.yellow;
        c2 = MOON_COLORS.pale;
        p = (hour - 21) / 2;
    } else if (hour >= 23 || hour < 2) {
        // late night: pale → blue (wrap after midnight)
        const adjHour = hour >= 23 ? (hour - 23) : (hour + 1);
        c1 = MOON_COLORS.pale;
        c2 = MOON_COLORS.blue;
        p = adjHour / 3;
    } else {
        // pre-dawn: blue → yellowish (moon near horizon)
        c1 = MOON_COLORS.blue;
        c2 = MOON_COLORS.yellow;
        p = (hour - 2) / 3;
    }

    p = Math.min(1, Math.max(0, p));
    return lerpColor(c1, c2, p);
}
