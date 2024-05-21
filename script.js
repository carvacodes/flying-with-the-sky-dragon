let skyCanvas = document.getElementById('sky-canvas'),
    fg1 = document.getElementById('foreground1'),
    fg2 = document.getElementById('foreground2'),
    fg3 = document.getElementById('foreground3'),
    fg4 = document.getElementById('foreground4');

let ctx_sky = skyCanvas.getContext('2d'),
    ctx_fg1 = fg1.getContext('2d'),
    ctx_fg2 = fg2.getContext('2d'),
    ctx_fg3 = fg3.getContext('2d'),
    ctx_fg4 = fg4.getContext('2d');

let cSet = [
  skyCanvas,
  fg1,
  fg2,
  fg3,
  fg4
];

let ctxSet = [
    ctx_sky, 
    ctx_fg1,
    ctx_fg2,
    ctx_fg3,
    ctx_fg4
];

let _w = window.innerWidth;
let _h = window.innerHeight;

let colors = {
  sky:  '#010001',
  moon: '#fef9bc',
  clouds1: '#6897d5',
  clouds2: '#5074a3',
  clouds3: '#364d6d',
  clouds4: '#1b2637',
};

let pageContainer = document.querySelector('.page-container');

window.addEventListener('load', init);
window.addEventListener('resize', () => { init() });
window.addEventListener('click', () => {
  if (pageContainer.classList.contains('normal-ending')) {
    pageContainer.classList.remove('normal-ending');
    pageContainer.classList.add('good-ending');
    localStorage.setItem('skyDragonScene', 'good-ending');
  } else if (pageContainer.classList.contains('good-ending')) {
    pageContainer.classList.remove('good-ending');
    pageContainer.classList.add('best-ending');
    localStorage.setItem('skyDragonScene', 'best-ending');
  } else if (pageContainer.classList.contains('best-ending')) {
    pageContainer.classList.remove('best-ending');
    pageContainer.classList.add('normal-ending');
    localStorage.setItem('skyDragonScene', 'normal-ending');
  }
})


function init()  {
  // since init will get called on resize, reset width/height here
  _w = window.innerWidth;
  _h = window.innerHeight;  

  // initialize the sky (background) canvas
  sizeCanvas(skyCanvas, _w, _h);
  
  // initialize each canvas
  for (var i = 1; i < cSet.length; i++) {
    sizeCanvas(cSet[i], _w * 3, _h) // cloud canvases are set to 3x the screen width so that they can be cleanly looped
  }
  
  renderScene();
}

// helper function to get the last stored scene from local storage
function getStoredScene() {
  let scene = localStorage.getItem('skyDragonScene');
  if (scene) {
    pageContainer.classList.remove('normal-ending');
    pageContainer.classList.add(scene);
  }
}

// helper function to auto-size a canvas
function sizeCanvas(c, x, y) {
  c.width = x;
  c.height = y;
}

// render scene is only run once, on init (or orientation change). the canvas elements it draws to are then animated in CSS.
function renderScene() {
  /* render sky */
  ctx_sky.fillStyle = 'transparent';
  ctx_sky.fillRect(0, 0, _w, _h);
  
  /* render point stars */
  for (var i = 0; i < 24; i++) {
    let x = Math.round(Math.random() * _w);
    let y = Math.round(Math.random() * _h * 0.4);
    let d = distToPoint(x, y, skyCanvas.width * 0.65, skyCanvas.height * 0.15);
    let col = d < 150 ? 96 : Math.random() < 0.1 ? 100 : 255;
    ctx_sky.fillStyle = 'rgb(' + col + ','  + col + ','  + col + ')';
    ctx_sky.fillRect(x, y, 1, 1);
  }
  
  /* render bright stars */
  let s1x = Math.round(skyCanvas.width * 0.4) - 0.5;
  let s1y = Math.round(skyCanvas.height * 0.1) - 0.5;
  let s1Grad = ctx_sky.createRadialGradient(s1x, s1y, 0, s1x, s1y, 8);
  s1Grad.addColorStop(0, 'rgba(255,255,255,1)');
  s1Grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx_sky.strokeStyle = s1Grad;
  ctx_sky.beginPath();
  ctx_sky.moveTo(s1x - 4, s1y);
  ctx_sky.lineTo(s1x + 4, s1y);
  ctx_sky.stroke();
  ctx_sky.beginPath();
  ctx_sky.moveTo(s1x, s1y - 4);
  ctx_sky.lineTo(s1x, s1y + 4);
  ctx_sky.stroke();
  
  let s2x = Math.round(skyCanvas.width * 0.9) - 0.5;
  let s2y = Math.round(skyCanvas.height * 0.16) - 0.5;
  let s2Grad = ctx_sky.createRadialGradient(s2x, s2y, 0, s2x, s2y, 8);
  s2Grad.addColorStop(0, 'rgba(255,255,255,1)');
  s2Grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx_sky.strokeStyle = s2Grad;
  ctx_sky.beginPath();
  ctx_sky.moveTo(s2x - 4, s2y);
  ctx_sky.lineTo(s2x + 4, s2y);
  ctx_sky.stroke();
  ctx_sky.beginPath();
  ctx_sky.moveTo(s2x, s2y - 4);
  ctx_sky.lineTo(s2x, s2y + 4);
  ctx_sky.stroke();
  
  /* render moon */
  ctx_sky.fillStyle = colors.moon;
  ctx_sky.beginPath();
  ctx_sky.arc(skyCanvas.width * 0.65, skyCanvas.height * 0.15, 30, 0, Math.PI*2);
  ctx_sky.fill();
  
  /* render clouds using the renderCloudSet function */
  renderCloudSet(_h * 0.5, ctx_fg4, colors.clouds4, 8, 12, 100);
  renderCloudSet(_h * 0.65, ctx_fg3, colors.clouds3, 11, 22, 100);
  renderCloudSet(_h * 0.8, ctx_fg2, colors.clouds2, 14, 36, 100);
  renderCloudSet(_h, ctx_fg1, colors.clouds1, 14, 50, 100);
}

// helper function for distance calculations
function distToPoint(x1, y1, x2, y2) {
  let a = (x2 - x1) * (x2 - x1);
  let b = (y2 - y1) * (y2 - y1);
  return Math.sqrt(a + b);
}

// creates a randomized set of clouds
/*
------------
cloudSurface
a percentage of the height of the canvas, e.g.: _h * 0.95
sets the minimum possible height of a cloud bank by filling everything from this point and lower with the cloud color
------------
ctx
the canvas rendering context that will be used for drawing
------------
color
the cloud color. this color is also hue shifted via CSS filters (or turned transparent) to produce the different scene colors
------------
minM
the minimum width of a cloud mound
------------
maxM
the maximum width of a cloud mound
------------
yVariance
the maximum difference between subsequent cloud mound heights
*/
function renderCloudSet(cloudSurface, ctx, color, minM, maxM, yVariance) {
  ctx.fillStyle = colors;
  ctx.fillRect(0, cloudSurface, _w, _h - cloudSurface);
  
  let mX = 0;
  let mY = cloudSurface - Math.round(Math.random() * yVariance);
  let currentM = Math.round(Math.random() * maxM) + minM;
  while (mX < _w || mX == 0) {
    currentM = Math.round(Math.random() * maxM) + minM;
    if (mY + currentM > cloudSurface) {
      mY -= currentM;
    } else if (mY - currentM < cloudSurface - yVariance) {
      mY += currentM;
    } else {
      mY = Math.random() < 0.5 ? mY - currentM : mY + currentM;
    }
    mX += currentM * 0.6;
    createM(ctx, color, mX, mY, currentM);
  }
}

// draw clouds. individual cloud mounds are actually a rectangle with a half-circle on top
function createM(ctx, color, x, y, r) {
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + (_w * i), y, r, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillRect(x - r, y, r * 2, _h);
    ctx.fillRect((x - r) + (_w * i), y, r * 2, _h);
  }
}