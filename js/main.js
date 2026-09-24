import { $ } from './utils.js';
import { gameState } from './game-state.js';
import { renderStats } from './stats.js';
import { initGlitter } from './glitter.js';
import { configureOverlays, closeCard, showTitle, showHow, showEnd, showEconomicLesson } from './overlays.js';
import { newGame, startNextNight, give, dig, noDigsMessage } from './gameplay.js?v=first-dig-fix-20260923';
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
