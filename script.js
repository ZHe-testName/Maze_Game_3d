'use strict';

//Indicators of press/letting go move buttons
let pressForward = false,
    pressBack = false,
    pressLeft = false,
    pressRight = false,
    pressUp = false;

let onGround = true;

//Pressing to move buttons event listener
document.addEventListener('keydown', event => {
    switch(event.key){
        case 'a':
            pressLeft = true;
            break;
        case 's':
            pressBack = true;
            break;
        case 'd':
            pressRight = true;
            break;
        case 'w':{
            pressForward = true;
            break;
        }
    }

    if(onGround && (event.keyCode === 32)){
        pressUp = true;
    }
});

//Letting go move buttons event listener
document.addEventListener('keyup', event => {
    switch(event.key){
        case 'a':
            pressLeft = false;
            break;
        case 's':
            pressBack = false;
            break;
        case 'd':
            pressRight = false;
            break;
        case 'w':{
            pressForward = false;
            break;
        }
    }

    if(event.keyCode === 32){
        pressUp = false
    }
});