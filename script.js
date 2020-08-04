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

//Array of rects for world 
let map = [
    [0,0,1000,0,180,0,2000,200,"#F0C0FF"],
    [0,0,-1000,0,0,0,2000,200,"#F0C0FF"],
    [1000,0,0,0,-90,0,2000,200,"#F0C0FF"],
    [-1000,0,0,0,90,0,2000,200,"#F0C0FF"],
    [0,100,0,90,0,0,2000,2000,"#666666"]
]

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

const coordsTransform = (x0, y0, z0, rxc, ryc, rzc) => {
    let x1 = x0,
        y1 = y0 * Math.cos(rxc * degree) + z0 * Math.sin(rxc * degree),
        z1 = -y0 * Math.sin(rxc * degree) + z0 * Math.cos(rxc * degree),
        
        x2 = x1 * Math.cos(ryc * degree) - z1 * Math.sin(ryc * degree),
        y2 = y1,
        z2 = x1 * Math.sin(ryc * degree) + z1 * Math.cos(ryc * degree),
        
        x3 = x2 * Math.cos(rzc * degree) + y2 * Math.sin(rzc* degree),
        y3 = -x2 * Math.sin(rzc * degree) + y2 * Math.cos(rzc * degree),
        z3 = z2;

        return [x3, y3, z3];
};

const coordsReTransform  = (x3, y3, z3, rxc, ryc, rzc) =>{
	let x2 =  x3 * Math.cos(rzc * degree) - y3 * Math.sin(rzc * degree),
	    y2 =  x3 * Math.sin(rzc * degree) + y3 * Math.cos(rzc * degree),
        z2 =  z3,
        
	    x1 =  x2 * Math.cos(ryc * degree) + z2 * Math.sin(ryc * degree),
	    y1 =  y2,
	    z1 = -x2 * Math.sin(ryc * degree) + z2 * Math.cos(ryc * degree),
        
        x0 =  x1,
	    y0 =  y1 * Math.cos(rxc * degree) - z1 * Math.sin(rxc * degree),
        z0 =  y1 * Math.sin(rxc * degree) + z1 * Math.cos(rxc * degree);
        
	    return [x0, y0, z0];
};

const createNewWorld = () => {
    map.forEach((item, index) => {
        //Creating new element of the world
        let newElement = document.createElement('div');

        newElement.className = "square";
        newElement.id = `square${index}`;
        newElement.style.width = `${item[6]}px`;
        newElement.style.height = `${item[7]}px`;
        newElement.style.background = `${item[8]}`;
        newElement.style.border = '3px solid black';

        newElement.style.transform = "translate3d(" +
        (600 - item[6]/2 + item[0]) + "px," +
        (400 - item[7]/2 + item[1]) + "px," +
        (item[2]) + "px)" +
        "rotateX(" + item[3] + "deg)" +
        "rotateY(" + item[4] + "deg)" +
        "rotateZ(" + item[5] + "deg)";

        //Incert new element into the world
        world.append(newElement);
    });
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

    //Check colizion with rect's
    for(let i = 0; i < map.length; i++){
		
		//calculate player coords in coords system of rect
		
		let x0 = (pawn.x - map[i][0]);
		let y0 = (pawn.y - map[i][1]);
        let z0 = (pawn.z - map[i][2]);
        
        if ((x0**2 + y0**2 + z0**2 + deltaX**2 + deltaY**2 + deltaZ**2) < (map[i][6]**2 + map[i][7]**2)){
		
			let x1 = x0 + deltaX;
			let y1 = y0 + deltaY;
			let z1 = z0 + deltaZ;
		
			let point0 = coordsTransform(x0, y0, z0, map[i][3], map[i][4], map[i][5]);
			let point1 = coordsTransform(x1, y1, z1, map[i][3], map[i][4], map[i][5]);
			let point2 = new Array();
		
			// Условие коллизии и действия при нем
		
			if (Math.abs(point1[0]) < (map[i][6] + 98) / 2 && Math.abs(point1[1]) < (map[i][7] + 98) / 2 && Math.abs(point1[2]) < 50){
                console.log('done');
                point1[2] = Math.sign(point0[2]) * 50;
                point2 = coordsReTransform(point1[0], point1[1], point1[2], map[i][3], map[i][4], map[i][5]);
                
				deltaX = point2[0] - x0;
				deltaY = point2[1] - y0;
				deltaZ = point2[2] - z0;
			}
			
		}
    };	
    
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
const pawn = new Pawn(-900, 0, -900, 0, 0);

createNewWorld();

//Run infinity cycle for the world updating
let timer = setInterval(updeteWorld, 10);
