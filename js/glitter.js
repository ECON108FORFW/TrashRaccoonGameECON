import { pick } from './utils.js';
const STAR_CHARS=['✦','✧','★','⋆'];
export function makeStar(cls,min,range){
  const s=document.createElement('span'); s.className=cls; s.textContent=pick(STAR_CHARS);
  s.style.left=(2+Math.random()*96)+'%'; s.style.top=(4+Math.random()*92)+'%';
  s.style.fontSize=(min+Math.random()*range)+'px'; s.style.setProperty('--speed',(.45+Math.random()*1.3)+'s');
  s.style.setProperty('--opacity',(.4+Math.random()*.55).toFixed(2)); s.style.setProperty('--rot',Math.floor(Math.random()*360)+'deg');
  s.style.setProperty('--scale',(.7+Math.random()*.9).toFixed(2)); return s;
}
export function addBubbleStars(el,n){ if(!el)return; el.querySelectorAll(':scope > .bubble-star').forEach(s=>s.remove()); for(let i=0;i<n;i++)el.appendChild(makeStar('bubble-star',7,9)); }
export function scatterBackgroundStars(){
  document.querySelectorAll('.pink-star').forEach(n=>n.remove());
  const w=innerWidth,h=innerHeight,n=Math.min(160,Math.floor(w*h/9000));
  const ui=document.querySelector('.wrap')?.getBoundingClientRect(); if(!ui)return;
  for(let i=0,made=0;made<n&&i<n*10;i++){const x=Math.random()*w,y=Math.random()*h;if(x>ui.left-6&&x<ui.right+6)continue;const s=makeStar('pink-star',8,14);s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);made++;}
}
export function initGlitter(){document.querySelectorAll('.title-bubble,.creator-bubble,.panel').forEach(el=>addBubbleStars(el,12));scatterBackgroundStars();let t;addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(scatterBackgroundStars,200);});}
