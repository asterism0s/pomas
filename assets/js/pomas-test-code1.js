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

//get value selected by the user from settings, and put it on display 
export function setDisplayTimer(userSelectedTimer) {
updateTimerDisplay(userSelectedTimer);
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

export function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60;

    minutesDisplay.textContent = String(mins).padStart(2, '0');
    secondsDisplay.textContent = String(secs).padStart(2, '0');
}


function pauseTimeHandler({ isSelfInitiated }) {
    //checa se é uma pausa curta ou longa
     
    clearInterval(workTimeInterval);

    if(completedShortBreaks <= 4) {

        let currentWorkTime = shortBreakTime;
        if (isSelfInitiated === false) {
        currentWorkTime = getDisplayTime();
        }

        pauseTimeInterval = setInterval(() => {

            if(currentWorkTime > 0) {
                currentWorkTime--;
                console.log('estou em pausa');
                isPause = true;
                updateTimerDisplay(currentWorkTime);
            } else {
                clearInterval(pauseTimeInterval);
                countdownWorkTime();
                completedShortBreaks++;
                console.log('final do break')
            }

        }, 1000);
    }
    

    

    //if 4 short breaks
        //dar clear interval
        //comeca longbreak
        //incrementa longbreak
            //if remainingTime === 0
                //volta startTimer()

     
}

//pega valor do timer sendo decrementado na tela
function getDisplayTime () {
  const mins = parseInt(minutesDisplay.textContent, 10);
  const secs = parseInt(secondsDisplay.textContent, 10);
  return mins * 60 + secs;
}


function countdownWorkTime ({ isSelfInitiated }){

   let currentWorkTime = workTime;
    
    if (isSelfInitiated) {
        currentWorkTime = workTime;
        console.log('peguei o display');
    }
        
    // updateTimerDisplay(currentWorkTime);
    
    workTimeInterval = setInterval(() => {
        
        if (currentWorkTime > 0) {
            
            currentWorkTime--;
            isPause = false;
            console.log('estou em work');
            updateTimerDisplay(currentWorkTime);

        } else {
            clearInterval(workTimeInterval);
            pauseTimeHandler();
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
            pauseTimeHandler ({ isSelfInitiated: false });
        };
        
        if (isPause === false) {
            countdownWorkTime ({ isSelfInitiated: false });
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



