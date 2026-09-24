import { gameState } from '../game-state.js';
import { drawTrashBag, drawBox, drawCan } from './objects.js';

export function createSceneRenderer(canvas,{onDig,onNoDigs}){
  const ctx=canvas.getContext('2d'); let mouse={x:-100,y:-100}; let touchMode=false;
  const rectHit=o=>mouse.x>=o.x&&mouse.x<=o.x+o.w&&mouse.y>=o.y&&mouse.y<=o.y+o.h;
  function drawCircle(x,y,r,fill,stroke=null,lw=1){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}}
  function variant(){return Math.min(2,Math.max(0,gameState.session?.round||0));}

  function drawStars(points,color='rgba(255,255,255,.8)'){
    points.forEach(([x,y,r=1.6])=>drawCircle(x,y,r,color));
  }

  function drawSky(v){
    if(v===0){
      const g=ctx.createLinearGradient(0,0,0,215);
      g.addColorStop(0,'#1c1b2e'); g.addColorStop(.7,'#3b3346'); g.addColorStop(1,'#6b5a63');
      ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,215);
      drawCircle(820,60,26,'#f6ecd0');
      drawCircle(810,54,5,'rgba(0,0,0,.08)'); drawCircle(828,70,4,'rgba(0,0,0,.08)');
      drawStars([[120,58,2],[184,92,1.5],[532,48,1.5],[340,78,1.4],[700,110,1.4]]);
    } else if(v===1){
      const g=ctx.createLinearGradient(0,0,0,215);
      g.addColorStop(0,'#04131f'); g.addColorStop(.48,'#0b3144'); g.addColorStop(1,'#2a5662');
      ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,215);
      drawCircle(150,74,40,'#d8f0ff');
      drawCircle(136,68,9,'rgba(0,0,0,.08)'); drawCircle(165,90,6,'rgba(0,0,0,.08)');
      const ag=ctx.createLinearGradient(0,20,900,180);
      ag.addColorStop(0,'rgba(90,255,220,.00)');
      ag.addColorStop(.25,'rgba(90,255,220,.12)');
      ag.addColorStop(.55,'rgba(120,255,200,.18)');
      ag.addColorStop(1,'rgba(90,255,220,.00)');
      ctx.fillStyle=ag;
      ctx.beginPath();
      ctx.moveTo(0,120); ctx.quadraticCurveTo(170,40,320,88); ctx.quadraticCurveTo(490,132,680,64); ctx.quadraticCurveTo(790,28,900,78); ctx.lineTo(900,0); ctx.lineTo(0,0); ctx.closePath(); ctx.fill();
      drawStars([[80,22,1.8],[130,24,1.4],[260,42,1.3],[410,36,2],[500,58,1.4],[610,28,1.6],[736,46,1.8],[848,32,1.4]],'rgba(215,250,255,.88)');
    } else {
      const g=ctx.createLinearGradient(0,0,0,215);
      g.addColorStop(0,'#2a0612'); g.addColorStop(.45,'#5d1b20'); g.addColorStop(1,'#b14e2f');
      ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,215);
      drawCircle(782,52,54,'#ffd38a');
      drawCircle(760,46,10,'rgba(0,0,0,.10)'); drawCircle(805,73,8,'rgba(0,0,0,.08)');
      ctx.fillStyle='rgba(60,10,18,.28)';
      [[40,34,240,28],[300,54,280,34],[580,24,250,26],[140,108,320,30],[480,92,360,36]].forEach(([x,y,w,h])=>{
        ctx.beginPath();
        ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);
        ctx.fill();
      });
      drawStars([[100,40,1.4],[220,22,1.6],[330,84,1.4],[470,30,1.5],[615,70,1.3]],'rgba(255,230,200,.6)');
    }

    const S=gameState.session;
    if(S?.fr){
      const used=1-S.digs/S.fr.digs;
      const color = v===2 ? '255,150,90' : v===1 ? '110,220,240' : '255,160,120';
      const sg=ctx.createLinearGradient(0,215,0,50);
      sg.addColorStop(0,`rgba(${color},${.55*used})`);
      sg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=sg; ctx.fillRect(0,0,canvas.width,215);
    }
  }

  function drawBuildings(v){
    if(v===0){
      const sets=[[0,170,95,45],[130,140,80,75],[245,175,135,40],[420,145,95,70],[560,182,115,33],[710,150,70,65],[810,130,90,85]];
      sets.forEach(([x,y,w,h],i)=>{ctx.fillStyle='#3f3a40';ctx.fillRect(x,y,w,h);ctx.fillStyle='#d7bf76';const cols=Math.max(2,Math.floor(w/24)),rows=Math.max(1,Math.floor(h/20));for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if((r+c+i)%2===0){const wx=x+8+c*18,wy=y+8+r*16;if(wx+8<x+w&&wy+8<y+h)ctx.fillRect(wx,wy,8,8);}});
      return;
    }

    if(v===1){
      ctx.fillStyle='#17343e';
      [[0,162,130,52],[148,152,108,62],[280,168,160,46],[470,144,118,70],[620,158,112,56],[760,148,140,66]].forEach(([x,y,w,h])=>ctx.fillRect(x,y,w,h));
      ctx.fillStyle='#0f2a33';
      [[280,168,160],[620,158,112]].forEach(([x,y,w])=>{
        ctx.beginPath(); ctx.moveTo(x,y); for(let i=0;i<4;i++){ctx.lineTo(x+w*(i+.125)/4,y-14); ctx.lineTo(x+w*(i+.25)/4,y);} ctx.lineTo(x+w,y+46); ctx.lineTo(x,y+46); ctx.closePath(); ctx.fill();
      });
      [[94,112,18,50],[520,100,20,70],[548,116,15,54]].forEach(([x,y,w,h])=>{ctx.fillStyle='#10262d';ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(180,220,230,.12)';ctx.fillRect(x+3,y-14,w-6,14);});
      ctx.strokeStyle='#10262d'; ctx.lineWidth=6;
      ctx.beginPath(); ctx.moveTo(816,148); ctx.lineTo(800,200); ctx.moveTo(850,148); ctx.lineTo(866,200); ctx.moveTo(833,150); ctx.lineTo(833,208); ctx.stroke();
      ctx.fillStyle='#163844'; ctx.beginPath(); ctx.ellipse(833,138,34,14,0,0,Math.PI*2); ctx.fillRect(799,138,68,24); ctx.fillStyle='#0f2a33'; ctx.beginPath(); ctx.ellipse(833,162,34,12,0,0,Math.PI); ctx.fill();
      ctx.fillStyle='#8cf3ff';
      [[0,162,130,52],[148,152,108,62],[470,144,118,70],[620,158,112,56],[760,148,140,66]].forEach(([x,y,w,h],i)=>{for(let r=0;r<Math.max(1,Math.floor(h/18));r++)for(let c=0;c<Math.max(2,Math.floor(w/22));c++)if((r+c+i)%2===0){const wx=x+8+c*18, wy=y+8+r*14; if(wx+8<x+w&&wy+7<y+h)ctx.fillRect(wx,wy,8,7);}});
      return;
    }

    ctx.fillStyle='#4a2020';
    [[0,176,88,38],[104,126,120,88],[242,166,104,48],[364,142,82,72],[468,170,116,44],[606,132,92,82],[720,156,88,58],[824,118,76,96]].forEach(([x,y,w,h])=>ctx.fillRect(x,y,w,h));
    ctx.strokeStyle='#311416'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(318,138); ctx.lineTo(306,200); ctx.moveTo(390,138); ctx.lineTo(402,200); ctx.stroke();
    ctx.fillStyle='#592527'; ctx.fillRect(302,114,104,28); ctx.fillStyle='#eab889'; ctx.fillRect(314,122,80,12);
    ctx.strokeStyle='#311416'; ctx.lineWidth=6;
    ctx.beginPath(); ctx.moveTo(680,82); ctx.lineTo(680,180); ctx.lineTo(774,128); ctx.stroke();
    ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(736,149); ctx.lineTo(736,190); ctx.lineTo(722,205); ctx.stroke();
    ctx.fillStyle='#ffb16e';
    [[104,126,120,88],[364,142,82,72],[606,132,92,82],[824,118,76,96]].forEach(([x,y,w,h],i)=>{for(let r=0;r<Math.max(2,Math.floor(h/18));r++)for(let c=0;c<Math.max(2,Math.floor(w/20));c++)if((r*2+c+i)%3!==1){const wx=x+7+c*16, wy=y+8+r*14; if(wx+7<x+w&&wy+7<y+h)ctx.fillRect(wx,wy,7,7);}});
  }

  function drawFence(v=0){
    const topY=v===2?218:225, bottomY=v===2?324:330;
    ctx.strokeStyle=v===2?'#7d6d64':'#5b6266';ctx.lineWidth=2;
    for(let x=0;x<=canvas.width;x+=34){ctx.beginPath();ctx.moveTo(x,topY);ctx.lineTo(x,bottomY);ctx.stroke();}
    ctx.strokeStyle=v===2?'#8a776c':'#6d7478';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,topY+4);ctx.lineTo(canvas.width,topY+4);ctx.stroke();
    ctx.strokeStyle=v===2?'rgba(240,190,170,.25)':'rgba(185,195,198,.3)';ctx.lineWidth=1;
    for(let x=-120;x<canvas.width+120;x+=20){ctx.beginPath();ctx.moveTo(x,bottomY);ctx.lineTo(x+120,topY);ctx.stroke();ctx.beginPath();ctx.moveTo(x,topY);ctx.lineTo(x+120,bottomY);ctx.stroke();}
  }

  function drawStreetlight(x,baseY,h,color='#44484c',glow='rgba(255,225,150,.2)'){
    ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,baseY);ctx.lineTo(x+6,baseY-h);ctx.stroke();ctx.beginPath();ctx.moveTo(x+6,baseY-h);ctx.lineTo(x+28,baseY-h-10);ctx.stroke();ctx.fillStyle='#5e6266';ctx.beginPath();ctx.moveTo(x+24,baseY-h-8);ctx.lineTo(x+38,baseY-h-10);ctx.lineTo(x+34,baseY-h+4);ctx.lineTo(x+22,baseY-h+1);ctx.closePath();ctx.fill();ctx.fillStyle=glow;ctx.beginPath();ctx.moveTo(x+18,baseY-h+4);ctx.lineTo(x+52,baseY-h+4);ctx.lineTo(x+60,baseY-h+70);ctx.lineTo(x+2,baseY-h+70);ctx.closePath();ctx.fill();
  }

  function drawPile(x,y,w,h,color='#5a5347'){
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y+h);ctx.quadraticCurveTo(x+w*.15,y+h*.18,x+w*.45,y+h*.32);ctx.quadraticCurveTo(x+w*.74,y-h*.10,x+w,y+h);ctx.closePath();ctx.fill();
    drawCircle(x+w*.18,y+h*.74,12,'#242424','#111',2);drawCircle(x+w*.18,y+h*.74,5,'#666');drawCircle(x+w*.72,y+h*.66,10,'#242424','#111',2);drawCircle(x+w*.72,y+h*.66,4,'#666');ctx.fillStyle='#7a8588';ctx.fillRect(x+w*.30,y+h*.68,24,9);ctx.fillRect(x+w*.58,y+h*.44,30,10);ctx.fillStyle='#8b6741';ctx.fillRect(x+w*.46,y+h*.72,28,18);
  }

  function drawForegroundTexture(v){
    const xo=[0,36,-18][v], yo=[0,12,22][v];
    const palette=v===2?['#5a3d30','#49332a','#a56547','#8a7b72']:v===1?['#3a474d','#24383f','#6f6c59','#708489']:['#4a443d','#282828','#8d6843','#7a8488'];
    for(let i=0;i<28;i++){
      const x=18+((i*57+xo)%860), y=355+((i*47+yo)%160);
      if(i%4===0){ctx.fillStyle=palette[0];ctx.fillRect(x,y,16,7);ctx.fillRect(x+5,y-4,7,16);}else if(i%4===1){drawCircle(x+8,y+8,10,palette[1],'#111',2);drawCircle(x+8,y+8,4,'#5a5a5a');}else if(i%4===2){ctx.fillStyle=palette[2];ctx.fillRect(x,y,22,8);}else{ctx.fillStyle=palette[3];ctx.fillRect(x,y,14,10);}
    }
    ctx.strokeStyle=v===2?'#7a5444':v===1?'#46616c':'#635440';ctx.lineWidth=3;
    for(let y=360+v*6;y<545;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y+12);ctx.stroke();}
  }

  function drawBackground(){
    const v=variant();
    drawSky(v); drawBuildings(v);
    if(v===0){ [[90,285,92],[350,280,106],[640,288,98]].forEach(a=>drawStreetlight(...a)); }
    if(v===1){ [[70,290,80],[270,286,118],[520,284,92],[790,286,110]].forEach(a=>drawStreetlight(...a,'#395a66','rgba(120,245,255,.18)')); }
    if(v===2){ [[126,288,94],[450,282,124],[784,288,94]].forEach(a=>drawStreetlight(...a,'#60443d','rgba(255,175,120,.18)')); }
    drawFence(v);
    ctx.fillStyle=['#71624f','#45525a','#6d4e42'][v]; ctx.fillRect(0,215,canvas.width,335);
    const piles=[
      [[70,300,200,92],[285,282,230,104],[560,296,235,96]],
      [[18,300,280,102],[330,272,170,120],[560,286,260,108]],
      [[80,312,150,74],[258,264,318,132],[610,304,206,88]]
    ][v];
    const pileColor=['#5a5347','#465056','#6c4c40'][v];
    piles.forEach(a=>drawPile(...a,pileColor));
    drawForegroundTexture(v);
  }

  function drawTiles(now){const S=gameState.session;if(!S)return;S.tiles.forEach(t=>{const hover=!touchMode&&!t.open&&!gameState.overlayOpen&&S.digs>0&&rectHit(t);ctx.save();if(t.open)ctx.globalAlpha=.52;if(t.t==='bag')drawTrashBag(ctx,t,hover);else if(t.t==='box')drawBox(ctx,t,hover);else drawCan(ctx,t,hover);ctx.restore();if(hover){ctx.strokeStyle='#ffb6d9';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(t.x-5,t.y-5,t.w+10,t.h+10);ctx.setLineDash([]);}if(!t.open&&!gameState.overlayOpen&&S.digs>0){const tw=(Math.sin(now/400+t.x)+1)/2;ctx.fillStyle=`rgba(255,182,217,${.35+tw*.5})`;ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText('✦',t.x+t.w*.8,t.y+8);}});}
  function drawMouse(){if(touchMode||mouse.x<0)return;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(mouse.x,mouse.y,8,0,Math.PI*2);ctx.stroke();}
  function draw(now){ctx.clearRect(0,0,canvas.width,canvas.height);drawBackground();drawTiles(now);drawMouse();requestAnimationFrame(draw);}
  function updateMouse(e){const r=canvas.getBoundingClientRect();mouse.x=(e.clientX-r.left)*(canvas.width/r.width);mouse.y=(e.clientY-r.top)*(canvas.height/r.height);}
  canvas.addEventListener('pointermove',e=>{touchMode=e.pointerType==='touch';updateMouse(e);});canvas.addEventListener('pointerleave',()=>mouse={x:-100,y:-100});canvas.addEventListener('pointerdown',e=>{touchMode=e.pointerType==='touch';updateMouse(e);});canvas.addEventListener('click',e=>{const S=gameState.session;if(!S)return;updateMouse(e);const r=canvas.getBoundingClientRect();const pad=touchMode?Math.max(18,24*(canvas.width/r.width)):0;const hit=[...S.tiles].reverse().find(t=>!t.open&&mouse.x>=t.x-pad&&mouse.x<=t.x+t.w+pad&&mouse.y>=t.y-pad&&mouse.y<=t.y+t.h+pad);if(hit)onDig(hit);else if(S.digs===0)onNoDigs?.();});
  return {start(){requestAnimationFrame(draw);},getContext:()=>ctx};
}
