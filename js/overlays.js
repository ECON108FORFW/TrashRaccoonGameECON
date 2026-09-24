import { gameState } from './game-state.js';
import { makeStar } from './glitter.js';
import { $, esc } from './utils.js';
import { friendImg } from './ui.js';
const actions = {};
export function configureOverlays(map) { Object.assign(actions, map); }
export function openCard(html, stars = 36) {
  const card = $('card');
  card.innerHTML = html;
  for (let i = 0; i < stars; i++) card.appendChild(makeStar('menu-star', 9, 22));
  $('overlay').classList.remove('hide');
  gameState.overlayOpen = true;
  $('overlay').scrollTop = 0;
  card.querySelectorAll('[data-go]').forEach(b => b.onclick = () => actions[b.dataset.go]?.());
  const first = card.querySelector('[data-go]');
  if (first) requestAnimationFrame(() => first.focus({ preventScroll: true }));
}
export function closeCard() { $('overlay').classList.add('hide'); gameState.overlayOpen = false; }
function portrait(fr) { return `<div class="portrait">${friendImg(fr)}${fr.acc ? `<span class="acc" style="${fr.acc === '👓' ? 'left:36%;top:14%;font-size:34px' : 'left:34%;top:-14%'}">${fr.acc}</span>` : ''}</div>`; }
export function showTitle() { openCard(`<div class="glitter-title">Treasure Through Trash</div><p>One raccoon. One junkyard. <b>Three gifts before sunrise.</b></p><p class="small">Tap trash to dig · tap a gift to pick it · that’s it.</p><button class="btn big" data-go="how">▶ PLAY</button>`, 52); }
export function showHow() { openCard(`<div class="glitter-title">How to Play</div><p class="how-to-body">Three raccoons need gifts tonight. For each one, <b>dig through the junkyard</b> — but you only get a few digs.</p><p class="how-to-body">Some trash is a <b>gift</b> (costs you effort to grab). Some trash is a <b>clue</b> about who you’re shopping for. Clues can change what you think a gift is worth.</p><p class="how-to-body">Pick the gift you think they’ll love most — or play it safe and hand over pebbles.</p><button class="btn big" data-go="start">START GAME</button>`, 52); }
export function showIntro() { const S=gameState.session,fr=S.fr; openCard(`${portrait(fr)}<h3>Gift ${S.round + 1} of 3: ${esc(fr.name)}</h3><p>${esc(fr.intro)}</p><p class="small">${fr.digs} digs · 8 piles of trash</p><button class="btn big" data-go="close">Start digging</button>`,30); }
export function showReveal(r) {
  const S=gameState.session,fr=S.fr,X=r.short,gap=r.worth-r.cost;
  const gapLine=gap<0?`<div class="gapline loss">${-gap} pebble${gap===-1?'':'s'} of effort just… vanished.</div>`:gap>0?`<div class="gapline gain">+${gap}! It meant more to ${esc(X)} than it cost you.</div>`:'<div class="gapline even">Nothing vanished. Not one pebble.</div>';
  const hearts='💗'.repeat(r.hearts)+`<i>${'💗'.repeat(3-r.hearts)}</i>`;
  const why=r.kind==='pebbles'?`<div class="why"><b>Why?</b><ul><li>Pebbles are worth exactly what you paid — to anyone. No guessing needed.</li><li>${r.hearts>=2?`But from a relative you barely know? ${esc(X)} seems fine with it.`:`But from someone who’s supposed to know ${esc(X)}? It stings a little.`}</li></ul></div>`:`<div class="why"><b>Why was it worth ${r.worth} to ${esc(X)}?</b><ul>${r.why.join('')}</ul></div>`;
  const last=S.round===2;
  openCard(`${portrait(fr)}<div class="quote">${esc(r.line)}</div><div class="tag"><div class="gift">${r.e} ${esc(r.n)}</div><div class="paid">You paid: <s>${r.cost} pebbles</s></div><div class="worth">worth to me: ${r.worth} — ${esc(X)}</div></div>${gapLine}<div class="hearts">${hearts}</div>${why}<button class="btn big" data-go="${last?'end':'next'}">${last?'See the night’s tally':'Next gift →'}</button>`,26);
}
export function showEnd() {
  const R=gameState.session.results,cost=R.reduce((a,r)=>a+r.cost,0),worth=R.reduce((a,r)=>a+r.worth,0),hearts=R.reduce((a,r)=>a+r.hearts,0),gap=cost-worth,maxV=Math.max(...R.map(r=>Math.max(r.cost,r.worth)),1);
  const minis=R.map(r=>`<div class="mini"><div class="who">${esc(r.short)}</div><div class="em">${r.e}</div><div class="bars"><div class="c" style="height:${r.cost/maxV*70+4}px"><span>${r.cost}</span></div><div class="v" style="height:${r.worth/maxV*70+4}px"><span>${r.worth}</span></div></div>${r.worth<r.cost?`−${r.cost-r.worth}`:r.worth>r.cost?`+${r.worth-r.cost}`:'even'}</div>`).join('');
  const finale=gap>0?`“It’s the thought that counts.”<br>They counted. <b>${gap} short.</b>`:gap<0?`“It’s the thought that counts.”<br>They counted. <b>${-gap} over.</b> Some things are worth more than they cost.`:'“It’s the thought that counts.”<br>They counted. <b>Dead even.</b> Suspiciously even.';
  openCard(`<div class="glitter-title" style="font-size:clamp(34px,8vw,54px)">Sunrise.</div><div class="tags3">${minis}</div><div class="legend"><i style="background:#8a7b5c"></i>what you paid <i style="background:#d85f9a"></i>what it was worth to them</div><p class="tally">You spent <b>${cost}</b> pebbles of effort.<br>They got <b>${worth}</b> pebbles of joy.</p><div class="hearts">${'💗'.repeat(hearts)}<i>${'💗'.repeat(9-hearts)}</i></div><p class="finale">${finale}</p><button class="btn big" data-go="again">↻ Dig again</button><p class="small">Every friend’s tastes change each game.</p><details><summary>Where did the pebbles go?</summary><p>With Pip, the clues were everywhere. With Nib, there were a few. With Great-Aunt Marlo, you were guessing in the dark. Did the gap between what you paid and what the gift was worth grow as the clues dried up?</p><p>What a gift is worth to someone depends on a pile of things tangled together: what they already own, where they live, what’s about to happen, what they secretly love. The less of that pile you can see, the more of your effort disappears in the wrapping.</p><p>In 1993, the economist Joel Waldfogel asked students after the holidays what their gifts had cost the giver and what the students themselves would have paid for them. On average, gifts were worth roughly 10% to a third less to the receiver than they cost the giver. Gifts from people who knew them less well, like grandparents and distant relatives, lost the most — and those were the relatives most likely to just give cash.</p><p>Then again, nobody ever cried happy tears over a pile of pebbles. Sometimes a gift is worth more than it cost.</p></details>`,40);
}
export function showEndOfNight(){openCard('<div class="glitter-title" style="font-size:clamp(38px,9vw,64px)">End of Night</div><p class="end-night-body">The night has ended. Your run through the dump is complete.</p>',52);}
