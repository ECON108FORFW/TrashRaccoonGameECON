import { ITEMS, FACTORS } from './data.js';
import { PEBBLES } from './config.js';
import { gameState } from './game-state.js';
import { $, esc, fill } from './utils.js';
let estimateFn = () => 0;
export function configureUI({ estimate }) { estimateFn = estimate; }
export function friendImg(fr, size) { return `<img src="raccoon.png" alt="${esc(fr.name)}" style="filter:${fr.filter};${size ? 'width:' + size : ''}">`; }
export function setStatus(html, cls = '') {
  const el = $('status');
  el.className = 'bubble' + (cls ? ' ' + cls : '');
  el.innerHTML = html;
}
export function renderUI() {
  const S = gameState.session;
  if (!S?.fr) return;
  const fr = S.fr, X = fr.short || fr.name;
  const pawsLeft = '🐾'.repeat(S.digs) + `<i>${'🐾'.repeat(fr.digs - S.digs)}</i>`;
  $('roundBar').innerHTML = `<div class="who">${friendImg(fr)}<div><b>Gift ${S.round + 1} of 3 — for ${esc(fr.name)}</b><span>${esc(fr.role)}</span></div></div><div class="paws"><span class="p">${pawsLeft}</span>digs left</div>`;
  $('knowTitle').textContent = `What you know about ${X}`;
  const chips = [...S.known].map(f => `<div class="chip${S.newChip === f ? ' new' : ''}">${FACTORS[f].clue.e} ${esc(fill(FACTORS[f].know, fr))}</div>`);
  if (S.tiles.some(t => t.kind === 'vague' && t.open)) chips.push('<div class="chip">💌 She thinks you’ve “grown so much.”</div>');
  $('chips').innerHTML = chips.length ? chips.join('') : '<div class="chip empty">Nothing yet. Keep digging — some trash tells you things.</div>';
  $('shelfTitle').textContent = 'Gift shelf';
  $('shelfHint').innerHTML = S.found.length ? `Pink bar = your best guess of how much ${esc(X)} would love it. Tap one to choose it.` : 'Gifts you dig up land here.';
  const sorted = S.found.slice().sort((a, b) => estimateFn(b) - estimateFn(a) || ITEMS[b].p - ITEMS[a].p);
  $('shelf').innerHTML = sorted.map(id => {
    const it = ITEMS[id], est = estimateFn(id), d = S.lastDelta[id];
    const dl = d ? `<span class="delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '▲' : '▼'}${Math.abs(d)}</span>` : '';
    return `<button class="row${S.sel === id ? ' sel' : ''}${d ? ' moved' : ''}" data-id="${id}"><span class="em">${it.e}</span><span><span class="nm">${esc(it.n)}</span><span class="bar"><i style="width:${Math.min(100, est / 16 * 100)}%"></i></span></span><span class="nums">worth to ${esc(X)}? <b>~${est}</b>${dl}<br>costs you ${it.p}</span></button>`;
  }).join('');
  $('shelf').querySelectorAll('.row').forEach(b => b.onclick = () => { S.sel = b.dataset.id; S.lastDelta = {}; renderUI(); });
  $('wrapBtn').disabled = !S.sel;
  $('wrapBtn').textContent = S.sel ? `🎁 Wrap the ${ITEMS[S.sel].n.toLowerCase()}` : '🎁 Pick a gift to wrap';
  $('pebbleBtn').textContent = `Just give ${PEBBLES} pebbles`;
}
