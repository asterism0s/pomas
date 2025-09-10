// AI-assisted: Claude suggested a small portion of this function.
// Main functionality was made by the author.
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

