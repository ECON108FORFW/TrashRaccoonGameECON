import { gameState } from '../game-state.js';
import { drawTrashBag, drawBox, drawCan } from './objects.js';
export function createSceneRenderer(canvas,{onDig,onNoDigs}){
  const ctx=canvas.getContext('2d'); let mouse={x:-100,y:-100}; let touchMode=false;
  const rectHit=o=>mouse.x>=o.x&&mouse.x<=o.x+o.w&&mouse.y>=o.y&&mouse.y<=o.y+o.h;
  function drawCircle(x,y,r,fill,stroke=null,lw=1){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}}
  function variant(){return Math.min(2,Math.max(0,gameState.session?.round||0));}
  function drawSky(v){
    const palettes=[['#1c1b2e','#3b3346','#6b5a63'],['#18233a','#33465a','#665a67'],['#24182d','#493144','#75565d']];
    const moon=[[820,60],[760,72],[842,48]][v];
    const g=ctx.createLinearGradient(0,0,0,215);g.addColorStop(0,palettes[v][0]);g.addColorStop(.7,palettes[v][1]);g.addColorStop(1,palettes[v][2]);ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,215);
    drawCircle(moon[0],moon[1],26,'#f6ecd0');drawCircle(moon[0]-10,moon[1]-6,5,'rgba(0,0,0,.08)');drawCircle(moon[0]+8,moon[1]+10,4,'rgba(0,0,0,.08)');
    if(v===1){drawCircle(120,58,2,'rgba(255,255,255,.75)');drawCircle(184,92,1.5,'rgba(255,255,255,.65)');drawCircle(532,48,1.5,'rgba(255,255,255,.7)');}
    if(v===2){drawCircle(95,84,1.5,'rgba(255,230,210,.7)');drawCircle(270,52,2,'rgba(255,230,210,.65)');drawCircle(618,78,1.5,'rgba(255,230,210,.7)');}
    const S=gameState.session;if(S?.fr){const used=1-S.digs/S.fr.digs;const sg=ctx.createLinearGradient(0,215,0,60);sg.addColorStop(0,`rgba(255,160,120,${.55*used})`);sg.addColorStop(1,'rgba(255,160,120,0)');ctx.fillStyle=sg;ctx.fillRect(0,0,canvas.width,215);}
  }
  function drawBuildings(v){
    const sets=[
      [[0,170,95,45],[130,140,80,75],[245,175,135,40],[420,145,95,70],[560,182,115,33],[710,150,70,65],[810,130,90,85]],
      [[0,158,108,57],[148,150,72,65],[258,166,122,49],[426,134,88,81],[548,172,126,43],[706,160,86,55],[824,143,76,72]],
      [[0,178,88,37],[118,132,92,83],[252,158,126,57],[414,154,108,61],[566,168,102,47],[694,137,80,78],[802,154,98,61]]
    ];
    const fills=['#3f3a40','#39424a','#46383f'];
    sets[v].forEach(([x,y,w,h],i)=>{ctx.fillStyle=fills[v];ctx.fillRect(x,y,w,h);ctx.fillStyle=v===2?'#caa66c':'#d7bf76';const cols=Math.max(2,Math.floor(w/24)),rows=Math.max(1,Math.floor(h/20));for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if((r+c+i+v)%2===0){const wx=x+8+c*18,wy=y+8+r*16;if(wx+8<x+w&&wy+8<y+h)ctx.fillRect(wx,wy,8,8);}});
  }
  function drawFence(){const topY=225,bottomY=330;ctx.strokeStyle='#5b6266';ctx.lineWidth=2;for(let x=0;x<=canvas.width;x+=34){ctx.beginPath();ctx.moveTo(x,topY);ctx.lineTo(x,bottomY);ctx.stroke();}ctx.strokeStyle='#6d7478';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,topY+4);ctx.lineTo(canvas.width,topY+4);ctx.stroke();ctx.strokeStyle='rgba(185,195,198,.3)';ctx.lineWidth=1;for(let x=-120;x<canvas.width+120;x+=20){ctx.beginPath();ctx.moveTo(x,bottomY);ctx.lineTo(x+120,topY);ctx.stroke();ctx.beginPath();ctx.moveTo(x,topY);ctx.lineTo(x+120,bottomY);ctx.stroke();}}
  function drawStreetlight(x,baseY,h){ctx.strokeStyle='#44484c';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,baseY);ctx.lineTo(x+6,baseY-h);ctx.stroke();ctx.beginPath();ctx.moveTo(x+6,baseY-h);ctx.lineTo(x+28,baseY-h-10);ctx.stroke();ctx.fillStyle='#5e6266';ctx.beginPath();ctx.moveTo(x+24,baseY-h-8);ctx.lineTo(x+38,baseY-h-10);ctx.lineTo(x+34,baseY-h+4);ctx.lineTo(x+22,baseY-h+1);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,225,150,.2)';ctx.beginPath();ctx.moveTo(x+18,baseY-h+4);ctx.lineTo(x+52,baseY-h+4);ctx.lineTo(x+60,baseY-h+70);ctx.lineTo(x+2,baseY-h+70);ctx.closePath();ctx.fill();}
  function drawPile(x,y,w,h){ctx.fillStyle='#5a5347';ctx.beginPath();ctx.moveTo(x,y+h);ctx.quadraticCurveTo(x+w*.15,y+h*.18,x+w*.45,y+h*.32);ctx.quadraticCurveTo(x+w*.74,y-h*.10,x+w,y+h);ctx.closePath();ctx.fill();drawCircle(x+w*.18,y+h*.74,12,'#242424','#111',2);drawCircle(x+w*.18,y+h*.74,5,'#666');drawCircle(x+w*.72,y+h*.66,10,'#242424','#111',2);drawCircle(x+w*.72,y+h*.66,4,'#666');ctx.fillStyle='#7a8588';ctx.fillRect(x+w*.30,y+h*.68,24,9);ctx.fillRect(x+w*.58,y+h*.44,30,10);ctx.fillStyle='#8b6741';ctx.fillRect(x+w*.46,y+h*.72,28,18);}
  function drawForegroundTexture(v){const xo=[0,19,37][v],yo=[0,8,-6][v];for(let i=0;i<28;i++){const x=18+((i*57+xo)%860),y=355+((i*47+yo)%160);if(i%4===0){ctx.fillStyle='#4a443d';ctx.fillRect(x,y,16,7);ctx.fillRect(x+5,y-4,7,16);}else if(i%4===1){drawCircle(x+8,y+8,10,'#282828','#111',2);drawCircle(x+8,y+8,4,'#5a5a5a');}else if(i%4===2){ctx.fillStyle='#8d6843';ctx.fillRect(x,y,22,8);}else{ctx.fillStyle='#7a8488';ctx.fillRect(x,y,14,10);}}ctx.strokeStyle='#635440';ctx.lineWidth=3;for(let y=360+v*4;y<545;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y+12);ctx.stroke();}}
  function drawBackground(){
    const v=variant();drawSky(v);drawBuildings(v);
    const lights=[[[90,285,92],[350,280,106],[640,288,98]],[[120,286,98],[430,282,100],[735,290,94]],[[70,284,90],[315,281,104],[602,286,102],[820,288,88]]][v];
    lights.forEach(a=>drawStreetlight(...a));drawFence();ctx.fillStyle=['#71624f','#6d6257','#765f50'][v];ctx.fillRect(0,215,canvas.width,335);
    const piles=[[[70,300,200,92],[285,282,230,104],[560,296,235,96]],[[46,292,214,100],[306,288,212,96],[588,286,218,108]],[[82,286,188,106],[278,298,242,90],[548,284,252,110]]][v];
    piles.forEach(a=>drawPile(...a));drawForegroundTexture(v);
  }
  function drawTiles(now){const S=gameState.session;if(!S)return;S.tiles.forEach(t=>{const hover=!touchMode&&!t.open&&!gameState.overlayOpen&&S.digs>0&&rectHit(t);ctx.save();if(t.open)ctx.globalAlpha=.52;if(t.t==='bag')drawTrashBag(ctx,t,hover);else if(t.t==='box')drawBox(ctx,t,hover);else drawCan(ctx,t,hover);ctx.restore();if(hover){ctx.strokeStyle='#ffb6d9';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(t.x-5,t.y-5,t.w+10,t.h+10);ctx.setLineDash([]);}if(!t.open&&!gameState.overlayOpen&&S.digs>0){const tw=(Math.sin(now/400+t.x)+1)/2;ctx.fillStyle=`rgba(255,182,217,${.35+tw*.5})`;ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText('✦',t.x+t.w*.8,t.y+8);}});}
  function drawMouse(){if(touchMode||mouse.x<0)return;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(mouse.x,mouse.y,8,0,Math.PI*2);ctx.stroke();}
  function draw(now){ctx.clearRect(0,0,canvas.width,canvas.height);drawBackground();drawTiles(now);drawMouse();requestAnimationFrame(draw);}
  function updateMouse(e){const r=canvas.getBoundingClientRect();mouse.x=(e.clientX-r.left)*(canvas.width/r.width);mouse.y=(e.clientY-r.top)*(canvas.height/r.height);}
  canvas.addEventListener('pointermove',e=>{touchMode=e.pointerType==='touch';updateMouse(e);});canvas.addEventListener('pointerleave',()=>mouse={x:-100,y:-100});canvas.addEventListener('pointerdown',e=>{touchMode=e.pointerType==='touch';});canvas.addEventListener('click',e=>{const S=gameState.session;if(!S)return;updateMouse(e);const pad=touchMode?18:0;const hit=[...S.tiles].reverse().find(t=>!t.open&&mouse.x>=t.x-pad&&mouse.x<=t.x+t.w+pad&&mouse.y>=t.y-pad&&mouse.y<=t.y+t.h+pad);if(hit)onDig(hit);else if(S.digs===0)onNoDigs?.();});
  return {start(){requestAnimationFrame(draw);},getContext:()=>ctx};
}
