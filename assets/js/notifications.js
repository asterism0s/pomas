export function showToast(message, duration = 2000) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.textContent = message;
    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('visible'));

    setTimeout(() => {
        el.classList.remove('visible');
        el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, duration);
}