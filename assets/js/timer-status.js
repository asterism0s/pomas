const workIcon = document.querySelector('.timer-card__status-work-icon');
const pauseIcon = document.querySelector('.timer-card__status-pause-icon');

export let timerStatus = ['work', 'break']; 


export function setTimerStatus(status) { 
    timerStatus = status; 

    
};

 

// function checkStatus() {

//     // if(pomoCounter !== 4) {

//     // }
// }

