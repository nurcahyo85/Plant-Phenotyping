# 🔬 PlantScope v1.0
### *Browser-based Plant Cell Phenotyping via Microscopy*

> A lightweight web application for plant cell morphology analysis directly from microscopy images — no installation, no server, just open it in your browser.

<br>

![Static Badge](https://img.shields.io/badge/version-1.0-teal)
![Static Badge](https://img.shields.io/badge/platform-browser-informational)
![Static Badge](https://img.shields.io/badge/language-HTML%20%2F%20JS-orange)
![Static Badge](https://img.shields.io/badge/license-MIT-green)
![Static Badge](https://img.shields.io/badge/contributions-welcome-brightgreen)

---

## 🌿 About This Project

PlantScope was born from a real field problem: ecologists and agronomists working with leaf microscopy images frequently lack access to proprietary cell analysis software — such as specific ImageJ plugins, CellProfiler, or NIS-Elements — on their field or lab computers.

**PlantScope offers a fully browser-based alternative.** Open the HTML file, upload a microscopy image, and start measuring. No installation. No dependencies. No licensing fees.

The project was developed in the context of tropical biodiversity research, with a particular focus on plants from the family **Zingiberaceae** (*Globba*, *Zingiber*, *Alpinia*), but it is designed to work with leaf tissue from any plant species.

---

## ✨ Current Features (v1.0)

| Module | Description |
|---|---|
| **Image Upload** | Drag & drop support, image preview, brightness/contrast/saturation adjustment |
| **Measurement Tool** | Interactive distance measurement with px/µm calibration |
| **Cell Detection** | Semi-automatic cell annotation on microscopy images |
| **Cell Morphology** | Length, width, area, perimeter, circularity index, aspect ratio |
| **Stomata** | Stomatal density, stomatal index, guard cell dimensions, pore aperture |
| **Vascular Tissue** | Xylem/phloem diameter, vein density, vascular area index |
| **Segmentation** | Classification of epidermis, mesophyll, stomata, and other tissue types |
| **Data Export** | CSV, JSON, and print-ready text reports |

---

## 🚀 Getting Started

```
1. Download the plant-phenotyping.html file
2. Open it in any modern browser (Chrome / Firefox / Edge)
3. Upload a microscopy image
4. Set the px/µm calibration to match your objective lens
5. Start your analysis
```

No further steps required. Everything runs locally on your machine — your data never leaves your computer.

---

## 🗺️ Development Roadmap

The following areas are **open for collaboration**. Contributions at any level are welcome.

### 🔴 High Priority
- [ ] **Real segmentation algorithms** — integrate OpenCV.js (Otsu thresholding, watershed, active contours) to replace the current placeholder detection
- [ ] **Morphometric computation from actual segmentation** — calculate length, width, and area directly from selected pixel regions
- [ ] **Automatic scale bar detection** — parse scale bar from the image metadata or visual marker

### 🟡 Medium Priority
- [ ] **Cell color analysis** — identify chloroplast distribution based on green channel intensity
- [ ] **Two-image comparison mode** — overlay two specimens or treatment conditions side by side
- [ ] **Annotated image export** — save the canvas with measurements as PNG or TIFF
- [ ] **Multi-frame support** — navigate z-stacks from confocal microscopy

### 🟢 Long-term Goals
- [ ] **Deep learning integration (ONNX.js)** — automatic cell type classification
- [ ] **Morphometric reference database** — benchmark values for common plant species
- [ ] **Collaborative annotation mode** — shared annotation sessions for research teams
- [ ] **PWA version** — installable on field tablets for offline use

---

## 🤝 How to Contribute

This project is **fully open** to contributions from anyone — students, researchers, developers, or anyone interested in the intersection of plant biology and technology.

### Ways you can contribute:

- 🐛 **Report bugs** — open an Issue if you encounter unexpected behavior
- 💡 **Suggest features** — start a discussion in the Discussions tab
- 🔧 **Write code** — browse [open issues](../../issues) and pick something that interests you
- 🧪 **Test with real data** — feedback from actual lab use is invaluable
- 📖 **Improve documentation** — help write the wiki or usage guides in other languages
- 🌍 **Translate the UI** — currently in Indonesian; English and other languages are welcome

### Getting started:

```bash
# 1. Fork this repository

# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/plantscope.git

# 3. Create a new branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git commit -m "feat: add [brief description]"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

> You do not need to be an expert programmer to contribute. Usage feedback, test datasets, and documentation improvements are just as valuable as code.

---

## 🧬 Research Context

PlantScope was developed as a supporting tool for tropical plant ecology research, with an emphasis on:

- **Leaf phenotyping** in the context of climate change and habitat fragmentation
- **Stomatal morphology** as an indicator of physiological adaptation
- **Epidermal cell morphometrics** in Zingiberaceae (*Globba*, *Zingiber*, and related genera)
- Integration of microscopy phenotype data with **GIS, pollination ecology, and genomic datasets**

If your research touches on any of these areas, feel free to reach out — scientific collaboration is warmly welcomed.

---

## 📁 Repository Structure

```
plantscope/
│
├── plant-phenotyping.html    # Main application (single-file)
├── README.md                 # This documentation
├── LICENSE                   # MIT License
│
├── docs/                     # (coming soon) Technical documentation
├── data/                     # (coming soon) Test datasets and references
└── algorithms/               # (coming soon) Segmentation algorithm modules
```

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute for academic and commercial purposes, provided attribution is retained.

---

## 📬 Contact

Developed by **Nurcahyo Widyodaru Saputro**  
Lecturer in Agrotechnology · Universitas Singaperbangsa Karawang, Indonesia  
Research focus: Ecology, Biodiversity & Interdisciplinary Plant Science

For research discussions, collaboration inquiries, or technical questions — please open an [Issue](../../issues) or reach out via the GitHub profile.

---

<div align="center">
  <sub>Built with 🔬 for the plant research community — in Indonesia and beyond</sub>
</div>
