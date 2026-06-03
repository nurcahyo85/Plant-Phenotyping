# 📝 Change Notes 3 (2026-06-03): Add test_images/ and output/ folders with naming conventions

- Created `test_images/` folder to hold microscopy images used for manual and automated testing. Added `.gitkeep` so the empty folder is tracked by git.
- Created `test_images/NAMING_CONVENTION.txt` — defines the naming format `{task}_{index}.{ext}` (zero-padded 3-digit index, restarts at 001 per task). Documents all six analysis tasks (`upload`, `detect`, `segment`, `morphology`, `stomata`, `vascular`) with the image characteristics needed for each (e.g. safranin/alcian-blue staining for vascular, paired guard-cell morphology for stomata). Maps tasks to their planned FastAPI endpoints from `note_plan.md`.
- Created `test_images/.env` — registers concrete file paths via `TEST_IMG_{TASK}_{INDEX}=filename` variables so scripts and the backend can locate test assets without hardcoding paths.
- Created `output/` folder (same structure) for generated analysis results. Added `.gitkeep`.
- Created `output/NAMING_CONVENTION.txt` — defines the richer format `{task}_{index}_{type}.{ext}` where `type` is one of `overlay`, `mask`, `crop`, `chart`, `json`, `csv`, `report`. Lists the expected output files per task (e.g. `detect_001_overlay.png` + `detect_001_json.json`). Requires that index matches the source image in `test_images/` so results stay traceable to their input.
- Created `output/.env` — registers output paths via `OUT_{TASK}_{INDEX}_{TYPE}=filename`.
- Updated `.gitignore` — added glob patterns to exclude actual image and data files (`*.jpg`, `*.png`, `*.tif`, `*.json`, `*.csv`, `*.pdf`) inside both `test_images/` and `output/`, so only the convention docs and `.env` files are tracked. Raw images and generated results must not be committed.
- Updated `README.md` — added a `📋 Change Notes →` blockquote link directly under the badge row; updated the Repository Structure section to remove stale entries (`bulletin.html`, `LICENSE`, placeholder `data/` and `algorithms/` folders), expand `docs/` with the three real files, list `app.js` as the consolidated JS entry point, and add the new `test_images/` and `output/` trees.

Previous change notes: (latest first)
* Change note 2: v0.11 — Fix tab navigation, add language toggle - [note_changes.md](https://github.com/pkhamchuai/Plant-Phenotyping/blob/a1000486cfd6586f8494748fc8d40ce2f10b5ad0/docs/note_changes.md)
* Change note 1: Bootstrap project tooling — wrapup commands and .gitignore - [note_changes.md](https://github.com/pkhamchuai/Plant-Phenotyping/blob/a1000486cfd6586f8494748fc8d40ce2f10b5ad0/docs/note_changes.md)

---
