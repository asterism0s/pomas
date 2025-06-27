const modal = document.getElementById('settings-modal');
const btn = document.getElementById('settings-btn');

btn.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    btn.setAttribute (
        'aria-expanded',
        modal.classList.contains('hidden') ? 'false' : 'true'
    );
});