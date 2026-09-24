import { ITEMS, FACTORS, VAGUE, JUNK, FRIENDS, SPOTS } from './data.js?v=no-accessories';
import { PEBBLES } from './config.js';
import { gameState, resetGameState } from './game-state.js';
import { has, rand, pick, shuffle, fill, $, esc } from './utils.js';
import { renderUI, setStatus, configureUI } from './ui.js?v=no-accessories';
import { resetStats, resetNightClock, advanceGameTime } from './stats.js';
import { showIntro, showReveal } from './overlays.js';

export function valueOf(id,factorSet,taste){const it=ITEMS[id];let m=1;factorSet.forEach(f=>{m*=FACTORS[f].eff(it,factorSet);});if(taste&&taste.item===id)m*=taste.mult;return Math.max(0,Math.round(it.p*m));}
export function estimate(id){const S=gameState.session;return valueOf(id,S.known,null);}
export function trueValue(id){const S=gameState.session;return valueOf(id,S.factors,S.taste);}
configureUI({ estimate });

export function newGame(){
  resetGameState();
  resetStats();
  setupRound();
}

export function setupRound(){
  const S=gameState.session,fr=FRIENDS[S.round];let factors;
  if(S.round===0)factors=['cold','bare',pick(Object.keys(FACTORS).filter(f=>f!=='cold'&&f!=='bare'))];else factors=shuffle(Object.keys(FACTORS)).slice(0,3);
  const gifts=[];factors.forEach(f=>{const cands=shuffle(Object.keys(ITEMS)).filter(id=>!gifts.includes(id)&&FACTORS[f].hits.some(h=>has(ITEMS[id],h)));if(cands.length)gifts.push(cands[0]);});
  if(factors.includes('cold')&&factors.includes('bare')&&!gifts.some(g=>has(ITEMS[g],'warm')&&has(ITEMS[g],'soft'))){const ws=shuffle(['sock','yarn']).find(g=>!gifts.includes(g));if(ws)gifts.push(ws);}
  shuffle(Object.keys(ITEMS)).forEach(id=>{if(gifts.length<5&&!gifts.includes(id))gifts.push(id);});
  const tItem=pick(gifts),tMult=Math.random()<.5?rand(fr.taste[0],.88):rand(1.12,fr.taste[1]);
  const tiles=gifts.map(id=>({kind:'gift',id}));shuffle(factors).slice(0,fr.clues).forEach(f=>tiles.push({kind:'clue',f}));if(fr.vague)tiles.push({kind:'vague'});shuffle(JUNK).slice(0,fr.junk).forEach(j=>tiles.push({kind:'junk',j}));
  const placed=shuffle(tiles).map((t,i)=>Object.assign(t,SPOTS[i],{open:false,openedAt:0}));
  Object.assign(S,{fr,factors:new Set(factors),taste:{item:tItem,mult:tMult},tiles:placed,known:new Set(),found:[],digs:fr.digs,sel:null,prevEst:{},lastDelta:{},newChip:null,nightResult:null});
  setStatus(`Tap a pile of trash to dig through it. Night ${S.round+1} starts at <b>7:00 PM</b>.`,'');
  renderUI();
  showIntro();
}

export function startNextNight(){
  const S=gameState.session;
  if(!S || S.round>=2) return;
  S.round++;
  resetNightClock();
  setupRound();
}

function sunriseReached(){
  const S=gameState.session;
  if(!S || S.nightResult) return;
  setStatus('It’s <b>7:00 AM</b>. Digging is over, but you can still choose one of the gifts you found and give it before the night is resolved.','');
}

export function dig(tile){
  const S=gameState.session;if(tile.open||S.digs<=0||gameState.overlayOpen||gameState.nightEnded)return;
  tile.open=true;tile.openedAt=performance.now();S.digs--;
  const fr=S.fr,X=fr.short||fr.name;S.lastDelta={};S.newChip=null;let msg='',cls='';
  if(tile.kind==='gift'){const it=ITEMS[tile.id];S.found.push(tile.id);msg=`${it.e} You found ${/^[aeiou]/i.test(it.n)?'an':'a'} <span class="found-name">${it.n.toLowerCase()}</span>. Grabbing it would cost you <b>${it.p} pebbles</b> of effort. Would ${esc(X)} like it?`;cls='gift';}
  else if(tile.kind==='clue'){const f=FACTORS[tile.f],before={};S.found.forEach(id=>before[id]=estimate(id));S.known.add(tile.f);S.newChip=tile.f;S.found.forEach(id=>{const d=estimate(id)-before[id];if(d)S.lastDelta[id]=d;});const moved=Object.keys(S.lastDelta).length;msg=`${f.clue.e} You found <span class="found-name">${f.clue.n}</span>. ${esc(fill(f.clue.t,fr))}`+(moved?' <b>Your gift shelf just reshuffled.</b>':'');cls='clue';}
  else if(tile.kind==='vague'){msg=`${VAGUE.e} You found <span class="found-name">${VAGUE.n}</span>. ${VAGUE.t}`;cls='clue';}
  else msg=`${tile.j.e} ${tile.j.t}`;
  if(S.digs===0) msg += '<br><b>No digs left. Choose a gift from your shelf, then confirm it with the Wrap button.</b>';
  setStatus(msg,cls);
  renderUI();
  advanceGameTime(sunriseReached);
}

function reactionFor(r){if(r>=1.25)return '“Where did you even find this?! I love it!!”';if(r>=.95)return '“Oh! I really like this. Thank you!”';if(r>=.65)return '“Aw, that’s… nice. Thanks!”';if(r>=.35)return '“Oh! A… {item}. How… thoughtful.”';return '“…Is this from the bin behind the laundromat?”';}
const heartsFor=v=>v>=7?3:v>=4?2:1;

export function give(kind){
  const S=gameState.session,fr=S.fr,X=fr.short||fr.name;
  if(S.nightResult){setStatus(`You already gave ${esc(X)} something tonight.`,'');return;}
  let res;
  if(kind==='pebbles')res={who:fr.name,short:X,kind,e:'🪨',n:`${PEBBLES} pebbles`,cost:PEBBLES,worth:PEBBLES,hearts:fr.pebbleHearts,line:fr.pebbleLine,why:[]};
  else{
    const id=S.sel;if(!id)return;
    const it=ITEMS[id],v=trueValue(id),why=[];
    S.factors.forEach(f=>{const m=FACTORS[f].eff(it,S.factors);if(Math.abs(m-1)>.01){let knew=S.known.has(f),txt=fill(FACTORS[f].know,fr);if(f==='cold'&&S.factors.has('bare')){txt=`A cold snap is coming and ${X} has no bedding. Together, that made warm soft things worth way more`;knew=S.known.has('cold')&&S.known.has('bare');why.push(`<li class="${knew?'k':'u'}">${knew?'✔ You knew both':'✘ You didn’t know both'}: ${esc(txt)}.</li>`);return;}why.push(`<li class="${knew?'k':'u'}">${knew?'✔ You knew':'✘ You never found out'}: ${esc(txt)} <b>${m>1?'(made it worth more)':'(made it worth less)'}</b></li>`);}});
    if(S.taste.item===id)why.push(`<li class="s">🤫 No clue could have told you: ${esc(X)} ${S.taste.mult>1?'just secretly loves things like this':'privately isn’t a fan of things like this'}.</li>`);
    if(!why.length)why.push(`<li>Nothing special about it to ${esc(X)}. It was just a ${esc(it.n.toLowerCase())}.</li>`);
    res={who:fr.name,short:X,kind,id,e:it.e,n:it.n,cost:it.p,worth:v,hearts:heartsFor(v),line:reactionFor(v/it.p).replace('{item}',it.n.toLowerCase()),why};
  }
  S.results.push(res);S.nightResult=res;showReveal(res);
}

export function noDigsMessage(){
  setStatus('No digs left. Choose a gift from your shelf, then confirm it with the Wrap button.','');
}
