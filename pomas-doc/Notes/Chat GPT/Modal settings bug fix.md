[Pular para o conteúdo](https://chatgpt.com/g/g-p-681c6cafb5fc8191ad2db202ea68233c-pomas/c/6880cb23-ce6c-832d-b557-56f4b3aad4fa#main)

Ver snippet -> [[Dev/Pomas/Snippets/Modal settings bug fix|Modal settings bug fix]]
## Histórico de chats

##### Você disse:

Chat, subi nos arquivos do projeto o HTML e os arquivos JS que eu tenho até o momento. O que eu preciso é que você me ajude a resolver o bug de que, ao abrir o modal, as mudanças feitas no settings-modal não devem afetar o UI antes de apertar o botão de confirm.

Pensou por 7 segundos

###### O ChatGPT disse:

Para evitar que alterações no modal reflitam imediatamente na UI antes de confirmar, basta remover o listener de `change` que chama `updateTimer` (que mexe direto nos elementos do timer principal) e deixar que só o botão **Confirm** aplique as mudanças.

**Passos:**

1. **Comente ou remova** em `settings-modal.js` estas linhas (linhas 19–20):
    
    `//pomoTime.addEventListener('change', () => { updateTimer(pomoTime) }); // – e, se existirem, os listeners de shortBreak e longBreak também`
    
2. Remova ou transforme `updateTimer()` de modo que ele atualize **apenas um preview dentro do modal** (se você quiser mostrar um preview) — mas **não** mexa nos seletores `.timer-card__minutes–number` e `.timer-card__seconds–number`.
    
3. No handler de **Cancel**, após resetar os `<select>`, chame de volta o display original do timer, assim:
    
    `cancelBtn.addEventListener('click', () => {   modal.classList.add('hidden');   // ... seus resets de select ...   // Reverte a UI do timer ao valor em localStorage:   setRemainingTime(getUserPomoTime() * 60); });`
    
4. No handler de **Confirm**, você já faz:
    
    `setRemainingTime(selectedPomoTime * 60);`
    
    — isso vai atualizar o timer principal somente quando confirmar.
    

Com isso, enquanto o modal estiver aberto, a UI do timer só mudará de fato após clicar em **Confirm**.

O ChatGPT pode cometer erros. Considere verificar informações importantes.