import './timer.js';
import { resetTimerWithNewSettings, isTimerActive, hasCompletedPomodoros } from './timer.js';



const modal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');

const pomoTime = document.querySelector('#pomodoro-time');
const shortBreak = document.querySelector('#short-break');
const longBreak = document.querySelector('#long-break');
const breakInterval = document.querySelector('#break-interval');

const autoStartBreaks = document.querySelector('#auto-start-breaks');
const autoStartPomos = document.querySelector('#auto-start-pomos');
const soundToggle = document.querySelector('#sound');

const cancelBtn = document.querySelector('.cancel-button');
const confirmBtn =  document.querySelector('.confirm-button');


const getBool = (key, def = false) => {
  const value = localStorage.getItem(key);
  return value === null ? def : JSON.parse(value);
};

const setBool = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};


loadSettings ();


settingsBtn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    settingsBtn.setAttribute (
        'aria-expanded',
        modal.classList.contains('hidden') ? 'false' : 'true'
    );
});


confirmBtn.addEventListener('click', (event) => {
    event.preventDefault(); 

    const selectedPomoTime = parseInt(pomoTime.value, 10);
    const selectedShortBreak = parseInt(shortBreak.value, 10); 
    const selectedLongBreak = parseInt(longBreak.value, 10);
    const selectedBreakInterval = parseInt(breakInterval.value, 10);

    const applyChanges = () => {

        localStorage.setItem('pomoTime', selectedPomoTime);
        localStorage.setItem('shortBreak', selectedShortBreak);
        localStorage.setItem('longBreak', selectedLongBreak);
        localStorage.setItem('breakInterval', selectedBreakInterval);

        setBool('autoStartBreaks', autoStartBreaks.checked);
        setBool('autoStartPomos', autoStartPomos.checked);
        setBool('soundEnabled', soundToggle.checked);

        resetTimerWithNewSettings();
        modal.classList.add('hidden');
        settingsBtn.setAttribute('aria-expanded', 'false');
    };

    if (isTimerActive() || hasCompletedPomodoros()) {
        
        const confirmation = confirm(
            "⚠️ Apply new settings?\n\n" +
            "This will stop the current timer and reset your progress.\n\n" +
            "Continue?"
        );
        
        if (confirmation) {
            applyChanges();
        }

    } else {
        // Se não há timer ativo nem progresso, aplicar diretamente
        applyChanges();
    }
});

cancelBtn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    loadSettings(); 
});




//load getters
function loadSettings () {

    const userPomoTime = localStorage.getItem('pomoTime');
    const userShortBreak = localStorage.getItem('shortBreak');
    const userLongBreak = localStorage.getItem('longBreak');
    const userBreakInterval = localStorage.getItem('breakInterval');
    const userAutoBreaks = localStorage.getItem('autoStartBreaks');
    const userAutoPomos  = localStorage.getItem('autoStartPomos');
    
    if(userPomoTime !== null) {
        pomoTime.value = userPomoTime;
    };

    if(userShortBreak !== null) {
        shortBreak.value = userShortBreak;
    }; 

    if(userLongBreak !== null) {
        longBreak.value = userLongBreak;       
    };

    if(userBreakInterval !== null) {
        breakInterval.value = userBreakInterval;
    };

    autoStartBreaks.checked = getBool('autoStartBreaks', false);
    autoStartPomos.checked = getBool('autoStartPomos', false);
    soundToggle.checked = getBool('soundEnabled', true);
}

//export getters
export function getUserPomoTime() {
    return localStorage.getItem('pomoTime') || '25';
}

export function getUserShortBreak() {
    return localStorage.getItem('shortBreak') || '5';
}

export function getUserLongBreak() {
    return localStorage.getItem('longBreak') || '20';
}

export function getUserBreakInterval() {
    return localStorage.getItem('breakInterval') || '4';
}

export function getAutoStartBreaks() {
    return getBool('autoStartBreaks', false);
}

export function getAutoStartPomos() {
    return getBool('autoStartPomos', false);
}

export function getSoundEnabled() {
    return getBool('soundEnabled', true);
}