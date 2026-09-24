export function has(item, tag) { return item.tags.includes(tag); }
export function rand(a, b) { return a + Math.random() * (b - a); }
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function fill(template, friend) { return template.replaceAll('{X}', friend.short || friend.name); }
export function $(id) { return document.getElementById(id); }
export function esc(value) { return String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
