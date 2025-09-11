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

// AI-assisted: Claude suggested the structure of this function. 
// Main functionality was modified by the author.
function playNotificationSound() {
    if (!getSoundEnabled()) {
        console.log('Sound disabled by the user');
        return;
    }

    try {
        
        const alarm = new Audio('/assets/sounds/alarm.mp3');

        alarm.play();

        setTimeout(() => {
            alarm.pause();
            alarm.currentTime = 0; 
        }, 3000);

    } catch (error) {
        console.log('Error when playing sound:', error);
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

function displayColon() {

    if (colonVisible) {
        colon.style.visibility = 'hidden';
        colonVisible = false; 
    } else {
        colon.style.visibility = 'visible';
        colonVisible = true; 
    }

}

// AI-assisted: Claude suggested the logic for this function.
function resetPlayButton() {
    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', false);
    clearInterval(colonInterval);
    colon.style.visibility = 'visible';
    stopBtn.style.display = 'inline-flex';
    skipBtn.style.display = 'inline-flex';
}


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

// AI-assisted: ChatGPT suggested the logic for this function.
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


// AI-assisted: ChatGPT and Claude suggested a small portion of this function. 
// Main functionality was created by the author.
function pauseTimeHandler(isSelfInitiated) {

    clearInterval(workTimeInterval);

    console.log(breakInterval);

    if(completedShortBreaks < breakInterval) {

        let currentBreakTime = shortBreakTime;
        currentMode = 'short'; 

        if (isSelfInitiated === false) {
        currentBreakTime = getDisplayTime();
        };

        pauseTimeInterval = setInterval(() => {

            if(currentBreakTime > 0) {
                currentBreakTime--;
                isPause = true;
                setTimerStatus(false);
                updateTimerDisplay(currentBreakTime);
                updateProgressBar(currentBreakTime, shortBreakTime);


                console.log('Short Break', currentBreakTime);
            } else {
                clearInterval(pauseTimeInterval);
                completeShortBreak();
                
                if (getAutoStartPomos()) {
                    isPause = false;
                    setTimerStatus(true);
                    countdownWorkTime(true);
                    showToast('Break finished! It is time to start working.');

                    console.log('Auto-starting work session');
                } else {
                    
                    prepareNextMode('work');
                    resetPlayButton();

                    console.log('Waiting for user to start work session');
                }
                
                console.log('End of Short Break', completedShortBreaks);
            };

        }, 1000);
    } else {

        currentMode = 'long';
        let currentBreakTime = longBreakTime;

        if(isSelfInitiated === false) {
            currentBreakTime = getDisplayTime();
        };

        pauseTimeInterval = setInterval(() => {
            if(currentBreakTime > 0) {
                currentBreakTime--;
                isPause = true;
                setTimerStatus(false);
                updateTimerDisplay(currentBreakTime);
                updateProgressBar(currentBreakTime, longBreakTime);

                console.log('Long break', currentBreakTime);

            } else {
                clearInterval(pauseTimeInterval);
                completeLongBreak();

                if (getAutoStartPomos()) {
                    setTimerStatus(true);
                    isPause = false;
                    countdownWorkTime(true);
                    showToast('Break finished! It is time to start working.');

                    console.log('Auto-starting work session after long break');
                } else {

                    prepareNextMode('work');
                    resetPlayButton();
                    console.log('Waiting for user to start work session after long break');
                }

                console.log('End of Long Break', completedLongBreaks);
            }
        }, 1000)
    }   
}


function getDisplayTime () {
  const mins = parseInt(minutesDisplay.textContent, 10);
  const secs = parseInt(secondsDisplay.textContent, 10);
  return mins * 60 + secs;
}

// AI-assisted: ChatGPT and Claude suggested a small portion of this function. 
// Main functionality was created by the author.
function countdownWorkTime (isSelfInitiated){

   let currentWorkTime = workTime;

    
    if (isSelfInitiated === false) {
        currentWorkTime = getDisplayTime ();
        console.log('peguei o display');
    }
    
    workTimeInterval = setInterval(() => {
        
        if (currentWorkTime > 0) {
            
            currentWorkTime--;
            isPause = false;
            setTimerStatus(true);
            updateTimerDisplay(currentWorkTime);
            currentMode = 'work';
            updateProgressBar(currentWorkTime, workTime);

            console.log('Work time', currentWorkTime);
        } else {
            clearInterval(workTimeInterval);
            completeWorkSession();
            
            
            if (getAutoStartBreaks()) {
                isPause = true;
                pauseTimeHandler(true);
                setTimerStatus(false);
                showToast('Work session completed! It is time to take a break.');
                
                console.log('Auto-starting break');
            } else {
                
                const nextBreakType = (completedShortBreaks < breakInterval) ? 'short' : 'long';
                prepareNextMode(nextBreakType);
                resetPlayButton();
                console.log('Waiting for user to start break');
            }
            
            console.log('final do work', completedPomodoros);
            
        }
    }, 1000); 

}

// AI-assisted: ChatGPT suggested a small portion of this function.
// Main functionality was modified by the author.
playBtn.addEventListener('click', () => {
    const isPlayState = playBtn.classList.contains('play-controls__button--play');
    

    if (isPlayState) { 
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

    } else {

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

// AI-assisted: ChatGPT suggested a portion of this function.
// Main functionality was modified by the author.
function statusDisplay(mode) {
    if (mode === 'work') {
        currentMode = 'work';
        updateTimerDisplay(workTime);
        updateProgressBar(workTime, workTime);
        isPause = false;
        setTimerStatus(true);
        showToast('Break finished! It is time to start working.');
        pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');
        console.log("In work mode",completedPomodoros);
    } else if (mode === 'short') {
        currentMode = 'short';
        updateTimerDisplay(shortBreakTime);
        updateProgressBar(shortBreakTime, shortBreakTime); 
        isPause = true;
        setTimerStatus(false);
        showToast('Work session completed! It is time to take a break.');

        console.log("In short mode",completedShortBreaks);
        
    } else if (mode === 'long') {
        currentMode = 'long';
        updateTimerDisplay(longBreakTime);
        updateProgressBar(longBreakTime, longBreakTime); 
        isPause = true;
        setTimerStatus(false);
        showToast('Work session completed! It is time to take a break.');

        console.log("In long mode",completedShortBreaks);
    
    }
}

// AI-assisted: Claude suggested a portion of this function.
// Main functionality was modified by the author.
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


// AI-assisted: ChatGPT suggested the logic for this function.
// Some functionality was modified by the author.
skipBtn.addEventListener('click', () => {
    
    clearInterval(workTimeInterval);
    clearInterval(pauseTimeInterval);
    clearInterval(colonInterval);


    if (isPause === false) {
        const nextBreak = (completedShortBreaks < breakInterval) ? 'short' : 'long';
        completeWorkSession();
        statusDisplay(nextBreak);

        console.log("Next break is:", nextBreak);
        console.log("skipping work -> going into pause");
    } else {
        if (currentMode === 'short') {
            completeShortBreak();

            console.log("skipping pause -> going into work");
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


function stopTimer() {
    clearInterval(workTimeInterval);
    clearInterval(pauseTimeInterval);
    clearInterval(colonInterval);

    colon.style.visibility = 'visible';
    colonVisible = true;

    isPause = false;
    currentMode = 'work';

    completedPomodoros = 0;
    completedShortBreaks = 0;
    completedLongBreaks = 0;

    pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');

    updateTimerDisplay(workTime);
    updateProgressBar(workTime, workTime);
    setTimerStatus(true);


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


// AI-assisted: Claude suggested the logic for this function.
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

