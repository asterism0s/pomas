// === IMPORTS  - GET USER PREFERENCES ===
import './settings-modal.js';
import { getUserPomoTime } from './settings-modal.js';
import { getUserShortBreak } from './settings-modal.js';
import { getUserLongBreak } from './settings-modal.js';

// === SAVE USER PREFERENCES ===
const workTime = getUserPomoTime() * 60;
const shortBreakTime = getUserShortBreak() * 60;
const longBreakTime = getUserLongBreak() * 60;

let remainingTime = getUserPomoTime() * 60; //valor padrão;

// === UI ELEMENTS ===
const playBtn = document.getElementById('togglePlayControlBtn');
const stopBtn = document.querySelector('.play-controls__button--stop');
const skipBtn = document.querySelector('.play-controls__button--skip');
const colon = document.querySelector('.timer-card__separator--colon');
const minutesDisplay = document.querySelector('.timer-card__minutes--number');
const secondsDisplay = document.querySelector('.timer-card__seconds--number');

const workActive = document.querySelector('.timer-card__status-work-container');
const workDisabled = document.querySelector('.timer-card__status-work-disabled-container');

const pauseActive = document.querySelector('.timer-card__status-pause-container');
const pauseDisabled = document.querySelector('.timer-card__status-pause-disabled-container');



stopBtn.style.display = 'none';
skipBtn.style.display = 'none';


// === COLON BLINK DEALER === 
let colonInterval;
let colonVisible = true;

// === TIMER HANDLER ===
let workTimeInterval;
let pauseTimeInterval;
let isPause = false;

// === COUNTERS ===
let completedPomodoros = 0;
let completedShortBreaks = 0;
let completedLongBreaks = 0;

//=== TIMER STATUS ===
let timerStatus = ['work', 'break']; 

//Get the user selected value from settings, and put it on display 
export function setDisplayTimer(userSelectedTimer) {
updateTimerDisplay(userSelectedTimer);
}

function setTimerStatus(isWork) { 
    if (isWork === true) { //se for trabalho
        workActive.style.display = 'flex';
        workDisabled.style.display = 'none';

        pauseActive.style.display = 'none';
        pauseDisabled.style.display = 'flex';
        
    } else { //se for pausa
        pauseActive.style.display = 'flex';
        pauseDisabled.style.display = 'none';

        workActive.style.display = 'none';
        workDisabled.style.display = 'flex';
        
    };

}


function displayColon() {

    if (colonVisible) {
        colon.style.visibility = 'hidden';
        colonVisible = false; 
    } else {
        colon.style.visibility = 'visible';
        colonVisible = true; 
    }

}

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60;

    minutesDisplay.textContent = String(mins).padStart(2, '0');
    secondsDisplay.textContent = String(secs).padStart(2, '0');
}


function pauseTimeHandler(isSelfInitiated) {
    //checa se é uma pausa curta ou longa
     
    clearInterval(workTimeInterval);

    if(completedShortBreaks <= 3) {

        let currentBreakTime = shortBreakTime;

        if (isSelfInitiated === false) {
        currentBreakTime = getDisplayTime();
        console.log('peguei o display de pausa curta');
        };

        pauseTimeInterval = setInterval(() => {

            if(currentBreakTime > 0) {
                currentBreakTime--;
                console.log('Decrementando break curto', currentBreakTime);
                isPause = true;
                setTimerStatus(false);
                updateTimerDisplay(currentBreakTime);
            } else {
                clearInterval(pauseTimeInterval);
                countdownWorkTime(true);
                setTimerStatus(true);
                completedShortBreaks++;
                isPause = false;
                console.log('final do break curto')
                console.log(completedShortBreaks)
            };

        }, 1000);
    };
    
    if(completedShortBreaks > 4) {

        let currentBreakTime = longBreakTime;

        if(isSelfInitiated === false) {
            currentBreakTime = getDisplayTime();
            console.log('peguei o display de pausa longa');
        };

        pauseTimeInterval = setInterval(() => {
            if(currentBreakTime > 0) {
                currentBreakTime--;
                console.log('Decrementando break longo', currentBreakTime);
                isPause = true;
                setTimerStatus(false);
                updateTimerDisplay(currentBreakTime);
            } else {
                clearInterval(pauseTimeInterval);
                countdownWorkTime(true);
                setTimerStatus(true);
                completedLongBreaks++;
                isPause = false;
                console.log('final do break longo');
                console.log(completedLongBreaks);
            }
        }, 1000)


    };
}

//pega valor do timer sendo decrementado na tela em tempo real
function getDisplayTime () {
  const mins = parseInt(minutesDisplay.textContent, 10);
  const secs = parseInt(secondsDisplay.textContent, 10);
  return mins * 60 + secs;
}


function countdownWorkTime (isSelfInitiated){

   let currentWorkTime = workTime;

    
    if (isSelfInitiated === false) {
        currentWorkTime = getDisplayTime ();
        console.log('peguei o display');
    }
        
    // updateTimerDisplay(currentWorkTime);
    
    workTimeInterval = setInterval(() => {
        
        if (currentWorkTime > 0) {
            
            currentWorkTime--;
            isPause = false;
            setTimerStatus(true);
            updateTimerDisplay(currentWorkTime);
            console.log('Decrementando work time', currentWorkTime);

        } else {
            clearInterval(workTimeInterval);
            pauseTimeHandler(true);
            setTimerStatus(false);
            console.log('final do work');
            // endTimer();
            
        }
    }, 1000); 

}


function pauseWorkTimer() {
    clearInterval(workTimeInterval);
}

function pauseBreakTimer() {
    clearInterval(pauseTimeInterval);

}


playBtn.addEventListener('click', () => {
    const isPlayState = playBtn.classList.contains('play-controls__button--play');
    

    if (isPlayState) { //when the play button is pressed

        playBtn.classList.replace('play-controls__button--play', 'play-controls__button--pause');
        
        playBtn.setAttribute('aria-pressed', 'true');

        colonInterval = setInterval(displayColon, 1000);

        stopBtn.style.display = 'none';
        skipBtn.style.display = 'none';

        if (isPause === true) {
            pauseTimeHandler (false);
        };
        
        if (isPause === false) {
            countdownWorkTime (false);
        };


    } else { //when the pause button is pressed

        playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
        
        playBtn.setAttribute('aria-pressed', false);
        pauseWorkTimer();
        pauseBreakTimer();

        clearInterval(colonInterval);

        colon.style.visibility = 'visible';
        stopBtn.style.display = 'inline-flex';
        skipBtn.style.display = 'inline-flex';
    }

});


// function startTimer(){
    
//     // if(remainingTime === 0) {
//     //     remainingTime = getUserPomoTime() * 60; //tempo é sobrescrito quando entra em break
//     // }

//     updateTimerDisplay(remainingTime);
//     countdownWorkTime();

    
// }



// function endTimer() {
//     clearInterval(workTimeInterval);
//     clearInterval(colonInterval);

//     colon.style.visibility = 'visible';
//     colonVisible = true;

//     //desativar quando criar a breakTimer
//     // remainingTime = TEST_MODE ? TEST_SECONDS : getUserPomoTime() * 60;
//     // updateTimerDisplay(remainingTime);

//     // if () {
//     //     startShortBreakTimer();
//     // }
    

//     playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
//     playBtn.setAttribute('aria-pressed', false);
//     stopBtn.style.display = 'none';
//     skipBtn.style.display = 'none';

// }


//para o timer e reseta o tempo para o temop padrão
// function stopTimer() {
//     clearInterval(workTimeInterval);
//     clearInterval(colonInterval);

//     colon.style.visibility = 'visible';
//     colonVisible = true;

//     remainingTime = 10; // Reset to initial time
//     updateTimerDisplay(remainingTime);

//     playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
//     playBtn.setAttribute('aria-pressed', false);

//     stopBtn.style.display = 'none';
//     skipBtn.style.display = 'none';
// }

// function endTimer() {
//     clearInterval(workTimeInterval);
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



