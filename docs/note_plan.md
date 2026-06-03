# Development Plan — PlantScope Backend Integration

Goal: replace all hardcoded mock data with real computation via a FastAPI backend.
The HTML/CSS/JS frontend stays intact; a Python server handles image analysis and returns JSON.

---

## Current State Summary

| Feature | Status |
|---|---|
| Manual measurement tool | ✅ Real (pixel → µm via calibration) |
| Image adjustment sliders | ✅ Real (CSS filter on canvas) |
| Cell detection | ❌ Mock — random ellipses, count 14–22 |
| Tissue segmentation | ❌ Mock — fixed 38 / 44 / 12 / 6 % |
| Cell morphology metrics | ❌ Mock — hardcoded static HTML values |
| Stomata analysis | ❌ Mock — hardcoded density, index, guard cell sizes |
| Vascular tissue analysis | ❌ Mock — hardcoded xylem/phloem params and chart |
| Data table | ❌ Mock — Glb-01 to Glb-06 rows never update |

---

## Priority 1 — Cell Detection
**User skill: high · Difficulty: medium**

### Current mock
`js/app.js` `detectCells()` draws N random ellipses (N = 14 + rand(8)) onto the canvas with no
reference to actual image content. The detected count shown in `detectedInfo` is equally random.

### Backend plan
- **Endpoint:** `POST /api/detect-cells`
- **Input:** multipart image upload + `pix_per_um` float
- **Output (same contract for both phases):**
  ```json
  {
    "count": 18,
    "cells": [{ "x": 120, "y": 80, "rx": 22, "ry": 14, "angle": 0.4 }, ...],
    "method": "cv" | "yolo"
  }
  ```
- **Frontend change:** replace the random-ellipse loop in `detectCells()` with a
  `fetch('/api/detect-cells', { method: 'POST', body: formData })` then draw returned
  ellipses onto the canvas. No frontend change needed when upgrading Phase 1 → 2 since
  the JSON contract stays the same.

---

### Phase 1 — Computer Vision (OpenCV)
**Try first. No training data needed; works out-of-the-box on stained sections.**

1. Load image with Pillow / OpenCV
2. Convert to grayscale → Gaussian blur (σ ≈ 1–2)
3. Adaptive threshold or Otsu threshold
4. `cv2.findContours` → filter by area (discard noise and whole-slide blobs)
5. `cv2.fitEllipse` on each valid contour → centre + axes + angle
6. scikit-image `regionprops` in parallel for morphology stats (feeds Priority 3)

**Limitations:** struggles with touching/overlapping cells, uneven staining, and
low-contrast images. If accuracy is insufficient on real slides, move to Phase 2.

**Libraries:**
```
opencv-python-headless  scikit-image  numpy  Pillow
```

---

### Phase 2 — YOLO (Object Detection)
**Try when Phase 1 accuracy is not good enough, or when a labelled dataset is available.**

- **Model:** YOLOv8-nano or YOLOv8-small (`ultralytics` package) — fast enough to run
  on CPU for single-image inference; fine-tune on annotated microscopy images.
- **Training data:** label cell bounding boxes in a tool like Label Studio or Roboflow;
  ~200–500 annotated images is enough for a fine-tuned nano model.
- **Inference:** `model.predict(image)` returns bounding boxes → convert box centre +
  half-widths to ellipse params `(x, y, rx, ry, angle=0)` for the frontend.
- **Output normalisation:** YOLO returns `xyxy` or `xywh` boxes; convert to the same
  ellipse JSON schema so the frontend draw loop requires zero changes.
- **Router change:** add `?method=yolo` query param to the endpoint, or auto-select
  based on whether a trained weights file exists at startup.

**Limitations:** requires labelled training data and a GPU for training (inference on
CPU is fine). Keep Phase 1 as a fallback when no weights file is present.

**Libraries:**
```
ultralytics  torch  torchvision  numpy  Pillow
```

---

## Priority 2 — Tissue Segmentation
**User skill: high · Difficulty: medium-hard**

### Current mock
Four `seg-bar-fill` widths (38 / 44 / 12 / 6 %) are hardcoded in the HTML and never change
regardless of what image is uploaded.

### Backend plan
- **Endpoint:** `POST /api/segment`
- **Input:** multipart image upload
- **Output:**
  ```json
  {
    "epidermis": 0.38,
    "mesophyll": 0.44,
    "stomata":   0.12,
    "other":     0.06
  }
  ```
- **Algorithm (colour-based, suitable for stained sections):**
  1. Convert to LAB or HSV colour space
  2. K-means clustering (k=4) → assign cluster labels to tissue classes by hue/lightness
  3. Count pixels per cluster → compute fractions
- **Algorithm (morphology-based, greyscale):**
  1. Watershed segmentation on distance-transformed binary mask
  2. Classify regions by size and shape (circularity, aspect ratio):
     - Large, irregular → mesophyll
     - Small, paired → stomata guard cells
     - Regular boundary layer → epidermis
- **Frontend change:** after upload + detect, call `/api/segment`; update
  `seg-bar-fill` widths and `seg-pct` text content from response.

### Libraries
```
opencv-python-headless  scikit-image  scipy  numpy
```

---

## Priority 3 — Cell Morphology Metrics
**User skill: medium · Difficulty: easy (follows from Priority 1)**

### Current mock
All values in the Morfologi Sel panel (length, width, area, perimeter, SI, aspect ratio,
form factor, compactness, histogram) are static HTML strings.

### Backend plan
- **Endpoint:** reuse `/api/detect-cells` — extend its response with per-cell regionprops,
  or add a separate `POST /api/morphology`
- **Additional output per cell:**
  ```json
  {
    "length_um": 47.3, "width_um": 28.6, "area_um2": 1247,
    "perimeter_um": 152.4, "circularity": 0.83,
    "aspect_ratio": 1.65, "form_factor": 0.71, "compactness": 1.19
  }
  ```
- **Algorithm:** scikit-image `regionprops` gives `major_axis_length`, `minor_axis_length`,
  `area`, `perimeter`, `eccentricity`, `solidity` directly; multiply by `pix_per_um` for µm values.
- **Histogram:** bin `major_axis_length` values into the 8 size ranges already shown.
- **Frontend change:** populate the `metric-list` items and re-draw `histCanvas` from response data.

### Libraries
```
scikit-image  numpy
```

---

## Priority 4 — Stomata Analysis
**User skill: medium · Difficulty: medium**

### Current mock
Stomata density (320 / 412 mm⁻²), index (0.14), guard cell dimensions, and the
adaxial/abaxial bar chart are all hardcoded constants.

### Backend plan
- **Endpoint:** `POST /api/stomata`
- **Input:** image upload + `pix_per_um` + `surface` ("adaxial" | "abaxial") + total image area in mm²
- **Output:**
  ```json
  {
    "density_per_mm2": 312,
    "stomatal_index": 0.13,
    "guard_cell_length_um": 18.1,
    "guard_cell_width_um": 9.0,
    "pore_width_um": 3.0,
    "count": 28
  }
  ```
- **Algorithm:**
  1. Same pipeline as cell detection but tune contour filters for the smaller, paired
     guard-cell morphology (lower area threshold, higher aspect ratio).
  2. Stomatal index = stomata_count / (stomata_count + epidermal_cell_count).
  3. Density = count / image_area_mm².
  4. Guard cell dims from `fitEllipse` → major / minor axes → µm.
- **Frontend change:** populate stomata parameter list and redraw `stomaChart` bar chart.

### Libraries
```
opencv-python-headless  scikit-image  numpy
```

---

## Priority 5 — Vascular Tissue Analysis
**User skill: low · Difficulty: hard**

### Current mock
All vascular parameters (VD 8.4, xylem Ø 12.7 µm, phloem Ø 8.3 µm, wall thickness 2.1 µm,
bundle area 348 µm², xilem/floem ratio 1.53) and the pie chart are hardcoded.

### Backend plan
- **Endpoint:** `POST /api/vascular`
- **Input:** image upload + `pix_per_um`
- **Output:**
  ```json
  {
    "vein_density_mm_per_mm2": 8.4,
    "xylem_diameter_um": 12.7,
    "phloem_diameter_um": 8.3,
    "wall_thickness_um": 2.1,
    "bundle_area_um2": 348,
    "xylem_phloem_ratio": 1.53,
    "fractions": { "xylem": 0.21, "phloem": 0.14, "parenchyma": 0.48, "sclerenchyma": 0.17 }
  }
  ```
- **Algorithm (colour-stain approach — safranin / alcian blue):**
  1. Separate red channel (safranin → xylem/sclerenchyma) and blue/cyan (alcian blue → phloem).
  2. Threshold each channel independently → binary masks per tissue.
  3. Skeletonise xylem mask → measure total skeleton length / image area = vein density.
  4. Fit circles/ellipses to individual vessel lumens → diameter in µm.
  5. Wall thickness: erode lumen mask, compare to outer boundary.
- **Algorithm (greyscale — fallback):**
  1. Watershed on cross-section → large thick-walled cells = xylem, small thin-walled = phloem.
  2. Classification by cell-wall thickness (distance transform of inverted binary).
- **Note:** this panel will likely need the most iteration; consider a labelled training set
  and a lightweight classifier (random forest on regionprops features) if rule-based fails.

### Libraries
```
opencv-python-headless  scikit-image  scipy  numpy  (optionally: scikit-learn)
```

---

## FastAPI Scaffold (shared across all tasks)

```
backend/
  main.py          # FastAPI app, mounts all routers
  routers/
    detect.py      # /api/detect-cells
    segment.py     # /api/segment
    morphology.py  # /api/morphology
    stomata.py     # /api/stomata
    vascular.py    # /api/vascular
  core/
    image_utils.py # load, resize, colour convert helpers
    analysis.py    # shared regionprops, contour, calibration helpers
  requirements.txt
```

Run: `uvicorn backend.main:app --reload`
Frontend points to `http://localhost:8000`.

---

## Frontend Integration Pattern (same for every endpoint)

```javascript
// Replace mock call with real API fetch
async function detectCells() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) { alert('Upload image first.'); return; }
  const fd = new FormData();
  fd.append('image', file);
  fd.append('pix_per_um', appState.pixPerUm);
  const res  = await fetch('http://localhost:8000/api/detect-cells', { method: 'POST', body: fd });
  const data = await res.json();
  drawCellsFromAPI(data.cells);  // replaces random-ellipse loop
}
```

CORS must be enabled in FastAPI (`fastapi.middleware.cors.CORSMiddleware`, origin `*` for local dev).

---

## Known Bugs (from bulletin #B)

| ID | Priority | Title | Detail |
|---|---|---|---|
| #B-01 | 🔴 high | Threshold slider does nothing | `redrawCanvas()` applies CSS filter for brightness/contrast/saturation but never reads the threshold value — binary thresholding is shown in the UI but not implemented |
| #B-02 | ⚪ low | `resetCanvas()` skips threshold reset | Brightness/contrast/saturation reset to 50 but threshold slider and label stay at the user's last value |
| #B-03 | 🔴 high | Ring chart sums to 113% | Morphology panel population rings: 83% + 20% + 10% = 113%. Values and SVG arc offsets need correcting |
| #B-04 | 🔴 high | `createObjectURL` memory leak | `downloadFile()` in `js/app.js` creates a blob URL that is never revoked; `URL.revokeObjectURL()` must be called after the click — **already partially fixed** (revoke added in app.js consolidation, verify it runs after `a.click()`) |
| #B-05 | 🟡 med | Report nav tab not highlighted from Data panel | "Buat Laporan" button called `showPanel` with a fragile nth-child selector that returned `null` — **fixed in v0.11** by passing `document.getElementById('nav-report')` directly |
| #B-06 | ⚪ low | Leading space in Glb-05 CSV export | `' Antre'` has a leading space in the status field, breaking CSV parsing in downstream tools |

---

## Frontend Tasks (from bulletin #F)

| ID | Priority | Title | Status | Detail |
|---|---|---|---|---|
| #F-01 | 🔴 high | Implement zoom tool | open | Zoom tool only changes cursor to `zoom-in`; actual scroll-to-zoom and pan on the canvas is missing |
| #F-02 | 🔴 high | EN / ID language toggle | ✅ done v0.11 | Implemented via `data-i18n` attributes and `toggleLang()` in `js/app.js` |
| #F-03 | 🟡 med | Replace `alert()` with inline toast | open | `alert()` used in `detectCells()` and `exportMeasurements()`; replace with a styled non-blocking toast/banner |
| #F-04 | 🟡 med | Keyboard-accessible nav items | open | Sidebar nav items are `<div onclick>`; convert to `<button>` or add `role="button" tabindex="0"` |
| #F-05 | ⚪ low | ARIA label on canvas | open | `#mainCanvas` has no accessible description; add `aria-label` + `role="img"` reflecting current image state |
| #F-06 | ⚪ low | Fix fragile nth-child nav selector | ✅ done v0.11 | Report nav item given `id="nav-report"`; Data panel button now passes it directly |
| #F-07 | ⚪ low | Responsive layout tablet/mobile | open | Fixed 220px sidebar and pixel grids break below ~900px; media queries needed to collapse sidebar and stack grids |
| #F-08 | 🔴 high | Refactor to modular codebase | ✅ done v0.11 | All modules consolidated into `js/app.js`; ES module gotcha resolved |
| #F-09 | 🔴 high | Define real image analysis pipeline | ✅ in progress | This document (`note_plan.md`) is the plan; FastAPI backend not yet built |
| #F-10 | 🟡 med | Confirm target species & reference values | open (Widyo) | Report cites *Globba* spp. and Zingiberaceae; Widyo to confirm species/accessions in scope so placeholder data can be grounded |
