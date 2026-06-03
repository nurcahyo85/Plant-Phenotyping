# 📝 Change Notes 1 (2026-06-03): Bootstrap project tooling — wrapup commands and .gitignore

- Added `.claude/commands/wrapup-hard.md` — full session wrap-up command adapted from spppt-2: gathers git diff, updates `note_changes.md` + `note_codebase.md`, updates SKILL files, and generates a commit message. Scopes and SKILL file list adapted to this project (canvas, analytics, ui, state, export).
- Added `.claude/commands/wrapup-soft.md` — lightweight wrap-up: SKILL file updates (if warranted), session summary, and commit message. Skips the heavy note-file updates.
- Added `.gitignore` — ignores `.claude/` so local tooling config (commands, SKILL files, settings) stays out of version control.

Previous change notes: (latest first)

---
