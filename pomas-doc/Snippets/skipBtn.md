

old code buggy -> doesnt go 
```javascript

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
