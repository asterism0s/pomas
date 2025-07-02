const playBtn = document.querySelector('.play-controls__button--play');
const stopBtn = document.querySelector('.play-controls__button--stop');
const skipBtn = document.querySelector('.play-controls__button--skip')

const minutesDisplay = document.querySelector('.timer-card__minutes--number');
const secondsDisplay = document.querySelector('.timer-card__seconds--number');

let isRunning = false;
let timerInterval;
let remainingTime = 25 * 60;

stopBtn.style.display = 'none';
skipBtn.style.display = 'none';

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60;

    minutesDisplay.textContent = String(mins).padStart(2, '0');
    minutesDisplay.textContent = String(secs).padStart(2, '0');
}

function startTimer(){
    timerInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000)
}

function pauseTimer() {
    clearInterval(timerInterval);
}

// playBtn.addEventListener('click', () => {
//     const isPaused = playBtn.getAttribute('aria-pressed') === 'true';

//     if(!isRunning || isPaused) {
//         isRunning = true;

//         playBtn.classList.remove('paused')
//     }
// })


console.log(secondsDisplay);