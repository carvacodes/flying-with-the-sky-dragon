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

const _w = window.innerWidth;
const _h = window.innerHeight

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
window.addEventListener('orientationchange', init);
window.addEventListener('click', () => {
  if (pageContainer.classList.contains('normal-ending')) {
    pageContainer.classList.remove('normal-ending');
    pageContainer.classList.add('good-ending');
  } else if (pageContainer.classList.contains('good-ending')) {
    pageContainer.classList.remove('good-ending');
    pageContainer.classList.add('best-ending');
  } else if (pageContainer.classList.contains('best-ending')) {
    pageContainer.classList.remove('best-ending');
    pageContainer.classList.add('normal-ending');
  }
})


function init()  {
  /* initialize the sky (background) canvas */
  sizeCanvas(skyCanvas, _w, _h);
  
  for (var i = 1; i < cSet.length; i++) {
    cSet[i].width = _w * 2;
    cSet[i].height = _h;
  }

  flyingEls = document.querySelectorAll('.flying');
  
  renderScene();
}

function sizeCanvas(c, x, y) {
  c.width = x;
  c.height = y;
}

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
  
  /* render clouds */
  renderCloudSet(_h * 0.5, ctx_fg4, colors.clouds4, 10, 20, 100);
  renderCloudSet(_h * 0.65, ctx_fg3, colors.clouds3, 10, 20, 100);
  renderCloudSet(_h * 0.8, ctx_fg2, colors.clouds2, 10, 20, 100);
  renderCloudSet(_h * 0.95, ctx_fg1, colors.clouds1, 10, 20, 100);
}

function distToPoint(x1, y1, x2, y2) {
  let a = (x2 - x1) * (x2 - x1);
  let b = (y2 - y1) * (y2 - y1);
  return Math.sqrt(a + b);
}

function renderCloudSet(cloudSurface, ctx, color, minM, maxM, yVariance) {
  ctx.fillStyle = colors;
  ctx.fillRect(0, cloudSurface, _w, _h - cloudSurface);
  
  let mX = 0;
  let mY = cloudSurface - Math.round(Math.random() * yVariance);
  let currentM = Math.round(Math.random() * maxM) + minM;
  while (mX < _w) {
    createM(ctx, color, mX, mY, currentM, cloudSurface);
    //mY = cloudSurface - Math.round(Math.random() * yVariance);
    if (mY + currentM > cloudSurface) {
      mY -= currentM;
    } else if (mY - currentM < cloudSurface - yVariance) {
      mY += currentM;
    } else {
      mY = Math.random() < 0.5 ? mY - currentM : mY + currentM;
    }
    currentM = Math.round(Math.random() * maxM) + minM;
    mX += currentM * 0.6;
  }
}

function createM(ctx, color, x, y, r, cloudSurface) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + _w, y, r, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillRect(x - r, y, r * 2, _h);
  ctx.fillRect((x + _w) - r, y, r * 2, _h);
}