
Com definição de modo:

- Primeira interação não incrementa o short break, e entra em pausa longa após 1 pausa curta. 
- Timer acontece perfeitamente.
```javascript
function statusDisplay(mode) {

	if (mode === 'work') {
	
		updateTimerDisplay(workTime);
		isPause = false;
		setTimerStatus(true);
		completedPomodoros++;
		pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');
		console.log("em mode work",completedPomodoros);
		
		} else if (mode === 'short') {
		completedShortBreaks = 0;
		completedShortBreaks++;
		updateTimerDisplay(shortBreakTime);
		isPause = true;
		setTimerStatus(false);		
		console.log("em mode short",completedShortBreaks);
		
		} else if (mode === 'long') {
		
		updateTimerDisplay(longBreakTime);
		isPause = true;
		setTimerStatus(false);
		completedShortBreaks = 0;
		console.log("em mode long",completedShortBreaks);
	}
}


skipBtn.addEventListener('click', () => {
	  
	//interromper qualquer time ativo
	clearInterval(workTimeInterval);
	clearInterval(pauseTimeInterval);
	clearInterval(colonInterval);
	
	if (isPause === false) {
		console.log("skipando work -> entrando em pausa");
		const nextBreak = (completedShortBreaks < breakInterval) ? 'short' : 'long';
		statusDisplay(nextBreak);
	} else if (isPause === true) {
		console.log("skipando a pausa -> entrando em work");
		statusDisplay('work');
	};
	
	
	colon.style.visibility = 'visible';
	playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
	playBtn.setAttribute('aria-pressed', false);
	stopBtn.style.display = 'inline-flex';
	skipBtn.style.display = 'inline-flex';
});

```





new try

```javascript

skipBtn.addEventListener('click', () => {

	//interromper qualquer time ativo
	
	clearInterval(pauseTimeInterval);
	clearInterval(colonInterval);
	
	if(isPause === false) {
		
		clearInterval(workTimeInterval);
		completedPomodoros++;
		pomasCounter.innerHTML = String(completedPomodoros).padStart(2, '0');
		isPause = true;
		pauseTimeHandler(true);
		setTimerStatus(false);
		console.log("em work, skippando -> entrando em pausa");
	
	} else {
	
		clearInterval(pauseTimeInterval);
		countdownWorkTime(true);
		setTimerStatus(true);
		completedShortBreaks++;
		isPause = false;
		console.log("em pausa, skippando -> entrando em work");
	
	};
	
	colon.style.visibility = 'visible';
	playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
	playBtn.setAttribute('aria-pressed', false);
	stopBtn.style.display = 'inline-flex';
	skipBtn.style.display = 'inline-flex';

});

```


Código corrigido:

```javascript
skipBtn.addEventListener('click', () => {

//interromper qualquer time ativo
clearInterval(workTimeInterval);
clearInterval(pauseTimeInterval);
clearInterval(colonInterval);


	if (isPause === false) {
	
	const nextBreak = (completedShortBreaks < breakInterval) ? 'short' : 'long';
	completeWorkSession();
	statusDisplay(nextBreak);
	
	console.log("Next break is:",nextBreak);
	console.log("skipando work -> entrando em pausa");
	
	} else {
	
		if (currentMode === 'short') {
		completeShortBreak();
		console.log("skipando a pausa -> entrando em work");
		
		} else if (currentMode === 'long') {
		completeLongBreak();
		}
	
	statusDisplay('work');
	console.log("skipando a pausa -> entrando em work");
	
	}


colon.style.visibility = 'visible';
playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
playBtn.setAttribute('aria-pressed', false);
stopBtn.style.display = 'inline-flex';
skipBtn.style.display = 'inline-flex';

});

```

Corrigido com !==

```javascript
skipBtn.addEventListener('click', () => {

//interromper qualquer time ativo

clearInterval(workTimeInterval);
clearInterval(pauseTimeInterval);
clearInterval(colonInterval);

  
  

if(isPause !== true) {

	const nextBreak = (completedShortBreaks < breakInterval) ? 'short' : 'long';
	completeWorkSession();
	statusDisplay(nextBreak);
	
	console.log("Next break is:",nextBreak);
	console.log("skipando work -> entrando em pausa");
	
	}
	
	if(isPause !== false) {
	
		if (currentMode !== 'long') {
		
		completeShortBreak();
		
		console.log("skipando a pausa -> entrando em work");
		}
		
		if(currentMode !== 'short') {
		completeLongBreak();
		
		}
		
		statusDisplay('work');
		console.log("skipando a pausa -> entrando em work");
	}

colon.style.visibility = 'visible';
playBtn.classList.replace('play-controls__button--pause', 'play-controls__button--play');
playBtn.setAttribute('aria-pressed', false);
stopBtn.style.display = 'inline-flex';
skipBtn.style.display = 'inline-flex';

});
```
