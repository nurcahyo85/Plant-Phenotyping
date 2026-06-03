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

* **`.gitignore`** [NEW]
    * **Purpose:** Excludes `.claude/` (local tooling — commands, SKILL files, settings) from version control.

## Section 5 — Documentation (`docs/`)

* **`README.md`** — English README.
* **`README_ID.md`** — Indonesian README.
* **`docs/note_changes.md`** — Running change log, kept to one full entry + index.
* **`docs/note_codebase.md`** — This file; documents purpose and usage of every source file.
