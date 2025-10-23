const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha: false });
let DPR = Math.max(1, window.devicePixelRatio || 1);

function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// World state
let worldOffset = 0;           // how far world scrolled
let baseSpeed = 1.0;          // world speed multiplier
let speedMultiplier = 1.0;    // changed by UI


// Time / day-night cycle
const cycleSeconds = 60; // full day-night cycle duration in seconds
let timeOfDay = 0;       // 0..1 where 0 = sunrise, 0.5 = sunset, 1 = back to sunrise

let last = performance.now();
let fpsCounter = 0;
let fpsTimer = 0;
let worldOffsetDelta = 0;


function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(c1, c2, t) {
    // c: [r,g,b]
    return [
        Math.round(lerp(c1[0], c2[0], t)),
        Math.round(lerp(c1[1], c2[1], t)),
        Math.round(lerp(c1[2], c2[2], t))
    ];
}

function rgbStr(c) { return `rgb(${c[0]},${c[1]},${c[2]})`; }