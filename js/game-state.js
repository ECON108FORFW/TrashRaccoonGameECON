export const gameState = {
  session: null,
  elapsedGameHours: 0,
  nightEnded: false,
  overlayOpen: false,
  carryPounds: 0,
};
export function resetGameState() {
  gameState.session = { round: 0, results: [] };
  gameState.elapsedGameHours = 0;
  gameState.nightEnded = false;
  gameState.overlayOpen = false;
  gameState.carryPounds = 0;
}
