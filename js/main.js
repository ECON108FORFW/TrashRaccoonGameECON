import { $ } from './utils.js';
import { gameState } from './game-state.js';
import { renderStats } from './stats.js';
import { initGlitter } from './glitter.js';
import { configureOverlays, closeCard, showTitle, showHow, showEnd } from './overlays.js?v=no-accessories';
import { newGame, startNextNight, give, dig, noDigsMessage } from './gameplay.js?v=no-accessories';
import { createSceneRenderer } from './renderer/scene.js';

configureOverlays({
  how: showHow,
  start: () => { closeCard(); newGame(); },
  close: closeCard,
  nextNight: () => { closeCard(); startNextNight(); },
  afterGift: () => {
    closeCard();
    if (gameState.session?.round >= 2) showEnd();
    else startNextNight();
  },
  end: showEnd,
  again: () => { closeCard(); newGame(); },
});

$('wrapBtn').onclick = () => { if (gameState.session?.sel) give('gift'); };
$('pebbleBtn').onclick = () => give('pebbles');

initGlitter();
renderStats();
newGame();
closeCard();
showTitle();
const renderer = createSceneRenderer($('game'), { onDig: dig, onNoDigs: noDigsMessage });
renderer.start();
window.__TTT_TEST__ = { state: gameState, newGame, dig, give, startNextNight, closeCard };
