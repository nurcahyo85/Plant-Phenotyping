# 🔬 PlantScope v1.0
### *Browser-based Plant Cell Phenotyping via Microscopy*

> A lightweight web application for plant cell morphology analysis directly from microscope images — no installation, no server, just open in your browser.

<br>

![Static Badge](https://img.shields.io/badge/versi-1.0-teal)
![Static Badge](https://img.shields.io/badge/platform-browser-informational)
![Static Badge](https://img.shields.io/badge/bahasa-HTML%20%2F%20JS-orange)
![Static Badge](https://img.shields.io/badge/lisensi-MIT-green)
![Static Badge](https://img.shields.io/badge/kontribusi-terbuka-brightgreen)

> 📋 **[Change Notes →](docs/note_changes.md)**

---

## 🌿 About This Project

PlantScope was born from a real field need: ecology and agrotechnology researchers working with leaf microscope images often lack access to paid cell analysis software — such as specific ImageJ plugins, CellProfiler, or NIS-Elements — on their field computers.

**PlantScope offers an alternative that runs entirely in the browser** — just open the HTML file, upload a microscope image, and start measuring. No installation. No dependencies. No license fees.

This project was developed in the context of tropical biodiversity research, specifically for plants from the **Zingiberaceae** family (*Globba*, *Zingiber*, *Alpinia*), but is designed to work with leaf tissue from any plant.

---

## ✨ Current Features (v1.0)

| Module | Features |
|---|---|
| **Image Upload** | Drag & drop, preview, brightness/contrast/saturation adjustment |
| **Measurement Tools** | Interactive distance measurement with px/µm calibration |
| **Cell Detection** | Semi-automatic cell annotation on images |
| **Cell Morphology** | Length, width, area, perimeter, circularity index, aspect ratio |
| **Stomata** | Density, stomatal index, guard cell size, pore aperture |
| **Vascular Tissue** | Xylem/phloem diameter, vein density, vascular area index |
| **Segmentation** | Classification of epidermis, mesophyll, stomata, and other tissues |
| **Data Export** | CSV, JSON, and print-ready text reports |

---

## 🚀 How to Use

```
1. Download the plant-phenotyping.html file
2. Open it in a browser (Chrome / Firefox / Edge)
3. Upload a microscope image
4. Set the px/µm calibration according to the objective lens used
5. Start analysis
```

No additional steps. Everything runs locally on your computer.

---

## 🗺️ Development Roadmap

This is an area that is **highly open for collaboration**. Below is a list of features planned for future development:

### 🔴 High Priority
- [ ] **Real algorithm-based cell segmentation** — integration of OpenCV.js (Otsu thresholding, watershed, active contours) to replace the current placeholder detection
- [ ] **Morphometric parameter calculation from actual segmentation** — length, width, and area computed directly from selected pixels
- [ ] **Automatic scale calibration** — scale bar detection from the image

### 🟡 Medium Priority
- [ ] **Cell color analysis** — chloroplast distribution identification based on green intensity
- [ ] **Two-image comparison mode** — overlay two specimens or two treatment conditions
- [ ] **Annotated image export** — save the canvas with measurements as PNG/TIFF
- [ ] **Multi-frame support** — z-stack navigation for confocal microscopy

### 🟢 Long Term
- [ ] **Deep learning model integration (ONNX.js)** — automatic cell type classification
- [ ] **Morphometric reference database** — reference values for common plant species
- [ ] **Collaborative mode** — shared annotation via shared session
- [ ] **PWA version** — installable on field tablets without an internet connection

---

## 🤝 Let's Collaborate

This project is **fully open** for contributions from anyone — students, researchers, developers, or anyone interested in the intersection of plant biology and technology.

### Ways you can contribute:

- 🐛 **Report bugs** — open an Issue if you encounter unexpected behavior
- 💡 **Propose features** — open discussion in the Discussions tab
- 🔧 **Write code** — browse the [open issues](../../issues) and pick one that interests you
- 🧪 **Test with real data** — feedback from actual lab usage is invaluable
- 📖 **Documentation** — help write wiki pages or user guides in other languages
- 🌍 **UI Translation** — currently available in Indonesian, open for English and others

### How to start contributing:

```bash
# 1. Fork this repository
# 2. Clone it locally
git clone https://github.com/USERNAME/plantscope.git

# 3. Create a new branch
git checkout -b feature/your-feature-name

# 4. Make your changes, then commit
git commit -m "feat: add [brief description]"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

> You don't need to be an expert coder to contribute. Usage feedback, test data, or documentation are just as valuable as code.

---

## 🧬 Research Context

This project was developed as a supporting tool for tropical plant ecology research, with a focus on:

- **Leaf phenotypes** in the context of climate change and habitat fragmentation
- **Stomata morphology** as an indicator of physiological adaptation
- **Epidermal cell morphometry** in Zingiberaceae plants (*Globba*, *Zingiber*, etc.)
- Integration of microscopy phenotype data with **GIS, pollination ecology, and genomics** data

If your research intersects with any of these topics, research collaboration discussions are very welcome.

---

## 📁 Repository Structure

```
plantscope/
│
├── plant-phenotyping.html    # Main application entry point
├── README.md                 # This file (English)
├── README_ID.md              # Documentation (Indonesian)
│
├── css/
│   ├── variables.css         # Design tokens (colors, spacing, typography)
│   ├── base.css              # Global reset, animations, scrollbar
│   ├── layout.css            # Header, sidebar, responsive breakpoints
│   └── components.css        # Cards, buttons, canvas, table, badges
│
├── js/
│   ├── app.js                # Consolidated entry point (all modules)
│   ├── state.js              # Shared application state
│   ├── canvas.js             # Canvas tools, upload, measurements
│   ├── charts.js             # Histogram, stomata, vascular charts
│   ├── export.js             # CSV / JSON / text / print export
│   └── nav.js                # Clock and time display
│
├── docs/
│   ├── note_changes.md       # Change log — see all version notes
│   ├── note_plan.md          # Backend integration roadmap (FastAPI)
│   └── note_codebase.md      # Architecture and code reference
│
├── test_images/
│   ├── NAMING_CONVENTION.txt # Image naming rules per analysis task
│   └── .env                  # Registered test image paths
│
└── output/
    ├── NAMING_CONVENTION.txt # Output naming rules (overlay, mask, json, …)
    └── .env                  # Registered output file paths
```

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute, including for academic and commercial purposes, as long as attribution is maintained.

---

## 📬 Contact

Developed by **Nurcahyo Widyodaru Saputro**  
Lecturer in Agrotechnology · Universitas Singaperbangsa Karawang  
Specialization: Ecology, Biodiversity, & Interdisciplinary Research

For research discussions, collaboration, or technical questions — please open an [Issue](../../issues) or reach out via the GitHub profile.

---

<div align="center">
  <sub>Made with 🔬 for the Indonesian and global plant research community</sub>
</div>
