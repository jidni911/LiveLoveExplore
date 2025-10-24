const btn = document.getElementById('toggleSound');
const audio = document.getElementById('bgAudio');
let audioPlaying = false;
btn.addEventListener('click', () => {
    if (!audioPlaying) {
        audio.play().catch(() => { /* user gesture required — button is user gesture so okay */ });
        btn.textContent = 'Pause Music';
        audioPlaying = true;
        document.getElementById('playHint').style.display = 'none';
    } else {
        audio.pause();
        btn.textContent = 'Play Music';
        audioPlaying = false;
    }
});

document.onkeyup = (e) => {
    if (e.key === 'm') {
        if (!audioPlaying) {
            audio.play().catch(() => { /* user gesture required — button is user gesture so okay */ });
            btn.textContent = 'Pause Music';
            audioPlaying = true;
            document.getElementById('playHint').style.display = 'none';
        } else {
            audio.pause();
            btn.textContent = 'Play Music';
            audioPlaying = false;
        }
    }
};