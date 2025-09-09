import './settings-modal.js';
import { getUserBreakInterval, getUserPomoTime, getUserShortBreak, getUserLongBreak  } from './settings-modal.js';
import { getAutoStartBreaks, getAutoStartPomos, getSoundEnabled } from './settings-modal.js';
import { updateProgressBar } from './progress-bar.js';
import { showToast } from './notifications.js';

let workTime = getUserPomoTime() * 60;
let shortBreakTime = getUserShortBreak() * 60;
let longBreakTime = getUserLongBreak() * 60;
let breakInterval = parseInt(getUserBreakInterval() ?? '4', 10);


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

function playNotificationSound(mode) {
    if (!getSoundEnabled()) {
        console.log('Som desabilitado pelo usuário');
        return;
    }

    try {
        
        const alarm = new Audio('/assets/sounds/alarm.mp3');

        alarm.play();

        setTimeout(() => {
            alarm.pause();
            alarm.currentTime = 0; 
        }, 3000);

        console.log('Som de notificação tocado');
    } catch (error) {
        console.log('Erro ao tocar som:', error);
    }
}

function completeWorkSession() {
  completedPomodoros++;
  pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');

  playNotificationSound('break');
}

function completeShortBreak() {
  completedShortBreaks++;
  
  playNotificationSound('work');
}

function completeLongBreak() {
  completedLongBreaks++;
  completedShortBreaks = 0;

  playNotificationSound('break');
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

// Função auxiliar para resetar o botão de play/pause
function resetPlayButton() {
    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', false);
    clearInterval(colonInterval);
    colon.style.visibility = 'visible';
    stopBtn.style.display = 'inline-flex';
    skipBtn.style.display = 'inline-flex';
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
//v.1
// function pauseTimeHandler(isSelfInitiated) {
//     //check if its a short break
//     clearInterval(workTimeInterval);

//     console.log(breakInterval);

//     if(completedShortBreaks < breakInterval) {

//         let currentBreakTime = shortBreakTime;
//         currentMode = 'short'; 

//         if (isSelfInitiated === false) {
//         currentBreakTime = getDisplayTime();
//         console.log('peguei o display de pausa curta');
//         };

//         pauseTimeInterval = setInterval(() => {

//             if(currentBreakTime > 0) {
//                 currentBreakTime--;
//                 isPause = true;
//                 setTimerStatus(false);
//                 updateTimerDisplay(currentBreakTime);
//                 updateProgressBar(currentBreakTime, shortBreakTime);


//                 console.log('Decrementando break curto', currentBreakTime);
//             } else {
//                 clearInterval(pauseTimeInterval);
//                 completeShortBreak();
//                 isPause = false;
//                 setTimerStatus(true);
//                 countdownWorkTime(true);
                
//                 console.log('final do break curto', completedShortBreaks);
//             };

//         }, 1000);
//     } else {

//         currentMode = 'long';
//         let currentBreakTime = longBreakTime;

//         if(isSelfInitiated === false) {
//             currentBreakTime = getDisplayTime();
//             console.log('peguei o display de pausa longa');
//         };

//         pauseTimeInterval = setInterval(() => {
//             if(currentBreakTime > 0) {
//                 currentBreakTime--;
//                 isPause = true;
//                 setTimerStatus(false);
//                 updateTimerDisplay(currentBreakTime);
//                 updateProgressBar(currentBreakTime, longBreakTime);

//                 console.log('Decrementando break longo', currentBreakTime);
//             } else {
//                 clearInterval(pauseTimeInterval);
//                 completeLongBreak();
//                 setTimerStatus(true);
//                 isPause = false;
//                 countdownWorkTime(true);

//                 console.log('final do break longo', completedLongBreaks);
//             }
//         }, 1000)
//     }
    
// }

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
                
                // Verifica se auto-start de pomodoros está ativado
                if (getAutoStartPomos()) {
                    isPause = false;
                    setTimerStatus(true);
                    countdownWorkTime(true);
                    showToast('Break finished! It is time to start working.');

                    console.log('Auto-starting work session');
                } else {
                    // Prepara o próximo modo mas não inicia
                    prepareNextMode('work');
                    resetPlayButton();

                    console.log('Waiting for user to start work session');
                }
                
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
                
                // Verifica se auto-start de pomodoros está ativado
                if (getAutoStartPomos()) {
                    setTimerStatus(true);
                    isPause = false;
                    countdownWorkTime(true);
                    showToast('Break finished! It is time to start working.');

                    console.log('Auto-starting work session after long break');
                } else {
                    // Prepara o próximo modo mas não inicia
                    prepareNextMode('work');
                    resetPlayButton();
                    console.log('Waiting for user to start work session after long break');
                }

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

//Work timer -> v.1
// function countdownWorkTime (isSelfInitiated){

//    let currentWorkTime = workTime;

    
//     if (isSelfInitiated === false) {
//         currentWorkTime = getDisplayTime ();
//         console.log('peguei o display');
//     }
        
//     // updateTimerDisplay(currentWorkTime);
    
//     workTimeInterval = setInterval(() => {
        
//         if (currentWorkTime > 0) {
            
//             currentWorkTime--;
//             isPause = false;
//             setTimerStatus(true);
//             updateTimerDisplay(currentWorkTime);
//             currentMode = 'work';
//             updateProgressBar(currentWorkTime, workTime);

//             console.log('Decrementando work time', currentWorkTime);
//         } else {
//             clearInterval(workTimeInterval);
//             completeWorkSession();
//             isPause = true;
//             pauseTimeHandler(true);
//             setTimerStatus(false);
            
//             console.log('final do work', completedPomodoros);
//             // endTimer();
            
//         }
//     }, 1000); 

// }

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
            
            // Verifica se auto-start de breaks está ativado
            if (getAutoStartBreaks()) {
                isPause = true;
                pauseTimeHandler(true);
                setTimerStatus(false);
                showToast('Work session completed! It is time to take a break.');
                
                console.log('Auto-starting break');
            } else {
                // Determina qual tipo de pausa será (curta ou longa)
                const nextBreakType = (completedShortBreaks < breakInterval) ? 'short' : 'long';
                prepareNextMode(nextBreakType);
                resetPlayButton();
                console.log('Waiting for user to start break');
            }
            
            console.log('final do work', completedPomodoros);
            
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
        updateProgressBar(workTime, workTime);
        isPause = false;
        setTimerStatus(true);
        showToast('Break finished! It is time to start working.');
        pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');
        console.log("em mode work",completedPomodoros);
    } else if (mode === 'short') {
        currentMode = 'short';
        updateTimerDisplay(shortBreakTime);
        updateProgressBar(shortBreakTime, shortBreakTime); 
        isPause = true;
        setTimerStatus(false);
        showToast('Work session completed! It is time to take a break.');

        console.log("em mode short",completedShortBreaks);
        
    } else if (mode === 'long') {
        currentMode = 'long';
        updateTimerDisplay(longBreakTime);
        updateProgressBar(longBreakTime, longBreakTime); 
        isPause = true;
        setTimerStatus(false);
        showToast('Work session completed! It is time to take a break.');

        console.log("em mode long",completedShortBreaks);
    
    }
}

// Função para preparar o próximo modo sem iniciar automaticamente
function prepareNextMode(nextMode) {
    if (nextMode === 'work') {
        updateTimerDisplay(workTime);
        isPause = false;
        setTimerStatus(true);
        currentMode = 'work';
        updateProgressBar(workTime, workTime);
        showToast('Break finished! Click play to start working.');
    } else if (nextMode === 'short') {
        updateTimerDisplay(shortBreakTime);
        isPause = true;
        setTimerStatus(false);
        currentMode = 'short';
        updateProgressBar(shortBreakTime, shortBreakTime);
        showToast('Work session completed! Click play to start your break.');
    } else if (nextMode === 'long') {
        updateTimerDisplay(longBreakTime);
        isPause = true;
        setTimerStatus(false);
        currentMode = 'long';
        updateProgressBar(longBreakTime, longBreakTime);
        showToast('Work session completed! Click play to start your long break.');
    }
}



skipBtn.addEventListener('click', () => {
    //interromper qualquer time ativo
    clearInterval(workTimeInterval);
    clearInterval(pauseTimeInterval);
    clearInterval(colonInterval);


    if (isPause === false) {
        const nextBreak = (completedShortBreaks < breakInterval) ? 'short' : 'long';
        completeWorkSession();
        statusDisplay(nextBreak);

        console.log("Next break is:", nextBreak);
        console.log("skipando work -> entrando em pausa");
    } else {
        if (currentMode === 'short') {
            completeShortBreak();

            console.log("skipando a pausa -> entrando em work");
        } else if (currentMode === 'long') {
            completeLongBreak();

        }

        statusDisplay('work');
        
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
    updateProgressBar(workTime, workTime);

    workActive.style.display = 'flex';
    workDisabled.style.display = 'none';
    workActive.removeAttribute('aria-hidden');
    workDisabled.setAttribute('aria-hidden', 'true');

    pauseActive.style.display = 'none';
    pauseDisabled.style.display = 'flex';
    pauseActive.setAttribute('aria-hidden', 'true');
    pauseDisabled.removeAttribute('aria-hidden');
});



export function resetTimerWithNewSettings() {

    clearInterval(workTimeInterval);
    clearInterval(pauseTimeInterval);
    clearInterval(colonInterval);

    colon.style.visibility = 'visible';
    colonVisible = true;

    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', false);
    stopBtn.style.display = 'none';
    skipBtn.style.display = 'none';

    completedPomodoros = 0;
    completedShortBreaks = 0;
    completedLongBreaks = 0;

    pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');

    workTime = getUserPomoTime() * 60;
    shortBreakTime = getUserShortBreak() * 60;
    longBreakTime = getUserLongBreak() * 60;
    breakInterval = parseInt(getUserBreakInterval() ?? '4', 10);

    isPause = false;
    currentMode = 'work';
    

    updateTimerDisplay(workTime);
    updateProgressBar(workTime, workTime);
    setTimerStatus(true);
}

export function isTimerActive() {
    return playBtn.classList.contains('play-controls__button--pause');
}

export function hasCompletedPomodoros() {
    return completedPomodoros > 0; 
}


//Get the user selected value from settings, and put it on display 
// export function setDisplayTimer(userSelectedTimer) {
// updateTimerDisplay(userSelectedTimer);
// }


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