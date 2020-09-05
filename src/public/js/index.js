const socket = io()
var color_v = 'black', grosor_v = 1;

function defcolor(c){
    color_v =c;
}
function defgrosor(g){
    grosor_v=g;
}

function init(){
    let mouse = {
        click: false,
        move: false,
        position: {x:0, y:0}, 
        position_prev: false,
    }

    const canvas = document.getElementById('drawing');
    const context = canvas.getContext('2d');
    const buttonClean = document.getElementById("clean"); 

    let width = window.innerWidth;
    let height = window.innerHeight;

    function clean() {
        context.fillStyle = "green";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }    

    //poner el alto y ancho segun la pantalla del dispositivo 
    canvas.width = width;
    canvas.height = height;
    
    //EVENTOS
    
    //Al darle click al botón limpiar enviamos orden de devolver la 
    //pizarra a su estado inicial.
    buttonClean.addEventListener("click", function() {
        //if () {
        socket.emit('clean', true);
        //}
    }, false);

    //evento para saber cuando se da un clic en la pantalla
    canvas.addEventListener('mousedown', (e) => {
        mouse.click = true;
    });

    //evento para saber si el usuario solto el mouse
    canvas.addEventListener('mouseup', (e) => {
        mouse.click = false;
    });

    //evento para saber si el mouse esta en movimiento es decir rayando
    canvas.addEventListener('mousemove', e => {
        mouse.position.x = e.clientX / width;
        mouse.position.y = e.clientY / height;
        mouse.move = true;
    });
    
    //Funciones del socket
    socket.on('clean', clean);

    //funcion para dibujar una linea y que se visualice en todas las 
    //pantallas
    socket.on('dibujar_linea', data => {
        let line = data.line;  
        context.beginPath();
        context.strokeStyle = line[2];
        context.lineWidth = line[3];
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
        context.closePath();
    });

function mainLoop() {
    if(mouse.click && mouse.move && mouse.position_prev) {
        socket.emit('dibujar_linea', { line: [mouse.position, 
        mouse.position_prev, color_v, grosor_v ]});
        mouse.move = false;
        
    }
    mouse.position_prev = { x: mouse.position.x, y: mouse.position.y };

    setTimeout(mainLoop, 10);
}
    
    mainLoop();
}

document.addEventListener('DOMContentLoaded', init)


