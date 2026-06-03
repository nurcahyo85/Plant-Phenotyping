# Codebase Notes

## Section 1 — Entry point & markup

* **`plant-phenotyping.html`**
    * **Purpose:** Main HTML entry point; loads all CSS and JS modules and defines the page structure.
    * **Usage:** Open directly in a browser.
    * **Notes:** Modularised from a single-file original; imports from `css/` and `js/`.

## Section 2 — Stylesheets (`css/`)

* **`css/variables.css`**
    * **Purpose:** CSS custom properties (design tokens) used across all other stylesheets.

* **`css/base.css`**
    * **Purpose:** Reset and base element styles.

* **`css/layout.css`**
    * **Purpose:** Page-level layout — grid/flex structure, panels, sidebar.

* **`css/components.css`**
    * **Purpose:** Component-level styles — buttons, controls, modals, overlays.

## Section 3 — JavaScript modules (`js/`)

* **`js/state.js`**
    * **Purpose:** Central state store; holds measurement data and app config shared across modules.
    * **Usage:** Imported by other JS modules; do not mutate state directly from HTML.

* **`js/canvas.js`**
    * **Purpose:** Canvas drawing logic — renders the plant image, handles measurement tools and annotations.

* **`js/charts.js`**
    * **Purpose:** Chart.js integration; renders analytics charts from measurement data in `state.js`.

* **`js/analytics.js`** *(if present)*
    * **Purpose:** Measurement calculations and data processing before chart rendering.

* **`js/export.js`**
    * **Purpose:** Export functionality — saves measurements or images to file.

* **`js/nav.js`**
    * **Purpose:** Navigation / tab switching logic.

* **`js/main.js`**
    * **Purpose:** App bootstrap; wires up event listeners and initialises modules on page load.

## Section 4 — Config & tooling

* **`.gitignore`**
    * **Purpose:** Excludes `.claude/` (local tooling) and all image/data files inside `test_images/` and `output/` from version control; only convention docs and `.env` files in those folders are tracked.

## Section 5 — Documentation (`docs/`)

* **`README.md`** — English README; includes badge row, changelog link, repo structure tree, roadmap, and contribution guide.
* **`README_ID.md`** — Indonesian README.
* **`docs/note_changes.md`** — Running change log, kept to one full entry + index.
* **`docs/note_codebase.md`** — This file; documents purpose and usage of every source file.
* **`docs/note_plan.md`** — FastAPI backend integration roadmap; specifies endpoints, JSON contracts, algorithms, and open bug/feature lists for all five analysis tasks.

## Section 6 — Test assets (`test_images/`)

* **`test_images/NAMING_CONVENTION.txt`** [NEW]
    * **Purpose:** Defines the naming format `{task}_{index}.{ext}` for all test images; lists the six tasks (`upload`, `detect`, `segment`, `morphology`, `stomata`, `vascular`) with the image characteristics required for each and their corresponding FastAPI endpoints.
    * **Notes:** Index restarts at 001 per task. PNG preferred for synthetic images; JPG for real microscopy photos.

* **`test_images/.env`** [NEW]
    * **Purpose:** Registers concrete test image paths via `TEST_IMG_{TASK}_{INDEX}=filename`; consumed by backend scripts and test runners to locate assets without hardcoding paths.

## Section 7 — Generated outputs (`output/`)

* **`output/NAMING_CONVENTION.txt`** [NEW]
    * **Purpose:** Defines the naming format `{task}_{index}_{type}.{ext}` for all generated results; `type` is one of `overlay`, `mask`, `crop`, `chart`, `json`, `csv`, `report`. Lists the expected output files per task and requires that the index matches the source image in `test_images/`.

* **`output/.env`** [NEW]
    * **Purpose:** Registers generated output paths via `OUT_{TASK}_{INDEX}_{TYPE}=filename`; updated as new results are produced.
