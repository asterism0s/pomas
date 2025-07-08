const modal = document.getElementById('settings-modal');
const btn = document.getElementById('settings-btn');

const pomoTime = document.querySelector('#pomodoro-time');
const shortBreak = document.querySelector('#short-break');
const longBreak = document.querySelector('#long-break');
const longInterval = document.querySelector('#long-break-interval');

const timerMinutes = document.querySelector('.timer-card__minutes--number');
const timerSeconds = document.querySelector('.timer-card__seconds--number');


function updateTimer(selectBox){
    const selectedValue = selectBox.value;

    timerMinutes.textContent = selectedValue;
    timerSeconds.textContent = '00';

}


pomoTime.addEventListener('change', () => { updateTimer(pomoTime) });
shortBreak.addEventListener('change', () => { updateTimer(shortBreak) });
longBreak.addEventListener('change', () => { updateTimer(longBreak) });



btn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    btn.setAttribute (
        'aria-expanded',
        modal.classList.contains('hidden') ? 'false' : 'true'
    );
});

// Capturar os elementos do modal e da página principal

// Adicionar event listener para o botão "confirmar"
    // Capturar os valores dos inputs do modal
    // Atualizar os elementos da página principal com esses valores

// Adicionar event listener para o botão "cancelar"
    // Limpar os valores dos inputs do modal