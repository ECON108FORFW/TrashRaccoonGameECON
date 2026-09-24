import { gameState } from './game-state.js';
import { $, esc } from './utils.js';
import { friendImg } from './ui.js?v=no-accessories';

const actions = {};
export function configureOverlays(map) { Object.assign(actions, map); }

export function openCard(html, stars = 36) {
  const card = $('card');
  card.innerHTML = html;
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
  return `<div class="portrait">${friendImg(fr)}</div>`;
}

export function showTitle() {
  openCard(`<div class="glitter-title">Treasure Through Trash</div><p>One raccoon. One junkyard. <b>Three nights before the run is over.</b></p><p class="small">Tap trash to dig · tap a gift to pick it · that’s it.</p><button class="btn big" data-go="how">▶ Play</button>`, 52);
}

export function showHow() {
  openCard(`<div class="glitter-title">How to Play</div><p class="how-to-body">Three raccoons need gifts across three nights. Each night runs from <b>7:00 PM to 7:00 AM</b>.</p><p class="how-to-body">Some trash is a <b>gift</b>. Some trash is a <b>clue</b>. Every dig advances the clock by two hours.</p><p class="how-to-body">You can give only <b>one gift per night</b>. If you run out of digs or reach 7:00 AM, you can still choose from the gifts you already found. The result appears only after you confirm what you want to give.</p><button class="btn big" data-go="start">Start game</button>`, 52);
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
  const buttonText = lastNight ? 'See overall results →' : 'Next night →';
  openCard(`${portrait(fr)}<div class="quote">${esc(r.line)}</div><div class="tag"><div class="gift">${r.e} ${esc(r.n)}</div><div class="paid">You paid: <s>${r.cost} pebbles</s></div><div class="worth">Worth to me: ${r.worth} — ${esc(X)}</div></div>${gapLine}<div class="hearts">${hearts}</div>${why}<button class="btn big" data-go="afterGift">${buttonText}</button>`, 26);
}

export function showNightSummary(summary) {
  const fr = gameState.session.fr;
  const giftBlock = summary.gaveGift
    ? `<p><b>You gave ${esc(fr.short || fr.name)}:</b> ${summary.result.e} ${esc(summary.result.n)}.</p><p>${esc(summary.result.line)}</p><div class="hearts">${'💗'.repeat(summary.result.hearts)}<i>${'💗'.repeat(3-summary.result.hearts)}</i></div>`
    : `<p><b>You never gave ${esc(fr.short || fr.name)} a gift.</b></p><p>${esc(summary.message)}</p><div class="hearts"><i>💗💗💗</i></div>`;
  openCard(`<div class="glitter-title" style="font-size:clamp(36px,8vw,58px)">Night ${gameState.session.round + 1} Complete</div>${portrait(fr)}${giftBlock}<p class="small">The clock resets to 7:00 PM for the next night.</p><button class="btn big" data-go="nextNight">Next night →</button>`, 42);
}

export function showEnd() {
  const R = gameState.session.results;
  const actual = R.filter(r => r.kind !== 'missed');
  const cost = actual.reduce((a,r)=>a+r.cost,0);
  const worth = actual.reduce((a,r)=>a+r.worth,0);
  const hearts = actual.reduce((a,r)=>a+r.hearts,0);
  const gap = worth-cost;
  const giftsGiven = actual.length;
  const missed = R.filter(r=>r.kind==='missed').length;
  const avgHearts = giftsGiven ? (hearts/giftsGiven).toFixed(1) : '0.0';
  const efficiency = cost ? Math.round((worth/cost)*100) : 0;
  const maxV = Math.max(...actual.map(r=>Math.max(r.cost,r.worth)),1);
  const minis = R.map(r => {
    if (r.kind === 'missed') return `<div class="mini"><div class="who">${esc(r.short)}</div><div class="em">—</div><div style="padding:18px 4px 8px;font-weight:800">No gift</div><div>Disappointed</div></div>`;
    return `<div class="mini"><div class="who">${esc(r.short)}</div><div class="em">${r.e}</div><div class="bars"><div class="c" style="height:${r.cost/maxV*70+4}px"><span>${r.cost}</span></div><div class="v" style="height:${r.worth/maxV*70+4}px"><span>${r.worth}</span></div></div>${r.worth<r.cost?`−${r.cost-r.worth}`:r.worth>r.cost?`+${r.worth-r.cost}`:'Even'}</div>`;
  }).join('');
  const netLine = gap>0 ? `<b>+${gap}</b> more joy than effort spent.` : gap<0 ? `<b>${gap}</b> net value compared with effort spent.` : '<b>0</b> net difference between effort and joy.';
  openCard(`<div class="glitter-title" style="font-size:clamp(34px,8vw,54px)">Overall Results</div><p class="end-night-body">Three nights complete. Here’s how the whole run turned out.</p><div class="tags3">${minis}</div><div class="legend"><i style="background:#8a7b5c"></i>What you paid <i style="background:#d85f9a"></i>What it was worth to them</div><p class="tally">Gifts given: <b>${giftsGiven}</b> / 3${missed ? `<br>Missed gifts: <b>${missed}</b>` : ''}<br>Total effort spent: <b>${cost}</b> pebbles<br>Total value to friends: <b>${worth}</b> pebbles<br>Total hearts earned: <b>${hearts}</b> / 9<br>Average hearts per gift: <b>${avgHearts}</b><br>Gift-value efficiency: <b>${efficiency}%</b></p><p class="finale">${netLine}</p><button class="btn big" data-go="economic">Economic lesson →</button><button class="btn big" data-go="again">↻ Play again</button>`, 40);
}

export function showEconomicLesson() {
  openCard(`<div class="glitter-title" style="font-size:clamp(34px,8vw,54px)">Economic Lesson</div><p class="how-to-body">A gift can cost the giver more than it is worth to the recipient. When that happens, some of the value spent on the gift is lost because the giver does not know the recipient’s preferences perfectly.</p><p class="how-to-body">In economics, this is an example of <b>information asymmetry</b> creating an inefficient allocation. The difference between what you spent and what the recipient valued can be viewed as a form of <b>deadweight loss</b>.</p><p class="how-to-body">The clues reduced that information gap. Better information helped you choose gifts that created more value for the same amount of effort. Giving pebbles avoided the guessing problem entirely because the recipient could use the value directly.</p><button class="btn big" data-go="end">← Overall results</button>`, 40);
}
