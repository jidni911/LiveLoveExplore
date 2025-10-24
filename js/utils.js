const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha: false });
var ASPECT_RATIO = -1;
// let DPR = window.devicePixelRatio 
let DPR = Math.max(1, window.devicePixelRatio || 1);
// let DPR = Math.min(window.devicePixelRatio || 1, 2); 
function resize(ASPECT_RATIO) {
    if (ASPECT_RATIO == 0) {
        DPR = Math.max(1, window.devicePixelRatio || 1);
        DPR = window.devicePixelRatio

        canvas.width = Math.floor(window.innerWidth * DPR);
        canvas.height = Math.floor(window.innerHeight * DPR);
        canvas.style.position = "relative";
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        canvas.style.left = window.scrollX + "px";
        canvas.style.top = window.scrollY + "px";
    } else if (ASPECT_RATIO == -1) {
        const BASE_WIDTH = 1920;
        const BASE_HEIGHT = 1080;
        const BASE_ASPECT = BASE_WIDTH / BASE_HEIGHT;

        let DPR = 1;
        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;

        DPR = Math.max(1, window.devicePixelRatio || 1);

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const screenAspect = screenW / screenH;

        let renderW, renderH;

        // 🧮 Maintain aspect ratio (16:9 default)
        if (screenAspect > BASE_ASPECT) {
            // screen is wider → fit to height
            renderH = screenH;
            renderW = renderH * BASE_ASPECT;
        } else {
            // screen is taller → fit to width
            renderW = screenW;
            renderH = renderW / BASE_ASPECT;
        }

        // Pixel-perfect scaling
        canvas.width = renderW * DPR;
        canvas.height = renderH * DPR;
        canvas.style.width = renderW + "px";
        canvas.style.height = renderH + "px";

        // Center canvas on screen (letterboxing)
        offsetX = (screenW - renderW) / 2;
        offsetY = (screenH - renderH) / 2;
        canvas.style.position = "absolute";
        canvas.style.left = offsetX + "px";
        canvas.style.top = offsetY + "px";

        // Compute scale factor between BASE and actual
        scale = renderW / BASE_WIDTH;
    }
    else {
        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;

        // Maintain 16:9 aspect ratio
        let targetWidth = availableWidth;
        let targetHeight = availableWidth / ASPECT_RATIO;

        // If height exceeds screen, fit by height instead
        if (targetHeight > availableHeight) {
            targetHeight = availableHeight;
            targetWidth = availableHeight * ASPECT_RATIO;
        }

        // Set internal canvas resolution (for sharp rendering)
        canvas.width = Math.floor(targetWidth * DPR);
        canvas.height = Math.floor(targetHeight * DPR);

        // Set visible size (CSS pixels)
        canvas.style.width = `${targetWidth}px`;
        canvas.style.height = `${targetHeight}px`;

        // Center it
        canvas.style.position = "absolute";
        canvas.style.left = `${(availableWidth - targetWidth) / 2}px`;
        canvas.style.top = `${(availableHeight - targetHeight) / 2}px`;
    }

}
window.addEventListener('resize', () => resize(ASPECT_RATIO));
resize(ASPECT_RATIO);
document.getElementById('ratioSelector').addEventListener('change', () => {
    ASPECT_RATIO = document.getElementById('ratioSelector').value;
    resize(ASPECT_RATIO);
})

// World state
let worldOffset = 0;           // how far world scrolled
let baseSpeed = 1.0;          // world speed multiplier
let speedMultiplier = 1.0;    // changed by UI
let running = false


// Time / day-night cycle
let cycleSeconds = 60; // full day-night cycle duration in seconds
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