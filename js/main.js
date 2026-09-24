import { $ } from './utils.js';
import { gameState } from './game-state.js';
import { renderStats } from './stats.js';
import { initGlitter } from './glitter.js';
import { configureOverlays, closeCard, showTitle, showHow, showEnd, showEconomicLesson } from './overlays.js?v=economic-lesson-exact-20260924';
import { newGame, startNextNight, give, dig, noDigsMessage } from './gameplay.js';
import { createSceneRenderer } from './renderer/scene.js?v=night-skies-v5';

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
  economic: showEconomicLesson,
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
