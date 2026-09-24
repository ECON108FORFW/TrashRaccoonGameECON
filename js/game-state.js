export const gameState = {
  session: null,
  elapsedGameHours: 0,
  endNightShown: false,
  overlayOpen: false,
  carryPounds: 0,
};
export function resetGameState() {
  gameState.session = { round: 0, results: [] };
  gameState.elapsedGameHours = 0;
  gameState.endNightShown = false;
  gameState.overlayOpen = false;
  gameState.carryPounds = 0;
}
