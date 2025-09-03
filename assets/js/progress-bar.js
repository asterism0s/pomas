export function updateProgressBar(timeRemaining, totalTime) {
  const bars = document.querySelectorAll('.bar');
  const progress = timeRemaining / totalTime;

  const totalBars = bars.length;
  const activeBars = Math.ceil(progress * totalBars);

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