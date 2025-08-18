const workIcon = document.querySelector('.timer-card__status-work-icon');
const pauseIcon = document.querySelector('.timer-card__status-pause-icon');

export let timerStatus = "work"; 


export function setTimerStatus(status) { 
    timerStatus = status; 
};


// function checkStatus() {

//     // if(pomoCounter !== 4) {

//     // }
// }

// Se o timer terminar e não houver 4 pomodoros completos, é pausa curta. 

// Se o timer terminar e houver 4 timers finalizados, é pausa longa
