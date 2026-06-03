# 🔬 PlantScope v1.0
### *Browser-based Plant Cell Phenotyping via Microscopy*

> Aplikasi web ringan untuk analisis morfologi sel tanaman langsung dari gambar mikroskop — tanpa instalasi, tanpa server, cukup buka di browser.

<br>

![Static Badge](https://img.shields.io/badge/versi-1.0-teal)
![Static Badge](https://img.shields.io/badge/platform-browser-informational)
![Static Badge](https://img.shields.io/badge/bahasa-HTML%20%2F%20JS-orange)
![Static Badge](https://img.shields.io/badge/lisensi-MIT-green)
![Static Badge](https://img.shields.io/badge/kontribusi-terbuka-brightgreen)

---

## 🌿 Tentang Proyek Ini

PlantScope lahir dari kebutuhan nyata di lapangan: peneliti ekologi dan agroteknologi yang bekerja dengan gambar mikroskop daun seringkali tidak memiliki akses ke perangkat lunak analisis sel berbayar seperti ImageJ plugin tertentu, CellProfiler, atau NIS-Elements di komputer lapangan mereka.

**PlantScope menawarkan alternatif yang sepenuhnya berjalan di browser** — cukup buka file HTML, unggah gambar mikroskop, dan mulai mengukur. Tidak ada instalasi. Tidak ada dependensi. Tidak ada biaya lisensi.

Proyek ini dikembangkan dengan konteks riset biodiversitas tropis, khususnya untuk tanaman dari famili **Zingiberaceae** (*Globba*, *Zingiber*, *Alpinia*), namun dirancang agar dapat digunakan untuk jaringan daun tanaman apapun.

---

## ✨ Fitur Saat Ini (v1.0)

| Modul | Fitur |
|---|---|
| **Unggah Gambar** | Drag & drop, pratinjau, penyesuaian kecerahan/kontras/saturasi |
| **Alat Ukur** | Pengukuran jarak interaktif dengan kalibrasi px/µm |
| **Deteksi Sel** | Anotasi sel semi-otomatis pada gambar |
| **Morfologi Sel** | Panjang, lebar, luas, keliling, indeks kebulatan, rasio aspek |
| **Stomata** | Kerapatan, indeks stomata, ukuran sel penjaga, apertur pori |
| **Jaringan Pembuluh** | Diameter xilem/floem, kerapatan vena, indeks area pembuluh |
| **Segmentasi** | Klasifikasi epidermis, mesofil, stomata, dan jaringan lain |
| **Ekspor Data** | CSV, JSON, dan laporan teks siap cetak |

---

## 🚀 Cara Menggunakan

```
1. Unduh file plant-phenotyping.html
2. Buka di browser (Chrome / Firefox / Edge)
3. Unggah gambar mikroskop
4. Atur kalibrasi px/µm sesuai objektif yang digunakan
5. Mulai analisis
```

Tidak ada langkah tambahan. Semua berjalan lokal di komputer Anda.

---

## 🗺️ Peta Jalan Pengembangan

Ini adalah area yang **sangat terbuka untuk kolaborasi**. Berikut daftar fitur yang ingin dikembangkan bersama:

### 🔴 Prioritas Tinggi
- [ ] **Segmentasi sel berbasis algoritma nyata** — integrasi OpenCV.js (Otsu thresholding, watershed, active contours) untuk menggantikan deteksi acak saat ini
- [ ] **Kalkulasi parameter morfometri dari segmentasi aktual** — panjang, lebar, luas dihitung langsung dari piksel terseleksi
- [ ] **Kalibrasi skala otomatis** — deteksi scale bar dari gambar

### 🟡 Prioritas Menengah
- [ ] **Analisis warna sel** — identifikasi distribusi kloroplas berbasis intensitas hijau
- [ ] **Mode perbandingan dua gambar** — overlay dua spesimen atau dua kondisi perlakuan
- [ ] **Ekspor gambar teranotasi** — simpan canvas dengan pengukuran sebagai PNG/TIFF
- [ ] **Dukungan multi-frame** — navigasi z-stack mikroskop confocal

### 🟢 Jangka Panjang
- [ ] **Integrasi model deep learning (ONNX.js)** — klasifikasi jenis sel otomatis
- [ ] **Database referensi morfometri** — nilai acuan untuk spesies tanaman umum
- [ ] **Mode kolaboratif** — anotasi bersama via shared session
- [ ] **Versi PWA** — bisa diinstal di tablet lapangan tanpa koneksi internet

---

## 🤝 Mari Berkolaborasi

Proyek ini **sepenuhnya terbuka** untuk kontribusi dari siapapun — mahasiswa, peneliti, developer, atau siapapun yang tertarik pada persimpangan antara biologi tanaman dan teknologi.

### Anda bisa berkontribusi dalam bentuk:

- 🐛 **Melaporkan bug** — buka Issue jika menemukan perilaku yang tidak sesuai
- 💡 **Mengusulkan fitur** — diskusi terbuka di tab Discussions
- 🔧 **Menulis kode** — lihat daftar [open issues](../../issues) dan pilih yang menarik
- 🧪 **Menguji dengan data nyata** — feedback dari penggunaan di lab sangat berharga
- 📖 **Dokumentasi** — bantu menulis wiki atau panduan penggunaan dalam bahasa lain
- 🌍 **Terjemahan UI** — saat ini tersedia dalam Bahasa Indonesia, terbuka untuk Inggris, dll.

### Cara mulai berkontribusi:

```bash
# 1. Fork repositori ini
# 2. Clone ke lokal Anda
git clone https://github.com/USERNAME/plantscope.git

# 3. Buat branch baru
git checkout -b fitur/nama-fitur-anda

# 4. Lakukan perubahan, lalu commit
git commit -m "feat: tambahkan [deskripsi singkat]"

# 5. Push dan buat Pull Request
git push origin fitur/nama-fitur-anda
```

> Tidak harus jago coding untuk berkontribusi. Feedback penggunaan, data uji, atau dokumentasi sama berharganya dengan kode.

---

## 🧬 Konteks Riset

Proyek ini dikembangkan sebagai alat bantu untuk riset ekologi tanaman tropis, dengan fokus pada:

- **Fenotipe daun** dalam konteks perubahan iklim dan fragmentasi habitat
- **Morfologi stomata** sebagai indikator adaptasi fisiologis
- **Morfometri sel epidermis** pada tanaman Zingiberaceae (*Globba*, *Zingiber*, dll.)
- Integrasi data fenotipe mikroskopi dengan data **GIS, ekologi polinasi, dan genomik**

Jika penelitian Anda bersinggungan dengan topik-topik di atas, sangat terbuka untuk diskusi kolaborasi riset.

---

## 📁 Struktur Repositori

```
plantscope/
│
├── plant-phenotyping.html    # Aplikasi utama (single-file)
├── README.md                 # Dokumentasi ini
├── LICENSE                   # MIT License
│
├── docs/                     # (akan datang) Dokumentasi teknis
├── data/                     # (akan datang) Data uji dan referensi
└── algorithms/               # (akan datang) Modul algoritma segmentasi
```

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan, termasuk untuk keperluan akademik dan komersial, selama atribusi dipertahankan.

---

## 📬 Kontak

Dikembangkan oleh **Nurcahyo Widyodaru Saputro**  
Dosen Agroteknologi · Universitas Singaperbangsa Karawang  
Spesialisasi: Ekologi, Biodiversitas, & Riset Interdisipliner

Untuk diskusi riset, kolaborasi, atau pertanyaan teknis — silakan buka [Issue](../../issues) atau hubungi melalui profil GitHub.

---

<div align="center">
  <sub>Dibuat dengan 🔬 untuk komunitas riset tanaman Indonesia dan dunia</sub>
</div>
