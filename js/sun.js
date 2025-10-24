// Sun color
const sunDay = [255, 210, 70];
const moonColor = [220, 230, 255];

function drawSun(t) {//t in 0..1 => day->night
    const virtualTime = t * 24 +6;
    const minutes = Math.floor(virtualTime * 60 % 60);
    const hours = Math.floor(virtualTime);
    const ampm = hours < 12 ? 'AM' : 'PM';
    document.getElementById('clockface').innerText = `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`; 
    // t in 0..1 cycles day->night
    const phi = t * Math.PI * 2; // angle around
    // sun x: map phi to left->right horizontally
    const sx = t<0.5?(canvas.width+700) * ( 0.8 * t) *2-350: (canvas.width+700) * ( 0.8 * (t-0.5)) *2-350;
    // sun y: arch across the sky (lower at edges)
    const sunY = canvas.height * 0.5 - Math.abs(Math.sin(Math.PI * t*2)*canvas.height * 0.4);
    const size = 40 + Math.sin(Math.PI * t) * 12;
    // color lerp: daytime sun vs moon
    // const sc = lerpColor(sunDay, moonColor, Math.max(0, 1 - Math.abs(0.5 - t) * 2));
    const sc = lerpColor(sunDay, moonColor, Math.max(0, 1 - Math.abs(12 - virtualTime) / 12));

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