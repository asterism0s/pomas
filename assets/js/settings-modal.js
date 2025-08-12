import './work-timer.js';

import { setRemainingTime } from './work-timer.js';

const modal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');

const pomoTime = document.querySelector('#pomodoro-time');

const shortBreak = document.querySelector('#short-break');
const longBreak = document.querySelector('#long-break');
const longInterval = document.querySelector('#long-break-interval');

const timerMinutes = document.querySelector('.timer-card__minutes--number');
const timerSeconds = document.querySelector('.timer-card__seconds--number');

const cancelBtn = document.querySelector('.cancel-button');
const confirmBtn =  document.querySelector('.confirm-button');



loadSettings ();


// shortBreak.addEventListener('change', () => { updateTimer(shortBreak) });
// longBreak.addEventListener('change', () => { updateTimer(longBreak) });


settingsBtn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    settingsBtn.setAttribute (
        'aria-expanded',
        modal.classList.contains('hidden') ? 'false' : 'true'
    );
});


confirmBtn.addEventListener('click', (event) => {

    event.preventDefault(); //prevent reload

    const selectedPomoTime = parseInt(pomoTime.value, 10);
    const selectedShortBreak = parseInt(shortBreak.value, 10); 
    const selectedLongBreak = parseInt(longBreak.value, 10);
    const selectedLongInterval = parseInt(longInterval.value, 10);

    localStorage.setItem('pomoTime', selectedPomoTime);
    localStorage.setItem('shortBreak', selectedShortBreak);
    localStorage.setItem('longBreak', selectedLongBreak);
    localStorage.setItem('longInterval', selectedLongInterval);

    setRemainingTime(selectedPomoTime * 60);

    modal.classList.add('hidden');
    settingsBtn.setAttribute('aria-expanded', 'false');

});

function loadSettings () {

    const userPomoTime = localStorage.getItem('pomoTime');
    const userShortBreak = localStorage.getItem('shortBreak');
    const userLongBreak = localStorage.getItem('longBreak');
    // const userlongInterval = localStorage.getItem('longInterval');
    
    if(userPomoTime !== null) {
        pomoTime.value = userPomoTime;
    };

    if(userShortBreak !== null) {
        shortBreak.value = userShortBreak;
    };

    if(userLongBreak !== null) {
        longBreak.value = userLongBreak;       
    };

}

export function getUserPomoTime() {
    return localStorage.getItem('pomoTime');
}

export function getUserShortBreak() {
    return localStorage.getItem('shortBreak');
}

export function getUserLongBreak() {
    return localStorage.getItem('longBreak');
}

cancelBtn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    cancelBtn.setAttribute (
        'aria-expanded',
        modal.classList.contains('hidden') ? 'false' : 'true'
    );

    pomoTime.value ='25'; 
    shortBreak.value ='5';
    longBreak.value = '20';
    longInterval.value = '2';
});
