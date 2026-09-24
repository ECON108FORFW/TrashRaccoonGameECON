export function drawTrashBag(ctx,o,hover){
  const{x,y,w,h}=o,body=hover?'#171b29':'#111522',highlight=hover?'rgba(83,96,130,.40)':'rgba(70,82,112,.26)',baseShadow=hover?'#0a0d16':'#090c14';
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(x+w*.23,y+h*.88);ctx.quadraticCurveTo(x+w*.08,y+h*.58,x+w*.18,y+h*.30);ctx.quadraticCurveTo(x+w*.30,y+h*.12,x+w*.44,y+h*.10);ctx.quadraticCurveTo(x+w*.48,y,x+w*.52,y);ctx.quadraticCurveTo(x+w*.56,y,x+w*.60,y+h*.10);ctx.quadraticCurveTo(x+w*.74,y+h*.12,x+w*.84,y+h*.30);ctx.quadraticCurveTo(x+w*.96,y+h*.58,x+w*.81,y+h*.88);ctx.quadraticCurveTo(x+w*.56,y+h*.97,x+w*.23,y+h*.88);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(x+w*.5,y+h*.74,w*.30,h*.18,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(x+w*.46,y+h*.17);ctx.lineTo(x+w*.42,y+h*.01);ctx.lineTo(x+w*.49,y+h*.07);ctx.lineTo(x+w*.51,y+h*.19);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x+w*.54,y+h*.17);ctx.lineTo(x+w*.58,y+h*.01);ctx.lineTo(x+w*.65,y+h*.08);ctx.lineTo(x+w*.58,y+h*.20);ctx.closePath();ctx.fill();
  ctx.fillStyle=baseShadow;ctx.fillRect(x+w*.45,y+h*.15,w*.12,h*.05);ctx.strokeStyle=highlight;ctx.lineWidth=Math.max(3,w*.03);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+w*.36,y+h*.28);ctx.quadraticCurveTo(x+w*.47,y+h*.50,x+w*.40,y+h*.77);ctx.moveTo(x+w*.61,y+h*.30);ctx.quadraticCurveTo(x+w*.69,y+h*.51,x+w*.64,y+h*.73);ctx.stroke();ctx.lineCap='butt';
}
export function drawBox(ctx,o,hover){
  const{x,y,w,h}=o,main=hover?'#b2834f':'#a57a48',outline=hover?'#7d5a34':'#72522f',flap=hover?'#bb8b57':'#af824f';
  ctx.fillStyle=main;ctx.fillRect(x,y+h*.16,w,h*.84);ctx.fillStyle=flap;ctx.beginPath();ctx.moveTo(x,y+h*.16);ctx.lineTo(x+w*.18,y);ctx.lineTo(x+w*.82,y);ctx.lineTo(x+w,y+h*.16);ctx.closePath();ctx.fill();
  ctx.fillStyle=hover?'#8f673d':'#825d37';ctx.beginPath();ctx.moveTo(x+w*.18,y);ctx.lineTo(x+w*.50,y+h*.11);ctx.lineTo(x+w*.05,y+h*.16);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(x+w*.82,y);ctx.lineTo(x+w*.50,y+h*.11);ctx.lineTo(x+w*.95,y+h*.16);ctx.closePath();ctx.fill();
  ctx.fillStyle='#cdb77c';ctx.fillRect(x+w*.46,y+h*.08,w*.08,h*.92);ctx.fillStyle='#c7b089';ctx.fillRect(x+w*.12,y+h*.47,w*.18,h*.12);ctx.strokeStyle=outline;ctx.lineWidth=3;ctx.strokeRect(x,y+h*.16,w,h*.84);ctx.beginPath();ctx.moveTo(x,y+h*.16);ctx.lineTo(x+w*.18,y);ctx.lineTo(x+w*.82,y);ctx.lineTo(x+w,y+h*.16);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w*.20,y+h*.16);ctx.lineTo(x+w*.20,y+h);ctx.moveTo(x+w*.80,y+h*.16);ctx.lineTo(x+w*.80,y+h);ctx.stroke();
}
export function drawCan(ctx,o,hover){
  const{x,y,w,h}=o,body=hover?'#adb7bc':'#9ba6ab',lid=hover?'#bfc7cb':'#aeb7bc',shade=hover?'#8a9498':'#7d888d',line=hover?'#7a8488':'#6e787d';
  ctx.fillStyle=body;ctx.fillRect(x+w*.08,y+h*.14,w*.84,h*.72);ctx.fillStyle=lid;ctx.beginPath();ctx.ellipse(x+w*.5,y+h*.14,w*.42,h*.10,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=shade;ctx.beginPath();ctx.ellipse(x+w*.5,y+h*.86,w*.40,h*.08,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=line;ctx.fillRect(x+w*.42,y+h*.02,w*.16,h*.05);ctx.strokeStyle=line;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+w*.08,y+h*.33);ctx.quadraticCurveTo(x-w*.08,y+h*.38,x+w*.08,y+h*.46);ctx.moveTo(x+w*.92,y+h*.33);ctx.quadraticCurveTo(x+w*1.08,y+h*.38,x+w*.92,y+h*.46);ctx.stroke();ctx.lineWidth=2;for(let i=0;i<4;i++){const rx=x+w*(.24+i*.16);ctx.beginPath();ctx.moveTo(rx,y+h*.22);ctx.lineTo(rx,y+h*.79);ctx.stroke();}
}
