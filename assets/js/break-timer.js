import { timerStatus } from './timer-status.js';
import { getUserShortBreak } from './settings-modal.js';
import { setRemainingTime } from './work-timer.js';
import { getRemainingTime } from './work-timer.js';



export function startBreakTimer () {
    if (getRemainingTime() === 0) {
        //pega o tempo selecionado pelo usuário e joga pra UI
        setRemainingTime = getUserShortBreak() * 60;
        //se sim Se sim, podemos iniciar o timer de pausa. 
    }
}
