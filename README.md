# Treasure Through Trash

A small browser game built with vanilla HTML, CSS, and JavaScript for the ECON 108 AI Game assignment.

## Project structure

- `index.html` — lightweight page shell and HUD markup
- `css/game.css` — shared visual styles, glitter, menus, HUD, panels, and responsive rules
- `js/main.js` — app bootstrap and module wiring
- `js/config.js` — game-wide constants
- `js/game-state.js` — centralized runtime state
- `js/gameplay.js` — round setup, digging, gift selection, and giving logic
- `js/stats.js` — Time and Carry Load HUD logic
- `js/ui.js` — gameplay UI rendering
- `js/overlays.js` — title, How to Play, reveal, and ending screens
- `js/glitter.js` — runtime glitter generation
- `js/data.js` — items, clues, friends, and gameplay data
- `js/renderer/scene.js` — canvas scene and pointer interaction
- `js/renderer/objects.js` — retro-vector trash bag, box, and trash-can renderers
- `js/utils.js` — shared helpers

The game intentionally stays framework-free so small visual or gameplay changes can be made by editing only the relevant module instead of replacing one large monolithic HTML file.
