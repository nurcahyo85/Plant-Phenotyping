# 📝 Change Notes 2 (2026-06-03): v0.11 — Fix tab navigation, add language toggle

- Fixed tab/nav buttons being completely unresponsive: root cause was `<script type="module">` failing silently under the `file://` protocol (CORS blocks ES module imports), so `window.showPanel` and all other onclick handlers were never registered.
- Consolidated all JS modules (`state.js`, `nav.js`, `canvas.js`, `charts.js`, `export.js`, `main.js`) into a single non-module `js/app.js`; the HTML now loads it with a plain `<script src>` that works with or without a local server.
- Added language toggle button (`🌐 EN / ID`) to the app header; switches the full UI between Indonesian and English using `data-i18n` attributes on nav items, panel titles, subtitles, card headers, slider labels, and buttons.
- Charts (histogram, stomata bar, vascular pie) re-render with translated axis labels on language switch.
- Dynamic strings (cell detection feedback, measurement list, alert messages) also respect the active language.

---

# 📝 Change Notes 1 (2026-06-03): Bootstrap project tooling — wrapup commands and .gitignore

- Added `.claude/commands/wrapup-hard.md` — full session wrap-up command adapted from spppt-2: gathers git diff, updates `note_changes.md` + `note_codebase.md`, updates SKILL files, and generates a commit message. Scopes and SKILL file list adapted to this project (canvas, analytics, ui, state, export).
- Added `.claude/commands/wrapup-soft.md` — lightweight wrap-up: SKILL file updates (if warranted), session summary, and commit message. Skips the heavy note-file updates.
- Added `.gitignore` — ignores `.claude/` so local tooling config (commands, SKILL files, settings) stays out of version control.

Previous change notes: (latest first)

---
