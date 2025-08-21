Ver explicação do chatgpt -> [[Notes/ChatGPT/Modal settings bug fix|Modal settings bug fix]]

Update em tempo real do valor selecionado na select box. Retirado porque o valor só deve mudar na UI quando apertado o botão de confirm.

``` javascript
function updateTimer(selectBox){

const selectedValue = selectBox.value;
  
timerMinutes.textContent = selectedValue;
timerSeconds.textContent = '00';

} 

pomoTime.addEventListener('change', () => { updateTimer(pomoTime) });
```