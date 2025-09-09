// AI-assisted: Claude suggested a portion of this function.
// Main functionality was modified by the author.
export function updateProgressBar(timeRemaining, totalTime) {
    const bars = document.querySelectorAll('.bar');
    const totalBars = bars.length;

    let activeBars = Math.ceil((totalBars * timeRemaining) / totalTime);

    bars.forEach((bar, index) => {
        if (index < activeBars) {
            bar.classList.add('bar-active');
            bar.classList.remove('bar-inactive');
        } else {
            bar.classList.add('bar-inactive');
            bar.classList.remove('bar-active');
        }
    });
}

