// === IMPORTS (seus) ===
import './settings-modal.js';
import { getUserPomoTime } from './settings-modal.js';
import { getUserShortBreak } from './settings-modal.js';
import { getUserLongBreak } from './settings-modal.js';
// import { timerStatus } from './timer-status.js';
// import { startShortBreakTimer } from './break-timer.js';
// import { setPause } from './break-timer.js';

// === ELEMENTOS DE UI (seus) ===
const playBtn = document.getElementById('togglePlayControlBtn');
const stopBtn = document.querySelector('.play-controls__button--stop');
const skipBtn = document.querySelector('.play-controls__button--skip');
const colon = document.querySelector('.timer-card__separator--colon');

const minutesDisplay = document.querySelector('.timer-card__minutes--number');
const secondsDisplay = document.querySelector('.timer-card__seconds--number');

// === ESTADO/VARIÁVEIS (mantidos/ajustados) ===
let colonInterval;
let colonVisible = true;

// CONTADORES que você já tinha
let completedPomodoros = 0;
let completedShortBreaks = 0;
let completedLongBreaks = 0;

// NOVO: um único intervalo e uma única fonte de verdade
let tickId = null;                 // id do setInterval ativo (único)
let remainingSeconds = null;       // fonte de verdade do tempo restante
let mode = 'work';                 // 'work' | 'short' | 'long'
let isRunning = false;

// Mantém compatibilidade com a sua flag
let isPause = false;               // false => work, true => break (short/long)

// Inicial: esconde botões stop/skip como no seu código
stopBtn.style.display = 'none';
skipBtn.style.display = 'none';

// === FUNÇÕES (algumas suas, outras ajustadas) ===

// (sua) Atualiza o display
export function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  minutesDisplay.textContent = String(mins).padStart(2, '0');
  secondsDisplay.textContent = String(secs).padStart(2, '0');
}

// (sua) Piscar os dois pontos
export function displayColon() {
  if (colonVisible) {
    colon.style.visibility = 'hidden';
    colonVisible = false;
  } else {
    colon.style.visibility = 'visible';
    colonVisible = true;
  }
}

// Retorna os segundos configurados pelo usuário para o modo atual
function secondsFor(currentMode) {
  if (currentMode === 'work')  return getUserPomoTime() * 60;
  if (currentMode === 'short') return getUserShortBreak() * 60;
  return getUserLongBreak() * 60; // 'long'
}

// Define isPause a partir do modo
function syncPauseFlag() {
  isPause = (mode !== 'work');
}

// Avança para o próximo modo com a sua lógica de ciclos curtos/longos
function goToNextMode() {
  if (mode === 'work') {
    // Ex.: 4 curtas antes da longa. Ajuste o número se o seu app usar outro.
    if (completedShortBreaks < 3) {
      mode = 'short';
      completedShortBreaks += 1;
    } else {
      mode = 'long';
      completedShortBreaks = 0;
      completedLongBreaks += 1;
    }
  } else {
    // Voltou de uma pausa (curta ou longa) para trabalho
    mode = 'work';
    completedPomodoros += 1;
  }
  syncPauseFlag();
}

// Inicia/retoma a sessão atual.
// fresh: true  => sessão nova (aplica os valores do usuário)
// fresh: false => retomada (NÃO reseta; continua de remainingSeconds)
function startSession({ fresh }) {
  // Garante que nunca exista mais de um intervalo ativo
  clearInterval(tickId);

  if (fresh || remainingSeconds == null) {
    remainingSeconds = secondsFor(mode);      // aplica input do usuário só em inícios novos
    updateTimerDisplay(remainingSeconds);     // alinha UI com a fonte de verdade
  }

  isRunning = true;

  tickId = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      updateTimerDisplay(remainingSeconds);
    } else {
      // terminou a sessão atual
      clearInterval(tickId);
      isRunning = false;

      // decide próximo modo e inicia nova sessão já com o input atual
      goToNextMode();
      startSession({ fresh: true });
    }
  }, 1000);
}

// Pausa sem criar "timer fantasma"
function pauseSession() {
  clearInterval(tickId);
  tickId = null;
  isRunning = false;
}

// === HANDLER DO PLAY/PAUSE (usa as mesmas classes/atributos que você já tem) ===
playBtn.addEventListener('click', () => {
  const isPlayState = playBtn.classList.contains('play-controls__button--play');

  if (isPlayState) {
    // PLAY
    playBtn.classList.replace('play-controls__button--play', 'play-controls__button--pause');
    playBtn.setAttribute('aria-pressed', 'true');

    stopBtn.style.display = 'none';
    skipBtn.style.display = 'none';

    colonInterval = setInterval(displayColon, 1000);

    // Se é a primeira vez (remainingSeconds == null), começa "fresh"
    // Se estava pausado, retoma SEM fresh (não reseta)
    const shouldStartFresh = (remainingSeconds == null);
    startSession({ fresh: shouldStartFresh });

  } else {
    // PAUSE
    playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
    playBtn.setAttribute('aria-pressed', 'false');

    pauseSession();

    clearInterval(colonInterval);
    colon.style.visibility = 'visible';

    stopBtn.style.display = 'inline-flex';
    skipBtn.style.display = 'inline-flex';
  }
});

// === OPCIONAL: inicializa o display com o valor atual do usuário (work) na abertura ===
(function initFirstPaint() {
  mode = 'work';
  syncPauseFlag();
  remainingSeconds = secondsFor(mode);
  updateTimerDisplay(remainingSeconds);
})();
