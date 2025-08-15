
export let timerStatus = "work"; 
export let completedPomodoros = 0;
export let completedShortBreaks = 0;

export function setTimerStatus(status) { 
    timerStatus = status; 
};

export function incrementPomodoros() { 
    completedPomodoros += 1; 
};

export function incrementShortBreaks() { 
    completedShortBreaks += 1; 
};


export function resetShortBreaks() { 
    completedShortBreaks = 0; 
}

// function checkStatus() {

//     // if(pomoCounter !== 4) {

//     // }
// }

// Se o timer terminar e não houver 4 pomodoros completos, é pausa curta. 

// Se o timer terminar e houver 4 timers finalizados, é pausa longa
