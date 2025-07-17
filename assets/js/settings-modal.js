import './timer.js';

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


function updateTimer(selectBox){
    const selectedValue = selectBox.value;

    timerMinutes.textContent = selectedValue;
    timerSeconds.textContent = '00';

}


pomoTime.addEventListener('change', () => { updateTimer(pomoTime) });
// shortBreak.addEventListener('change', () => { updateTimer(shortBreak) });
// longBreak.addEventListener('change', () => { updateTimer(longBreak) });



settingsBtn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    settingsBtn.setAttribute (
        'aria-expanded',
        modal.classList.contains('hidden') ? 'false' : 'true'
    );
});

confirmBtn.addEventListener('click', () => {
    const selectedPomoTime = pomoTime.value;
    const selectedShortBreak = shortBreak.value; 
    const selectedLongBreak = longBreak.value;
    const selectedLongInterval = longInterval.value;

    localStorage.setItem('pomoTime', selectedPomoTime);
    localStorage.setItem('shortBreak', selectedShortBreak);
    localStorage.setItem('longBreak', selectedLongBreak);
    localStorage.setItem('longInterval', selectedLongInterval);

    
   
})

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
