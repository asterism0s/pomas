const modal = document.getElementById('settings-modal');
const btn = document.getElementById('settings-btn');

//Capturar o elemento <select>
const selectBox = document.querySelector('#pomodoro-time');



//adicionar um eventlistener para capturar o valor quando ele mudar

selectBox.addEventListener('change', () => {
    const selectedValue = selectBox.value;
    console.log(selectedValue);
} )




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