// === IMPORTS  - GET USER PREFERENCES ===
import './settings-modal.js';
import { getUserBreakInterval, getUserPomoTime, getUserShortBreak, getUserLongBreak  } from './settings-modal.js';
import { getAutoStartBreaks, getAutoStartPomos, getSoundEnabled } from './settings-modal.js';
import { updateProgressBar } from './progress-bar.js';

// === SAVE USER PREFERENCES ===
const workTime = getUserPomoTime() * 60;
const shortBreakTime = getUserShortBreak() * 60;
const longBreakTime = getUserLongBreak() * 60;
const breakInterval = parseInt(getUserBreakInterval() ?? '4', 10);


// === UI ELEMENTS ===
const playBtn = document.getElementById('togglePlayControlBtn');
const colon = document.querySelector('.timer-card__separator--colon');
const stopBtn = document.querySelector('.play-controls__button--stop');
const skipBtn = document.querySelector('.play-controls__button--skip');
const pomasCounter = document.querySelector('.timer-card__counter-number');
const minutesDisplay = document.querySelector('.timer-card__minutes--number');
const secondsDisplay = document.querySelector('.timer-card__seconds--number');

const workActive = document.querySelector('.timer-card__status-work-container');
const workDisabled = document.querySelector('.timer-card__status-work-disabled-container');
const pauseActive = document.querySelector('.timer-card__status-pause-container');
const pauseDisabled = document.querySelector('.timer-card__status-pause-disabled-container');

stopBtn.style.display = 'none';
skipBtn.style.display = 'none';

let colonInterval;
let colonVisible = true;
let workTimeInterval;
let pauseTimeInterval;
let isPause = false;
let completedPomodoros = 0;
let completedShortBreaks = 0;
let completedLongBreaks = 0;
let currentMode = 'work';

function playNotificationSound() {
    if (!getSoundEnabled()) {
        console.log('Som desabilitado pelo usuário');
        return;
    }
    
    try {
        // Criar um som simples usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configurar som de notificação (bip suave)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        console.log('Som de notificação tocado');
    } catch (error) {
        console.log('Erro ao tocar som:', error);
    }
}

function autoStartTimer(mode, delay = 1000) {
    let shouldAutoStart = false;
    
    if (mode === 'break' && getAutoStartBreaks()) {
        shouldAutoStart = true;
    } else if (mode === 'work' && getAutoStartPomos()) {
        shouldAutoStart = true;
    }
    
    if (shouldAutoStart) {
        console.log(`Auto-iniciando ${mode} em ${delay}ms`);
        
        setTimeout(() => {
            // Simular clique no botão play
            if (playBtn.classList.contains('play-controls__button--play')) {
                playBtn.click();
                console.log(`${mode} iniciado automaticamente`);
            }
        }, delay);
    } else {
        console.log(`Auto-start desabilitado para ${mode}`);
    }
}

function completeWorkSession() {
  completedPomodoros++;
  pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');

  playNotificationSound();
}

function completeShortBreak() {
  completedShortBreaks++;

  playNotificationSound();
}

function completeLongBreak() {
  completedLongBreaks++;
  completedShortBreaks = 0;

  playNotificationSound();
}

//Get the user selected value from settings, and put it on display 
export function setDisplayTimer(userSelectedTimer) {
updateTimerDisplay(userSelectedTimer);
}

//Makes the colon blink
function displayColon() {

    if (colonVisible) {
        colon.style.visibility = 'hidden';
        colonVisible = false; 
    } else {
        colon.style.visibility = 'visible';
        colonVisible = true; 
    }

}

//Enable or disable the work time or coffe break icons
function setTimerStatus(isWork) { 

    if (isWork === true) { 
        workActive.style.display = 'flex';
        workDisabled.style.display = 'none';
        workActive.removeAttribute('aria-hidden');
        workDisabled.setAttribute('aria-hidden', 'true');

        pauseActive.style.display = 'none';
        pauseDisabled.style.display = 'flex';
        pauseActive.setAttribute('aria-hidden', 'true');
        pauseDisabled.removeAttribute('aria-hidden');
        
    } else {
        pauseActive.style.display = 'flex';
        pauseDisabled.style.display = 'none';
        pauseActive.removeAttribute('aria-hidden');
        pauseDisabled.setAttribute('aria-hidden', 'true');

        workActive.style.display = 'none';
        workDisabled.style.display = 'flex';
        workActive.setAttribute('aria-hidden', 'true');
        workDisabled.removeAttribute('aria-hidden');
        
    };

}

function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60;

    minutesDisplay.textContent = String(mins).padStart(2, '0');
    secondsDisplay.textContent = String(secs).padStart(2, '0');
}

function pauseWorkTimer() {
    clearInterval(workTimeInterval);
}

function pauseBreakTimer() {
    clearInterval(pauseTimeInterval);
}



//criar uma função pra chegar escolha do usuáro e retornar
//comparar no if statement do pauseTimeHandler

function pauseTimeHandler(isSelfInitiated) {
    //check if its a short break
    clearInterval(workTimeInterval);

    console.log(breakInterval);

    if(completedShortBreaks < breakInterval) {

        let currentBreakTime = shortBreakTime;
        currentMode = 'short'; 

        if (isSelfInitiated === false) {
        currentBreakTime = getDisplayTime();
        console.log('peguei o display de pausa curta');
        };

        pauseTimeInterval = setInterval(() => {

            if(currentBreakTime > 0) {
                currentBreakTime--;
                isPause = true;
                setTimerStatus(false);
                updateTimerDisplay(currentBreakTime);
                updateProgressBar(currentBreakTime, shortBreakTime);


                console.log('Decrementando break curto', currentBreakTime);
            } else {
                clearInterval(pauseTimeInterval);
                completeShortBreak();
                isPause = false;
                setTimerStatus(true);
                // countdownWorkTime(true);

                autoStartTimer('work', 1500);
                
                console.log('final do break curto', completedShortBreaks);
            };

        }, 1000);
    } else {

        currentMode = 'long';
        let currentBreakTime = longBreakTime;

        if(isSelfInitiated === false) {
            currentBreakTime = getDisplayTime();
            console.log('peguei o display de pausa longa');
        };

        pauseTimeInterval = setInterval(() => {
            if(currentBreakTime > 0) {
                currentBreakTime--;
                isPause = true;
                setTimerStatus(false);
                updateTimerDisplay(currentBreakTime);
                updateProgressBar(currentBreakTime, longBreakTime);

                console.log('Decrementando break longo', currentBreakTime);
            } else {
                clearInterval(pauseTimeInterval);
                completeLongBreak();
                setTimerStatus(true);
                isPause = false;
                countdownWorkTime(true);

                autoStartTimer('work', 1500);

                console.log('final do break longo', completedLongBreaks);
            }
        }, 1000)
    }
    
}

//Gets the in real time on display
function getDisplayTime () {
  const mins = parseInt(minutesDisplay.textContent, 10);
  const secs = parseInt(secondsDisplay.textContent, 10);
  return mins * 60 + secs;
}

//Work timer 
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
            currentMode = 'work';
            updateProgressBar(currentWorkTime, workTime);

            console.log('Decrementando work time', currentWorkTime);
        } else {
            clearInterval(workTimeInterval);
            completeWorkSession();
            isPause = true;
            // pauseTimeHandler(true);
            setTimerStatus(false);

            if (getAutoStartBreaks()) {
                autoStartTimer('break', 1500);
            } else {
                pauseTimeHandler(true);
            }
            
            console.log('final do work', completedPomodoros);
            // endTimer();
            
        }
    }, 1000); 

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

//When the user skips a session, this sets the display, without initiating another timer display
function statusDisplay(mode) {
    if (mode === 'work') {
        currentMode = 'work';
        updateTimerDisplay(workTime);
        isPause = false;
        setTimerStatus(true);
        
        pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');
        console.log("em mode work",completedPomodoros);
    } else if (mode === 'short') {
        currentMode = 'short';
        updateTimerDisplay(shortBreakTime);
        isPause = true;
        setTimerStatus(false);

        console.log("em mode short",completedShortBreaks);
        
    } else if (mode === 'long') {
        currentMode = 'long';
        updateTimerDisplay(longBreakTime);
        isPause = true;
        setTimerStatus(false);

        console.log("em mode long",completedShortBreaks);
    
    }
}


skipBtn.addEventListener('click', () => {
    //interromper qualquer time ativo
    clearInterval(workTimeInterval);
    clearInterval(pauseTimeInterval);
    clearInterval(colonInterval);


    if(isPause !== true) {
        const nextBreak = (completedShortBreaks < breakInterval) ? 'short' : 'long';
        completeWorkSession();
		statusDisplay(nextBreak);

        console.log("Next break is:",nextBreak);
		console.log("skipando work -> entrando em pausa");
    }

    if(isPause !== false) {
        
        if (currentMode !== 'long') {
        completeShortBreak();

        console.log("skipando a pausa -> entrando em work");
        }

        if(currentMode !== 'short') {
        completeLongBreak();
        }

        statusDisplay('work');
        console.log("skipando a pausa -> entrando em work");
    }


    colon.style.visibility = 'visible';
    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', false);
    stopBtn.style.display = 'inline-flex';
    skipBtn.style.display = 'inline-flex';
       
});

//para o timer e reseta o tempo para o temop padrão
function stopTimer() {
    clearInterval(workTimeInterval);
    clearInterval(pauseTimeInterval);
    clearInterval(colonInterval);

    colon.style.visibility = 'visible';
    colonVisible = true;

    updateTimerDisplay(workTime);

    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', false);

    stopBtn.style.display = 'none';
    skipBtn.style.display = 'none';
}


stopBtn.addEventListener('click', () => {
    stopTimer();

    workActive.style.display = 'flex';
    workDisabled.style.display = 'none';
    workActive.removeAttribute('aria-hidden');
    workDisabled.setAttribute('aria-hidden', 'true');

    pauseActive.style.display = 'none';
    pauseDisabled.style.display = 'flex';
    pauseActive.setAttribute('aria-hidden', 'true');
    pauseDisabled.removeAttribute('aria-hidden');
});




// function startTimer(){
    
//     // if(remainingTime === 0) {
//     //     remainingTime = getUserPomoTime() * 60; //tempo é sobrescrito quando entra em break
//     // }

//     updateTimerDisplay(remainingTime);
//     countdownWorkTime();

    
// }

// function clearAllIntervals() {
//     clearInterval(workTimeInterval);
//     clearInterval(pauseTimeInterval);
//     clearInterval(colonInterval);

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


    // //checks if its a long break
    // if(completedShortBreaks > breakInterval) {

    //     let currentBreakTime = longBreakTime;

    //     if(isSelfInitiated === false) {
    //         currentBreakTime = getDisplayTime();
    //         console.log('peguei o display de pausa longa');
    //     };

    //     pauseTimeInterval = setInterval(() => {
    //         if(currentBreakTime > 0) {
    //             currentBreakTime--;
    //             console.log('Decrementando break longo', currentBreakTime);
    //             isPause = true;
    //             setTimerStatus(false);
    //             updateTimerDisplay(currentBreakTime);
    //         } else {
    //             clearInterval(pauseTimeInterval);
    //             countdownWorkTime(true);
    //             setTimerStatus(true);
    //             completedLongBreaks++;
    //             completedShortBreaks = 0;
    //             isPause = false;
    //             console.log('final do break longo', completedLongBreaks);
    //         }
    //     }, 1000)

    // };