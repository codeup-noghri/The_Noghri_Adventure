/*
You might be familiar with the wave equation:
  (d^2 u)/(d t^2)=a^2 (d^2 u)/(d x^2)
The acceleration of a string/membrane with respect to time is proportional to the sum of its second order
spatial derivates. This equation can be used to model everything from guitar strings, to vibrating membranes, 
sound, and even electromagnetic waves.

I learned about this equation in my college's Differential Equations class, and I decided I wanted to code it.
I used a simple approach to finding the second spatial derivates, and used a Gaussian blur to diffuse values
across the cells to prevent chaotic behavior.
*/
var diffusionRate=0.55;
var alpha=0.5;//Parameter of equation
var res=8;//Pixel size
var cells=[];
var avg=0;
//Set up canvas
var width=window.innerWidth;
var height=window.innerHeight;
var defaultFunction=noise;
var canvas=document.createElement('canvas');
document.body.appendChild(canvas);
document.body.style.overflow='hidden';
var ctx=canvas.getContext('2d');


function setupScreen()
{//Resets canvas
    width=window.innerWidth;
    height=window.innerHeight;
    canvas.width=width;
    canvas.height=height;
    canvas.style.position='absolute';
    canvas.style.top='0px';
    canvas.style.left='0px';
    canvas.style.zIndex=-1;
    canvas.backgroundColor='rgb(0,0,0)';
    cells=[];
    for(var x=0;x<width/res;x++)
    {
        cells.unshift([]);
        for(var y=0;y<height/res;y++)
        {
            cells[0].push([0,0]);
        }
    }
    setCells(defaultFunction);
}

function setCells(funct)
{//Seeds the grid with values based on a function
    for(var x=0;x<width/res;x++)
        for(var y=0;y<height/res;y++)
        {
            cells[x][y]=funct(x,y);
        }
}

function ripple(x,y)
{//In the center, has a raised region. Initial speed is set to 0.
    return [1000*Math.exp(-((x-cells.length/2)**2+(y-cells[0].length/2)**2)/10),0];
}
function standing(x,y)
{//Creates a standing wave
    return [100*Math.sin(8*Math.PI*x/cells.length),10*Math.cos(8*Math.PI*y/cells[0].length)];
}
function travelling(x,y)
{//Creates a trvelling wave
    return [100*(Math.sin(8*Math.PI*x/cells.length)+Math.sin(4*Math.PI*y/cells[0].length)),
        5*(Math.cos(8*Math.PI*x/cells.length)+Math.cos(4*Math.PI*y/cells[0].length))];
}
function noise()
{//Creates a lava lamp
    return [0,100*(2*Math.random()-1)];
}

function draw()
{//Draws the cells
    for(var x=0;x<width/res;x++)
        for(var y=0;y<height/res;y++)
        {
            var c=cells[x][y];
            c[0]-=avg;//Adjust cells so average value is always zero
            var shade=Math.floor(50+c[0]/4);
            var hue=Math.floor(360*Math.atan(c[0]/100,c[1]/5)/2/Math.PI);
            ctx.fillStyle=`hsl(${hue},${50}%,${shade}%)`;
            ctx.fillRect(x*res,y*res,res,res);
        }
    avg=0;
}

function wave()
{//Iterates the CA
    avg=0;//Used to find average value in order to prevet everything from going white/black
    //For bounding coordinates
    function xLoop(x){return (x+cells.length)%(cells.length)};
    function yLoop(y){return (y+cells[0].length)%(cells[0].length)};
    function diffuse(x,y)
    {//Diffuses values using a Gaussian convolution kernal
        if (diffusionRate==0)return cell[x][y];
        var h=0;
        var dhdt=0
        var div=0;
        for(var xx=-2;xx<=2;xx++)
            for(var yy=-2;yy<=2;yy++)
            {
                var gauss=Math.exp(-(1/diffusionRate)*(xx**2+yy**2));
                div+=gauss;
                h+=cells[xLoop(x+xx)][yLoop(y+yy)][0]*gauss;
                dhdt+=cells[xLoop(x+xx)][yLoop(y+yy)][1]*gauss;
            }
        return [h/div,dhdt/div];
    }
    var newCells=[];
    for(var x=0;x<width/res;x++)
    {
        newCells.push([]);
        for(var y=0;y<height/res;y++)
        {
            var c=cells[x][y];
            //Second-order spacial derivatives
            var dxx=cells[xLoop(x+1)][y][0]+cells[xLoop(x-1)][y][0]-2*cells[x][y][0];
            var dyy=cells[x][yLoop(y+1)][0]+cells[x][yLoop(y-1)][0]-2*cells[x][y][0];
            var dif=diffuse(x,y);//Diffuses values
            newCells[x].push([dif[0]+dif[1],dif[1]+(dxx+dyy)*alpha**2]);//Sets new values. first index is displacement, second is first-order temporal derivative
            avg+=newCells[x][y][0];
        }
    }
    cells=newCells;
    avg/=cells.length*cells[0].length;
}

//Just some control stuff
window.onresize=setupScreen;
document.getElementById("ripple").onclick    =function(){defaultFunction=ripple;    setCells(ripple)};
document.getElementById("standing").onclick  =function(){defaultFunction=standing;  setCells(standing)};
document.getElementById("travelling").onclick=function(){defaultFunction=travelling;setCells(travelling)};
document.getElementById("noise").onclick     =function(){defaultFunction=noise;     setCells(noise)};
document.getElementById("diffusion").onchange  =function(){diffusionRate=document.getElementById("diffusion").valueAsNumber};
document.getElementById("alpha").onchange  =function(){alpha=document.getElementById("alpha").valueAsNumber};
setupScreen();
setInterval(function(){wave();draw();},33);