
import './settings-modal.js';
import './colon-interval.js';


import { getUserPomoTime } from './settings-modal.js';
// import { timerStatus } from './timer-status.js';
import { startShortBreakTimer } from './break-timer.js';
import { displayColon } from './colon-interval.js';

const playBtn = document.getElementById('togglePlayControlBtn');
const stopBtn = document.querySelector('.play-controls__button--stop');
const skipBtn = document.querySelector('.play-controls__button--skip');

const minutesDisplay = document.querySelector('.timer-card__minutes--number');

const secondsDisplay = document.querySelector('.timer-card__seconds--number');

const workIcon = document.querySelector('.timer-card__status-work-icon');
const pauseIcon = document.querySelector('.timer-card__status-pause-icon');


let isPause = false;
let timerInterval;
let colonInterval;


stopBtn.style.display = 'none';
skipBtn.style.display = 'none';

// DEBUG: enquanto for true, usa 10 s em vez do valor real. para desativar debug, passe TEST_MODE = false
const TEST_MODE = false;
const TEST_SECONDS = 10;

let remainingTime = getUserPomoTime() * 60;


export function setRemainingTime(seconds) {
remainingTime = seconds;
updateTimerDisplay(remainingTime);
}

//pega o tempo atual do timer
export function getRemainingTime() {
    return remainingTime;
}


export function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60;

    minutesDisplay.textContent = String(mins).padStart(2, '0');
    secondsDisplay.textContent = String(secs).padStart(2, '0');
}




//END_TIMER DEBUG
function endTimer() {
    clearInterval(timerInterval);
    clearInterval(colonInterval);

    colon.style.visibility = 'visible';
    colonVisible = true;

    //desativar quando criar a breakTimer
    // remainingTime = TEST_MODE ? TEST_SECONDS : getUserPomoTime() * 60;
    // updateTimerDisplay(remainingTime);

    startShortBreakTimer();

    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', false);
    stopBtn.style.display = 'none';
    skipBtn.style.display = 'none';

}

function countdownRemainingTime (){
    timerInterval = setInterval(() => {

        if (remainingTime > 0) {
            remainingTime--;
            updateTimerDisplay(remainingTime);

        } else {
            clearInterval(timerInterval);
            endTimer();
            
        }
    }, 1000); 

}

function startTimer(){
    
    // if(remainingTime === 0) {
    //     remainingTime = getUserPomoTime() * 60; //tempo é sobrescrito quando entra em break
    // }

    updateTimerDisplay(remainingTime);
    countdownRemainingTime();

    
}


function pauseTimer() {
    clearInterval(timerInterval);
}



playBtn.addEventListener('click', () => {
    const isPlayState = playBtn.classList.contains('play-controls__button--play');
    

    if (isPlayState) { //when the play button is pressed

        playBtn.classList.replace('play-controls__button--play', 'play-controls__button--pause');
        
        playBtn.setAttribute('aria-pressed', 'true');

        startTimer();
        console.log('início do work')
        
        colonInterval = setInterval(displayColon, 1000);

        stopBtn.style.display = 'none';
        skipBtn.style.display = 'none';

    } else { //when the pause button is pressed

        playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
        
        playBtn.setAttribute('aria-pressed', false);
        pauseTimer();

        clearInterval(colonInterval);

        colon.style.visibility = 'visible';
        stopBtn.style.display = 'inline-flex';
        skipBtn.style.display = 'inline-flex';
    }

});



//para o timer e reseta o tempo para o temop padrão
function stopTimer() {
    clearInterval(timerInterval);
    clearInterval(colonInterval);

    colon.style.visibility = 'visible';
    colonVisible = true;

    remainingTime = 10; // Reset to initial time
    updateTimerDisplay(remainingTime);

    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', false);

    stopBtn.style.display = 'none';
    skipBtn.style.display = 'none';
}

// function endTimer() {
//     clearInterval(timerInterval);
//     clearInterval(colonInterval);

//     colon.style.visibility = 'visible';
//     colonVisible = true;

//     remainingTime = getUserPomoTime() * 60; // Reset to initial time
//     updateTimerDisplay(remainingTime);

//     playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
//     playBtn.setAttribute('aria-pressed', false);

//     stopBtn.style.display = 'none';
//     skipBtn.style.display = 'none';
// };

// function changeIcon() {
    // apenas quando muda de sessão
    //document.querySelector(".minhaImagem").src = "novoCaminhoDaImagem.jpg";
// }



