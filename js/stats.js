import { START_HOUR, HOURS_PER_DIG, MAX_CARRY_POUNDS } from './config.js';
import { gameState } from './game-state.js';
import { $ } from './utils.js';

export function formatGameTime(totalHour) {
  const hour24 = ((totalHour % 24) + 24) % 24;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:00 ${suffix}`;
}

export function renderStats() {
  const tv = $('timeValue');
  const hv = $('hoursLeftValue');
  if (tv) tv.textContent = formatGameTime(START_HOUR + gameState.elapsedGameHours);
  if (hv) {
    const left = Math.max(0, 12 - gameState.elapsedGameHours);
    hv.textContent = `${left} ${left === 1 ? 'hour' : 'hours'} left until 7:00 AM`;
  }
  const carry = document.querySelector('.carry-stat .stat-value');
  if (carry) carry.textContent = `${gameState.carryPounds}/${MAX_CARRY_POUNDS} Pounds`;
  const fill = document.querySelector('.load-bar-fill');
  if (fill) fill.style.width = `${Math.min(100, (gameState.carryPounds / MAX_CARRY_POUNDS) * 100)}%`;
}

export function resetStats() {
  gameState.elapsedGameHours = 0;
  gameState.nightEnded = false;
  gameState.carryPounds = 0;
  renderStats();
}

export function resetNightClock() {
  gameState.elapsedGameHours = 0;
  gameState.nightEnded = false;
  renderStats();
}

export function advanceGameTime(onNightEnd) {
  if (gameState.nightEnded) return;
  gameState.elapsedGameHours = Math.min(12, gameState.elapsedGameHours + HOURS_PER_DIG);
  renderStats();
  if (gameState.elapsedGameHours >= 12) {
    gameState.nightEnded = true;
    onNightEnd?.();
  }
}
