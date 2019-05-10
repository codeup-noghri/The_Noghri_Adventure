
let res=64;//Pixel size
let player={
    x:0,
    y:0,
    nextX:0,
    nextY:0
};
//Set up canvas
let width=window.innerWidth;
let height=window.innerHeight;

let canvas=document.createElement('canvas');
document.body.appendChild(canvas);
canvas.id="gameBox";
let ctx=canvas.getContext('2d');

let gameMap=[];


function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}
var background = new Image();
background.src = "img/kitchen.jpg";
background.onload = function(){
    ctx.drawImage(background,0,0);
}
function setupScreen()
{//Resets canvas
    canvas.width=Math.floor(window.innerWidth/res)*res;
    canvas.height=Math.floor(window.innerHeight/res)*res;
    canvas.style.zIndex="-1";
    canvas.backgroundColor='rgb(0,0,0)';
    player={
        x:6,
        y:6,
        nextX:6,
        nextY:6
    };
    gameMap = createArray(canvas.width,canvas.height);
}


function draw()
{//Draws the cells

    ctx.fillStyle="red";
    let x = player.x;
    let y = player.y;
    ctx.fillRect(x*res,y*res,res,res);
    for(let ix=0;ix<gameMap.length;ix++){
        for (let iy=0;iy<gameMap[ix].length;iy++){
            if(gameMap[ix][iy]==="wall"){
                ctx.fillStyle="transparent";
                ctx.fillRect(ix*res,iy*res,res,res);
            }
        }
    }

}

function isNumeric(input){
    return  !isNaN(parseFloat(input));
}
function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}
function update(){
    player.x = lerp(player.x,player.nextX,0.05);
    player.y = lerp(player.y,player.nextY,0.05);

    ctx.clearRect(0,0,width,height);
    ctx.drawImage(background,-30,20,canvas.width,canvas.height);
    draw();
}
function move(direction,distance){
    if(direction ===undefined || distance ===undefined)
        return false;
    if(!isNumeric(distance))
        return false;
    distance=Number(distance);
    var moveX=false;
    var right=false;
    var down=false;
    player.x = Math.round(player.x);
    player.y = Math.round(player.y);
    switch(direction.toLowerCase()) {
        case "down":
        case "d":
            player.nextY = player.y + distance;
            moveX = false;
            down = true;
            break;
        case "up":
        case "u":
            player.nextY = player.y - distance;
            moveX = false;
            down = false;
            break;
        case "left":
        case "l":
            player.nextX = player.x - distance;
            moveX = true;
            right = false;
            break;
        case "right":
        case "r":
            player.nextX = player.x + distance;
            moveX = true;
            right = true;
            break;
        default:
            return false;
    }

    if(moveX){
        // This is a copy of the fiveTo function from our assessment
        let counter=player.x;
        let xArr=[];
        while(counter !== player.nextX){
            xArr.push(counter);
            player.nextX < player.x ? counter-- : counter++;
        }
        xArr.push(counter);
        console.log(xArr);
        if(xArr.length>0) {
            for (let i = 0; i < xArr.length; i++) {
                let offset = xArr[i];
                console.log("test");
                console.log(gameMap[offset][player.y]);
                if (gameMap[offset][player.y] === "wall") {
                    player.nextX = xArr[i - 1];
                    break;
                }
            }
        }
    }else{
        let counter=player.y;
        let yArr=[];
        while(counter !== player.nextY){
            yArr.push(counter);
            player.nextY < player.y ? counter-- : counter++;
        }
        yArr.push(counter);
        console.log(yArr);
        if(yArr.length>0) {
            for (let i = 0; i < yArr.length; i++) {
                let offset = yArr[i];
                console.log("test2");
                console.log(gameMap[player.x][offset]);
                if (gameMap[player.x][offset] === "wall") {
                    player.nextY = yArr[i - 1];
                    break;
                }
            }
        }
    }

    if (player.nextX>Math.floor(window.innerWidth/res)-1){
        player.nextX=(Math.floor(window.innerWidth/res))-1;
    }
    if (player.nextY>Math.floor(window.innerHeight/res)-1){
        player.nextY=(Math.floor(window.innerHeight/res))-1;
    }
    if (player.nextX<0){
        player.nextX=0;
    }
    if (player.nextY<0){
        player.nextY=0;
    }

    return true
}
function keypressInBox(e) {
    let code = (e.code ? e.code : e.which);
    if (code === 13) { //Enter keycode
        e.preventDefault();
        commandInput.val(commandInput.val().slice(0,64));
        let command = commandInput.val();
        commandInput.val("");
        command = command.split(" ");
        let changeScreen=false;

        if((command[0].toLowerCase() === "move" || command[0].toLowerCase() === "m") && command.length===3)
            move(command[1],command[2]);
        if(command[0].toLowerCase() === "reset" && command.length===1)
            setupScreen();

    }
}

//Just some control stuff
setupScreen();
window.onresize=setupScreen;
setInterval (update,1000/60);
let commandInput = $("#commandinput input");
commandInput.bind("keypress", {}, keypressInBox);

let kitchenMap=[
    [null,null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null,null],
    ["wall","wall","wall","wall","wall","wall","wall","wall","wall","wall"],
    [null,"wall","wall","wall","wall","wall","wall",null,null,"wall"],
    [null,"wall","wall","wall","wall","wall","wall",null,null,"wall"],
    [null,"wall","wall",null,null,null,null,null,null,"wall"],
    [null,"wall","wall",null,null,null,null,null,null,"wall"],
    [null,"wall","wall",null,null,null,null,null,null,"wall"],
    [null,"wall","wall",null,null,"wall","wall",null,null,null,"wall"],
    [null,"wall","wall",null,null,"wall","wall",null,null,null,"wall"],
    [null,"wall","wall",null,null,"wall","wall",null,null,null,"wall"],
    [null,"wall","wall",null,null,"wall","wall",null,null,"wall","wall"],
    [null,"wall",null,null,null,"wall","wall",null,null,"wall","wall"],
    [null,"wall",null,null,null,null,null,null,null,"wall","wall"],
    [null,"wall",null,null,null,null,null,null,null,"wall","wall"],
    [null,"wall",null,null,null,null,null,null,null,null],
    [null,"wall","wall","wall","wall","wall","wall",null,null,null],
    [null,"wall","wall","wall","wall","wall","wall",null,null,null],
    ["wall","wall","wall","wall","wall","wall","wall",null,null,"wall","wall"],
    ["wall","wall","wall","wall","wall","wall","wall",null,null,"wall","wall"],
];
gameMap = kitchenMap;