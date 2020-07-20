'use strict';

const world = document.getElementById('world'),
    container = document.getElementById('container');

//World constants
const pi = 3.141592,
    degree = pi / 180;

//Indicators of press/letting go move buttons
let pressForward = 0,
    pressBack = 0,
    pressLeft = 0,
    pressRight = 0,
    pressUp = 0;

//mouse move variables
let mouseX = 0,
    mouseY = 0;

//Mouse click lock variable
let lock = false;

let onGround = true;

//Walking person object(player)

//x, y, z - coordinates of player at start
//rx, ry - rotation angles of the player about x & y axis
//when we move the Pawn by the world, words coordinates
//will not to be change.
//But Pawn coords will be change about the world

//Relativety the player of game Pawn is stabil
//but world is change constantly
class Pawn{
    constructor(x, y, z, rx, ry){
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = rx;
        this.ry = ry;
    }
};

const updeteWorld = () => {
    //Calculate offset
    let deltaX = (pressRight - pressLeft) * Math.cos(pawn.ry * degree) - 
        (pressForward - pressBack) * Math.sin(pawn.ry * degree);

    let deltaZ = -(pressForward - pressBack) * Math.cos(pawn.ry * degree) -
    (pressRight - pressLeft) * Math.sin(pawn.ry * degree); 

    let deltaY = -pressUp;
    let deltaRx = mouseY;
    let deltaRy = -mouseX;

    //Zeroing of mouse move variables 
    //to avoid infinity adding for Pawn coords
    mouseX = mouseY = 0;

    //add offset to Pawn coords
    pawn.x += deltaX;
    pawn.y += deltaY;
    pawn.z += deltaZ;

    //If mouse cursor is lock allow mouse rotation
    if(lock){
        pawn.rx += deltaRx;
        pawn.ry += deltaRy;
    }

    //Change the world coords for display
    world.style.transform = 
        `translateZ(600px) rotateX(${-pawn.rx}deg) rotateY(${-pawn.ry}deg) translate3d(${-pawn.x}px, ${-pawn.y}px, ${-pawn.z}px)`;
};

//Lock mouse pointer listener
document.addEventListener('pointerlockchange', () => {
    lock = !lock;
});

//Lock the mouse click
container.addEventListener('click', () => {
    if(!lock) container.requestPointerLock();
})

//Pressing to move buttons event listener
document.addEventListener('keydown', event => {
    switch(event.key){
        case 'a':
            pressLeft = 1;
            break;
        case 's':
            pressBack = 1;
            break;
        case 'd':
            pressRight = 1;
            break;
        case 'w':{
            pressForward = 1;
            break;
        }
    }

    if(onGround && (event.keyCode === 32)){
        pressUp = 1;
    }
});

//Letting go move buttons event listener
document.addEventListener('keyup', event => {
    switch(event.key){
        case 'a':
            pressLeft = 0;
            break;
        case 's':
            pressBack = 0;
            break;
        case 'd':
            pressRight = 0;
            break;
        case 'w':{
            pressForward = 0;
            break;
        }
    }

    if(event.keyCode === 32){
        pressUp = 0;
    }

});

//Mouse move listener
document.addEventListener('mousemove', event => {
    mouseX = event.movementX;
    mouseY = event.movementY;
});

//Create the new player
const pawn = new Pawn(0, 0, 0, 0, 0);

//Run infinity cycle for th world updating
let timer = setInterval(updeteWorld, 10);
