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

export function closeCard() {
  $('overlay').classList.add('hide');
  gameState.overlayOpen = false;
}

function portrait(fr) {
  return `<div class="portrait">${friendImg(fr)}${fr.acc ? `<span class="acc" style="${fr.acc === '👓' ? 'left:36%;top:14%;font-size:34px' : 'left:34%;top:-14%'}">${fr.acc}</span>` : ''}</div>`;
}

export function showTitle() {
  openCard(`<div class="glitter-title">Treasure Through Trash</div><p>One raccoon. One junkyard. <b>Three nights before the run is over.</b></p><p class="small">Tap trash to dig · tap a gift to pick it · that’s it.</p><button class="btn big" data-go="how">▶ PLAY</button>`, 52);
}

export function showHow() {
  openCard(`<div class="glitter-title">How to Play</div><p class="how-to-body">Three raccoons need gifts across three nights. Each night runs from <b>7:00 PM to 7:00 AM</b>.</p><p class="how-to-body">Some trash is a <b>gift</b>. Some trash is a <b>clue</b>. Every dig advances the clock by two hours.</p><p class="how-to-body">You can give only <b>one gift per night</b>. Once you give it and dismiss the result, the next night begins immediately. If you reach 7:00 AM without giving anything, the night ends automatically.</p><button class="btn big" data-go="start">START GAME</button>`, 52);
}

export function showIntro() {
  const S = gameState.session, fr = S.fr;
  openCard(`${portrait(fr)}<h3>Night ${S.round + 1} of 3 — ${esc(fr.name)}</h3><p>${esc(fr.intro)}</p><p class="small">7:00 PM to 7:00 AM · ${fr.digs} digs available</p><button class="btn big" data-go="close">Start digging</button>`, 30);
}

export function showReveal(r) {
  const S = gameState.session, fr = S.fr, X = r.short, gap = r.worth - r.cost;
  const gapLine = gap < 0 ? `<div class="gapline loss">${-gap} pebble${gap === -1 ? '' : 's'} of effort just… vanished.</div>` : gap > 0 ? `<div class="gapline gain">+${gap}! It meant more to ${esc(X)} than it cost you.</div>` : '<div class="gapline even">Nothing vanished. Not one pebble.</div>';
  const hearts = '💗'.repeat(r.hearts) + `<i>${'💗'.repeat(3-r.hearts)}</i>`;
  const why = r.kind === 'pebbles'
    ? `<div class="why"><b>Why?</b><ul><li>Pebbles are worth exactly what you paid — to anyone. No guessing needed.</li><li>${r.hearts >= 2 ? `But from a relative you barely know? ${esc(X)} seems fine with it.` : `But from someone who’s supposed to know ${esc(X)}? It stings a little.`}</li></ul></div>`
    : `<div class="why"><b>Why was it worth ${r.worth} to ${esc(X)}?</b><ul>${r.why.join('')}</ul></div>`;
  const lastNight = S.round === 2;
  const buttonText = lastNight ? 'See Final Tally →' : 'Next Night →';
  openCard(`${portrait(fr)}<div class="quote">${esc(r.line)}</div><div class="tag"><div class="gift">${r.e} ${esc(r.n)}</div><div class="paid">You paid: <s>${r.cost} pebbles</s></div><div class="worth">worth to me: ${r.worth} — ${esc(X)}</div></div>${gapLine}<div class="hearts">${hearts}</div>${why}<button class="btn big" data-go="afterGift">${buttonText}</button>`, 26);
}

export function showNightSummary(summary) {
  const fr = gameState.session.fr;
  const giftBlock = summary.gaveGift
    ? `<p><b>You gave ${esc(fr.short || fr.name)}:</b> ${summary.result.e} ${esc(summary.result.n)}.</p><p>${esc(summary.result.line)}</p><div class="hearts">${'💗'.repeat(summary.result.hearts)}<i>${'💗'.repeat(3-summary.result.hearts)}</i></div>`
    : `<p><b>You never gave ${esc(fr.short || fr.name)} a gift.</b></p><p>${esc(summary.message)}</p><div class="hearts"><i>💗💗💗</i></div>`;
  openCard(`<div class="glitter-title" style="font-size:clamp(36px,8vw,58px)">Night ${gameState.session.round + 1} Complete</div>${portrait(fr)}${giftBlock}<p class="small">The clock resets to 7:00 PM for the next night.</p><button class="btn big" data-go="nextNight">Next Night →</button>`, 42);
}

export function showEnd() {
  const R = gameState.session.results;
  const actual = R.filter(r => r.kind !== 'missed');
  const cost = actual.reduce((a,r)=>a+r.cost,0), worth = actual.reduce((a,r)=>a+r.worth,0), hearts = actual.reduce((a,r)=>a+r.hearts,0), gap = cost-worth;
  const maxV = Math.max(...actual.map(r=>Math.max(r.cost,r.worth)),1);
  const minis = R.map(r => {
    if (r.kind === 'missed') return `<div class="mini"><div class="who">${esc(r.short)}</div><div class="em">—</div><div style="padding:18px 4px 8px;font-weight:800">No gift</div><div>disappointed</div></div>`;
    return `<div class="mini"><div class="who">${esc(r.short)}</div><div class="em">${r.e}</div><div class="bars"><div class="c" style="height:${r.cost/maxV*70+4}px"><span>${r.cost}</span></div><div class="v" style="height:${r.worth/maxV*70+4}px"><span>${r.worth}</span></div></div>${r.worth<r.cost?`−${r.cost-r.worth}`:r.worth>r.cost?`+${r.worth-r.cost}`:'even'}</div>`;
  }).join('');
  const finale = gap>0?`“It’s the thought that counts.”<br>They counted. <b>${gap} short.</b>`:gap<0?`“It’s the thought that counts.”<br>They counted. <b>${-gap} over.</b> Some things are worth more than they cost.`:'“It’s the thought that counts.”<br>They counted. <b>Dead even.</b> Suspiciously even.';
  openCard(`<div class="glitter-title" style="font-size:clamp(34px,8vw,54px)">End of Night</div><p class="end-night-body">Three nights are over. Your run through the dump is complete.</p><div class="tags3">${minis}</div><div class="legend"><i style="background:#8a7b5c"></i>what you paid <i style="background:#d85f9a"></i>what it was worth to them</div><p class="tally">You spent <b>${cost}</b> pebbles of effort.<br>They got <b>${worth}</b> pebbles of joy.</p><div class="hearts">${'💗'.repeat(Math.min(hearts,9))}<i>${'💗'.repeat(Math.max(0,9-hearts))}</i></div><p class="finale">${finale}</p><button class="btn big" data-go="again">↻ Dig again</button>`, 40);
}
