const colon = document.querySelector('.timer-card__separator--colon');
let colonVisible = true;

export function displayColon() {

    if (colonVisible) {
        colon.style.visibility = 'hidden';
        colonVisible = false; 
    } else {
        colon.style.visibility = 'visible';
        colonVisible = true; 
    }

}