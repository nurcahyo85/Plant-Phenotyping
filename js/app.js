/* PlantScope — consolidated app.js (no ES modules, works with file://) */

/* ===== STATE ===== */
var appState = {
  uploadedImg: null,
  currentTool: 'zoom',
  isDrawing: false,
  startX: 0,
  startY: 0,
  measurements: [],
  annotations: [],
  pixPerUm: 2.5,
  reset: function () {
    this.measurements = [];
    this.annotations  = [];
  },
};

/* ===== DOM REFS (lazy-initialised after DOMContentLoaded) ===== */
var domCanvas = null, domCtx = null, domTooltip = null;

function initDOM() {
  domCanvas  = document.getElementById('mainCanvas');
  domCtx     = domCanvas ? domCanvas.getContext('2d') : null;
  domTooltip = document.getElementById('tooltip');
}

/* ===== LANGUAGE ===== */
var currentLang = 'en';

var i18n = {
  id: {
    'section-analysis'   : 'Analisis',
    'section-data'       : 'Data',
    'nav-upload'         : 'Unggah Gambar',
    'nav-detection'      : 'Deteksi Sel',
    'nav-segmentation'   : 'Segmentasi Jaringan',
    'nav-morphology'     : 'Morfologi Sel',
    'nav-stomata'        : 'Indeks Stomata',
    'nav-vascular'       : 'Jaringan Pembuluh',
    'nav-data'           : 'Rekap Data',
    'nav-report'         : 'Laporan',
    'system-status'      : 'Sistem aktif',
    'upload-title'       : 'Unggah Gambar Mikroskop',
    'upload-sub'         : 'Unggah gambar irisan daun atau jaringan untuk memulai analisis fenotipe',
    'upload-drop-heading': 'Seret gambar ke sini atau klik untuk memilih',
    'upload-drop-hint'   : 'Mendukung gambar mikroskop cahaya, fluoresen, dan SEM',
    'calib-label'        : 'Kalibrasi:',
    'calib-unit'         : 'px/µm',
    'calib-apply'        : '✓ Terapkan',
    'tool-zoom'          : '🔍 Zoom',
    'tool-measure'       : '📏 Ukur',
    'tool-annotate'      : '✏️ Anotasi',
    'tool-reset'         : '↺ Reset',
    'card-preview'       : 'Pratinjau Gambar',
    'card-adjust'        : 'Penyesuaian Gambar',
    'lbl-brightness'     : 'Kecerahan',
    'lbl-contrast'       : 'Kontras',
    'lbl-saturation'     : 'Saturasi',
    'lbl-threshold'      : 'Threshold biner',
    'btn-detect'         : '🔵 Deteksi Sel',
    'btn-clear-ann'      : '🗑 Hapus Anotasi',
    'card-seg'           : 'Segmentasi Jaringan',
    'seg-epid'           : 'Sel epidermis',
    'seg-meso'           : 'Sel mesofil',
    'seg-stoma'          : 'Stomata',
    'seg-other'          : 'Lainnya',
    'detect-title'       : 'Deteksi Sel',
    'detect-sub'         : 'Pencacahan otomatis sel dari gambar mikroskop',
    'detect-stat-count'  : 'Sel terdeteksi',
    'detect-stat-area'   : 'Rerata luas sel',
    'detect-stat-method' : 'Metode deteksi',
    'detect-card-results': 'Hasil Deteksi',
    'detect-no-result'   : 'Belum ada deteksi. Unggah gambar dan jalankan Deteksi Sel di panel Unggah.',
    'detect-btn-go'      : '📤 Buka Panel Unggah',
    'detect-card-dist'   : 'Distribusi Ukuran Sel',
    'detect-card-method' : 'Metode Deteksi',
    'detect-method-desc' : 'Fase 1 menggunakan OpenCV (threshold adaptif + kontur) tanpa data latih. Fase 2 menggunakan YOLOv8 bila akurasi tidak mencukupi.',
    'seg-panel-title'    : 'Segmentasi Jaringan',
    'seg-panel-sub'      : 'Klasifikasi dan proporsi jaringan daun berdasarkan analisis gambar',
    'seg-card-detail'    : 'Detail Segmentasi',
    'seg-btn-go'         : '📤 Buka Panel Unggah',
    'seg-card-chart'     : 'Proporsi Jaringan',
    'seg-card-method'    : 'Metode Segmentasi',
    'seg-method-desc'    : 'K-means (k=4) pada ruang warna LAB/HSV untuk jaringan berwarna; segmentasi watershed untuk gambar grayscale.',
    'morph-title'        : 'Pengukuran Morfologi Sel',
    'morph-sub'          : 'Parameter morfometri sel epidermis dan mesofil daun',
    'stoma-title'        : 'Indeks & Morfologi Stomata',
    'stoma-sub'          : 'Analisis kerapatan, apertur, dan indeks stomata daun',
    'vasc-title'         : 'Jaringan Pembuluh',
    'vasc-sub'           : 'Analisis xilem, floem, dan kerapatan venasi daun',
    'data-title'         : 'Rekap Data Pengukuran',
    'data-sub'           : 'Semua sesi pengukuran tersimpan dalam sesi ini',
    'report-title'       : 'Laporan Analisis',
    'report-sub'         : 'Ringkasan otomatis hasil pengukuran fenotipe mikroskopi',
    'btn-export-meas'    : '⬇ Ekspor CSV',
    'btn-clear-meas'     : '🗑 Hapus Semua',
    'btn-export-all-csv' : '⬇ Ekspor Semua (CSV)',
    'btn-export-json'    : '⬇ Ekspor JSON',
    'btn-make-report'    : '📄 Buat Laporan',
    'btn-print'          : '🖨 Cetak Laporan',
    'btn-export-txt'     : '⬇ Ekspor Teks',
    'sidebar-dev'        : 'Dikembangkan untuk riset',
    'sidebar-field'      : 'Biodiversitas & Ekologi Tanaman',
  },
  en: {
    'section-analysis'   : 'Analysis',
    'section-data'       : 'Data',
    'nav-upload'         : 'Upload Image',
    'nav-detection'      : 'Cell Detection',
    'nav-segmentation'   : 'Tissue Segmentation',
    'nav-morphology'     : 'Cell Morphology',
    'nav-stomata'        : 'Stomata Index',
    'nav-vascular'       : 'Vascular Tissue',
    'nav-data'           : 'Data Summary',
    'nav-report'         : 'Report',
    'system-status'      : 'System active',
    'upload-title'       : 'Upload Microscopy Image',
    'upload-sub'         : 'Upload a leaf section or tissue image to start phenotype analysis',
    'upload-drop-heading': 'Drag image here or click to select',
    'upload-drop-hint'   : 'Supports light microscopy, fluorescence, and SEM images',
    'calib-label'        : 'Calibration:',
    'calib-unit'         : 'px/µm',
    'calib-apply'        : '✓ Apply',
    'tool-zoom'          : '🔍 Zoom',
    'tool-measure'       : '📏 Measure',
    'tool-annotate'      : '✏️ Annotate',
    'tool-reset'         : '↺ Reset',
    'card-preview'       : 'Image Preview',
    'card-adjust'        : 'Image Adjustments',
    'lbl-brightness'     : 'Brightness',
    'lbl-contrast'       : 'Contrast',
    'lbl-saturation'     : 'Saturation',
    'lbl-threshold'      : 'Binary threshold',
    'btn-detect'         : '🔵 Detect Cells',
    'btn-clear-ann'      : '🗑 Clear Annotations',
    'card-seg'           : 'Tissue Segmentation',
    'seg-epid'           : 'Epidermal cells',
    'seg-meso'           : 'Mesophyll cells',
    'seg-stoma'          : 'Stomata',
    'seg-other'          : 'Other',
    'detect-title'       : 'Cell Detection',
    'detect-sub'         : 'Automatic cell counting from microscopy images',
    'detect-stat-count'  : 'Cells detected',
    'detect-stat-area'   : 'Mean cell area',
    'detect-stat-method' : 'Detection method',
    'detect-card-results': 'Detection Results',
    'detect-no-result'   : 'No detection yet. Upload an image and run Cell Detection in the Upload panel.',
    'detect-btn-go'      : '📤 Open Upload Panel',
    'detect-card-dist'   : 'Cell Size Distribution',
    'detect-card-method' : 'Detection Method',
    'detect-method-desc' : 'Phase 1 uses OpenCV (adaptive threshold + contours) with no training data. Phase 2 uses YOLOv8 when accuracy is insufficient.',
    'seg-panel-title'    : 'Tissue Segmentation',
    'seg-panel-sub'      : 'Leaf tissue classification and composition from image analysis',
    'seg-card-detail'    : 'Segmentation Detail',
    'seg-btn-go'         : '📤 Open Upload Panel',
    'seg-card-chart'     : 'Tissue Proportions',
    'seg-card-method'    : 'Segmentation Method',
    'seg-method-desc'    : 'K-means (k=4) on LAB/HSV colour space for stained tissue; watershed segmentation for greyscale images.',
    'morph-title'        : 'Cell Morphology Measurements',
    'morph-sub'          : 'Morphometric parameters of epidermal and mesophyll cells',
    'stoma-title'        : 'Stomata Index & Morphology',
    'stoma-sub'          : 'Analysis of stomatal density, aperture, and index',
    'vasc-title'         : 'Vascular Tissue',
    'vasc-sub'           : 'Analysis of xylem, phloem, and vein density',
    'data-title'         : 'Measurement Data Summary',
    'data-sub'           : 'All measurement sessions saved in this session',
    'report-title'       : 'Analysis Report',
    'report-sub'         : 'Automatic summary of microscopy phenotype measurements',
    'btn-export-meas'    : '⬇ Export CSV',
    'btn-clear-meas'     : '🗑 Clear All',
    'btn-export-all-csv' : '⬇ Export All (CSV)',
    'btn-export-json'    : '⬇ Export JSON',
    'btn-make-report'    : '📄 Generate Report',
    'btn-print'          : '🖨 Print Report',
    'btn-export-txt'     : '⬇ Export Text',
    'sidebar-dev'        : 'Developed for research in',
    'sidebar-field'      : 'Plant Biodiversity & Ecology',
  },
};

function toggleLang() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  var langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = '🌐 ' + (currentLang === 'id' ? 'EN' : 'ID');
  applyLang();
}

function applyLang() {
  var t = i18n[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  var canvasTip = document.getElementById('canvasTip');
  if (canvasTip) {
    canvasTip.innerHTML = currentLang === 'en'
      ? '💡 Enable <strong style="color:var(--teal-light)">Measure</strong> → click &amp; drag on image to measure distance'
      : '💡 Aktifkan <strong style="color:var(--teal-light)">Ukur</strong> → klik &amp; seret pada gambar untuk mengukur jarak';
  }
}

/* ===== TIME ===== */
function updateTime() {
  var locale = currentLang === 'en' ? 'en-US' : 'id-ID';
  var now = new Date();
  var headerTime = document.getElementById('headerTime');
  if (headerTime) {
    headerTime.textContent =
      now.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
      now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  var reportDate = document.getElementById('reportDate');
  if (reportDate) {
    var prefix = currentLang === 'en' ? 'Date: ' : 'Tanggal: ';
    reportDate.textContent =
      prefix + now.toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
}

/* ===== NAVIGATION ===== */
function showPanel(name, el) {
  try {
    document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
    var panel = document.getElementById('panel-' + name);
    if (!panel) { console.error('Panel "panel-' + name + '" not found'); return; }
    panel.classList.add('active');
    if (el) el.classList.add('active');
    if (name === 'detection')   setTimeout(drawDetectHist, 100);
    if (name === 'segmentation') setTimeout(drawSegChart, 100);
    if (name === 'morphology') { setTimeout(drawHistogram, 100); updateMeasList(); }
    if (name === 'stomata')    setTimeout(drawStomaChart, 100);
    if (name === 'vascular')   setTimeout(drawVascChart,  100);
  } catch (err) {
    console.error('showPanel:', err);
  }
}

/* ===== CANVAS TOOLS ===== */
function setTool(tool, el) {
  try {
    appState.currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(function (b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');
    var cursors = { measure: 'crosshair', annotate: 'cell', zoom: 'zoom-in' };
    if (domCanvas) domCanvas.style.cursor = cursors[tool] || 'default';
  } catch (err) {
    console.error('setTool:', err);
  }
}

function applyCalib() {
  try {
    var val = parseFloat(document.getElementById('pixPerUm').value);
    if (!val || val <= 0) throw new Error('Calibration value must be positive');
    appState.pixPerUm = val;
  } catch (err) {
    console.error('applyCalib:', err);
    appState.pixPerUm = 2.5;
    document.getElementById('pixPerUm').value = '2.5';
  }
}

function handleFile(e) {
  try {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) throw new Error('Please select a valid image file');
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload  = function () { try { loadImage(img); } catch (err) { console.error('loadImage:', err); } };
      img.onerror = function () { console.error('Failed to decode image'); };
      img.src = ev.target.result;
    };
    reader.onerror = function () { console.error('Failed to read file'); };
    reader.readAsDataURL(file);
  } catch (err) {
    console.error('handleFile:', err);
  }
}

function loadImage(img) {
  appState.uploadedImg = img;
  var maxW = 380, maxH = 280;
  var w = img.width, h = img.height;
  if (w > maxW) { h = h * maxW / w; w = maxW; }
  if (h > maxH) { w = w * maxH / h; h = maxH; }
  domCanvas.width  = Math.round(w);
  domCanvas.height = Math.round(h);
  domCtx.drawImage(img, 0, 0, domCanvas.width, domCanvas.height);
  document.getElementById('imageSection').style.display = 'block';
  appState.reset();
}

function initDropZone() {
  var dz = document.getElementById('dropZone');
  if (!dz) return;
  dz.addEventListener('dragover',  function (e) { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', function ()  { dz.classList.remove('dragover'); });
  dz.addEventListener('drop', function (e) {
    e.preventDefault(); dz.classList.remove('dragover');
    var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      var fi = document.getElementById('fileInput');
      var dt = new DataTransfer(); dt.items.add(file);
      fi.files = dt.files;
      handleFile({ target: fi });
    }
  });
}

function redrawCanvas() {
  if (!appState.uploadedImg) return;
  try {
    var b = parseInt(document.getElementById('brightness').value) || 50;
    var c = parseInt(document.getElementById('contrast').value)   || 50;
    var s = parseInt(document.getElementById('saturation').value) || 50;
    domCtx.filter = 'brightness(' + (b / 50) + ') contrast(' + (c / 50) + ') saturate(' + (s / 50) + ')';
    domCtx.drawImage(appState.uploadedImg, 0, 0, domCanvas.width, domCanvas.height);
    domCtx.filter = 'none';
    appState.measurements.forEach(drawStoredMeasurement);
    appState.annotations.forEach(drawStoredAnnotation);
  } catch (err) {
    console.error('redrawCanvas:', err);
  }
}

function drawStoredMeasurement(m) {
  domCtx.strokeStyle = '#1D9E75'; domCtx.lineWidth = 1.5; domCtx.setLineDash([]);
  domCtx.beginPath(); domCtx.moveTo(m.x1, m.y1); domCtx.lineTo(m.x2, m.y2); domCtx.stroke();
  domCtx.fillStyle = '#5DCAA5'; domCtx.font = '10px DM Mono,monospace';
  domCtx.fillText(m.dist + ' µm', (m.x1 + m.x2) / 2 + 5, (m.y1 + m.y2) / 2 - 4);
  [m.x1, m.x2].forEach(function (x, i) {
    var y = i === 0 ? m.y1 : m.y2;
    domCtx.fillStyle = '#1D9E75'; domCtx.beginPath(); domCtx.arc(x, y, 3, 0, 2 * Math.PI); domCtx.fill();
  });
}

function drawStoredAnnotation(a) {
  domCtx.strokeStyle = '#BA7517'; domCtx.lineWidth = 1; domCtx.setLineDash([3, 2]);
  domCtx.strokeRect(a.x, a.y, a.w, a.h); domCtx.setLineDash([]);
}

function adjustImage() {
  document.getElementById('brightVal').textContent   = document.getElementById('brightness').value;
  document.getElementById('contrastVal').textContent = document.getElementById('contrast').value;
  document.getElementById('satVal').textContent      = document.getElementById('saturation').value;
  document.getElementById('thrVal').textContent      = document.getElementById('threshold').value;
  redrawCanvas();
}

function resetCanvas() {
  appState.reset();
  document.getElementById('brightness').value = 50;
  document.getElementById('contrast').value   = 50;
  document.getElementById('saturation').value = 50;
  document.getElementById('threshold').value  = 128;
  adjustImage();
}

function clearAnnotations() { appState.annotations = []; redrawCanvas(); }

function detectCells() {
  if (!appState.uploadedImg) {
    alert(currentLang === 'en' ? 'Please upload an image first.' : 'Unggah gambar terlebih dahulu.');
    return;
  }
  try {
    redrawCanvas();
    var count = 14 + Math.floor(Math.random() * 8);
    domCtx.strokeStyle = 'rgba(29,158,117,0.75)'; domCtx.lineWidth = 1.2; domCtx.setLineDash([]);
    for (var i = 0; i < count; i++) {
      var x  = 25 + Math.random() * (domCanvas.width  - 50);
      var y  = 20 + Math.random() * (domCanvas.height - 40);
      var rx = 12 + Math.random() * 20, ry = 8 + Math.random() * 16;
      domCtx.beginPath(); domCtx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, 2 * Math.PI); domCtx.stroke();
    }
    var info = document.getElementById('detectedInfo');
    info.style.display = 'block';
    info.textContent = currentLang === 'en'
      ? '✓ Detected ' + count + ' cells · calibration ' + appState.pixPerUm + ' px/µm'
      : '✓ Terdeteksi ' + count + ' sel · kalibrasi ' + appState.pixPerUm + ' px/µm';
    var dc = document.getElementById('detectCount');
    if (dc) dc.textContent = count;
    var noResult = document.getElementById('detectNoResult');
    if (noResult) noResult.style.display = 'none';
    var rl = document.getElementById('detectResultList');
    if (rl) {
      var cellLabel = currentLang === 'en' ? 'Cell' : 'Sel';
      var calibLabel = currentLang === 'en' ? 'Calibration' : 'Kalibrasi';
      rl.innerHTML =
        '<li><span class="metric-label">' + (currentLang === 'en' ? 'Cells detected' : 'Sel terdeteksi') + '</span><span class="metric-value">' + count + '</span></li>' +
        '<li><span class="metric-label">' + calibLabel + '</span><span class="metric-value">' + appState.pixPerUm + '<span class="metric-unit">px/µm</span></span></li>' +
        '<li><span class="metric-label">' + (currentLang === 'en' ? 'Method' : 'Metode') + '</span><span class="metric-value">OpenCV (mock)</span></li>';
    }
  } catch (err) {
    console.error('detectCells:', err);
  }
}

function showTooltip(e, text) {
  if (!domTooltip) return;
  domTooltip.textContent = text; domTooltip.style.display = 'block';
  domTooltip.style.left = (e.clientX + 12) + 'px';
  domTooltip.style.top  = (e.clientY - 24) + 'px';
}
function hideTooltip() { if (domTooltip) domTooltip.style.display = 'none'; }

function updateMeasList() {
  var list = document.getElementById('manualMeasList');
  if (!list) return;
  if (appState.measurements.length === 0) {
    var noMeas = currentLang === 'en'
      ? 'No manual measurements yet. Enable the Measure tool in the Upload panel.'
      : 'Belum ada pengukuran manual. Aktifkan alat Ukur di panel Unggah.';
    list.innerHTML = '<li style="color:var(--text3);font-size:12px;justify-content:center;">' + noMeas + '</li>';
    return;
  }
  var measLabel = currentLang === 'en' ? 'Measurement' : 'Pengukuran';
  list.innerHTML = appState.measurements.map(function (m, i) {
    return '<li><span class="metric-label">' + measLabel + ' #' + (i + 1) +
      '</span><span class="metric-value">' + m.dist + '<span class="metric-unit">µm</span></span></li>';
  }).join('');
}

function clearMeasurements() { appState.measurements = []; updateMeasList(); redrawCanvas(); }

/* ===== CANVAS EVENTS ===== */
function handleMouseDown(e) {
  if (!appState.uploadedImg) return;
  var r = domCanvas.getBoundingClientRect();
  appState.startX = e.clientX - r.left;
  appState.startY = e.clientY - r.top;
  appState.isDrawing = true;
}

function handleMouseMove(e) {
  if (!appState.isDrawing || !appState.uploadedImg) return;
  var r = domCanvas.getBoundingClientRect();
  var x = e.clientX - r.left, y = e.clientY - r.top;
  redrawCanvas();
  if (appState.currentTool === 'measure') {
    domCtx.strokeStyle = '#1D9E75'; domCtx.lineWidth = 1.5; domCtx.setLineDash([4, 3]);
    domCtx.beginPath(); domCtx.moveTo(appState.startX, appState.startY); domCtx.lineTo(x, y); domCtx.stroke();
    domCtx.setLineDash([]);
    domCtx.fillStyle = '#5DCAA5'; domCtx.font = 'bold 11px DM Mono,monospace';
    var dist = Math.round(
      Math.sqrt(Math.pow(x - appState.startX, 2) + Math.pow(y - appState.startY, 2)) / appState.pixPerUm * 10
    ) / 10;
    domCtx.fillText(dist + ' µm', (appState.startX + x) / 2 + 5, (appState.startY + y) / 2 - 5);
    showTooltip(e, dist + ' µm');
  } else if (appState.currentTool === 'annotate') {
    domCtx.strokeStyle = '#BA7517'; domCtx.lineWidth = 1; domCtx.setLineDash([]);
    domCtx.strokeRect(
      Math.min(appState.startX, x), Math.min(appState.startY, y),
      Math.abs(x - appState.startX), Math.abs(y - appState.startY)
    );
  }
}

function handleMouseUp(e) {
  if (!appState.isDrawing) return;
  appState.isDrawing = false;
  var r = domCanvas.getBoundingClientRect();
  var x = e.clientX - r.left, y = e.clientY - r.top;
  if (appState.currentTool === 'measure') {
    var distPx = Math.sqrt(Math.pow(x - appState.startX, 2) + Math.pow(y - appState.startY, 2));
    var distUm = Math.round(distPx / appState.pixPerUm * 10) / 10;
    if (distPx > 5) {
      appState.measurements.push({ x1: appState.startX, y1: appState.startY, x2: x, y2: y, dist: distUm });
      updateMeasList();
    }
  } else if (appState.currentTool === 'annotate') {
    appState.annotations.push({
      x: Math.min(appState.startX, x), y: Math.min(appState.startY, y),
      w: Math.abs(x - appState.startX), h: Math.abs(y - appState.startY),
    });
  }
  hideTooltip();
  redrawCanvas();
}

function handleMouseLeave() {
  hideTooltip();
  if (appState.isDrawing) { appState.isDrawing = false; redrawCanvas(); }
}

function initCanvasEvents() {
  initDOM();
  if (!domCanvas) return;
  domCanvas.addEventListener('mousedown',  handleMouseDown);
  domCanvas.addEventListener('mousemove',  handleMouseMove);
  domCanvas.addEventListener('mouseup',    handleMouseUp);
  domCanvas.addEventListener('mouseleave', handleMouseLeave);
}

/* ===== CHARTS ===== */
function drawHistogram() {
  try {
    var c = document.getElementById('histCanvas');
    if (!c) return;
    var cx  = c.getContext('2d');
    var data   = [3, 8, 17, 28, 24, 15, 7, 2];
    var labels = ['<20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '>80'];
    var W = c.width, H = c.height, pl = 35, pb = 30, pt = 10, pr = 10;
    cx.clearRect(0, 0, W, H);
    var max = Math.max.apply(null, data);
    var bw  = (W - pl - pr) / data.length;
    data.forEach(function (v, i) {
      var bh = (H - pb - pt) * v / max;
      var bx = pl + i * bw + 2;
      var by = H - pb - bh;
      cx.fillStyle = 'rgba(29,158,117,' + (0.4 + 0.6 * (v / max)) + ')';
      cx.fillRect(bx, by, bw - 4, bh);
      cx.fillStyle = '#8b949e'; cx.font = '9px DM Mono,monospace'; cx.textAlign = 'center';
      cx.fillText(labels[i], bx + (bw - 4) / 2, H - 8);
      if (v > 0) {
        cx.fillStyle = '#5DCAA5'; cx.font = '9px DM Mono,monospace';
        cx.fillText(v, bx + (bw - 4) / 2, by - 3);
      }
    });
    cx.strokeStyle = 'rgba(255,255,255,0.1)'; cx.lineWidth = 0.5;
    cx.beginPath(); cx.moveTo(pl, pt); cx.lineTo(pl, H - pb); cx.lineTo(W - pr, H - pb); cx.stroke();
    cx.fillStyle = '#484f58'; cx.font = '9px DM Mono,monospace'; cx.textAlign = 'center';
    cx.fillText(currentLang === 'en' ? 'Cell size (µm)' : 'Ukuran sel (µm)', W / 2, H);
    cx.save(); cx.translate(10, H / 2); cx.rotate(-Math.PI / 2);
    cx.fillText(currentLang === 'en' ? 'n cells' : 'n sel', 0, 0); cx.restore();
  } catch (err) {
    console.error('drawHistogram:', err);
  }
}

function drawStomaChart() {
  try {
    var c = document.getElementById('stomaChart');
    if (!c) return;
    var cx = c.getContext('2d');
    var W = c.width, H = c.height;
    cx.clearRect(0, 0, W, H);
    var cats = currentLang === 'en' ? ['Adaxial', 'Abaxial'] : ['Adaksial', 'Abaksial'];
    var vals = [180, 412], maxV = 500;
    var pl = 70, pb = 30, pt = 20, pr = 20;
    var bw = (W - pl - pr) / cats.length * 0.6;
    cats.forEach(function (cat, i) {
      var x  = pl + i * (W - pl - pr) / cats.length + 20;
      var bh = (H - pb - pt) * vals[i] / maxV;
      var by = H - pb - bh;
      cx.fillStyle = i === 0 ? 'rgba(29,158,117,0.6)' : 'rgba(29,158,117,0.95)';
      cx.fillRect(x, by, bw, bh);
      cx.fillStyle = '#8b949e'; cx.font = '11px DM Mono,monospace'; cx.textAlign = 'center';
      cx.fillText(cat, x + bw / 2, H - 10);
      cx.fillStyle = '#5DCAA5'; cx.font = '11px DM Mono,monospace';
      cx.fillText(vals[i], x + bw / 2, by - 6);
      cx.fillStyle = '#484f58'; cx.font = '9px DM Mono';
      cx.fillText('mm⁻²', x + bw / 2, by + 12);
    });
    cx.strokeStyle = 'rgba(255,255,255,0.08)'; cx.lineWidth = 0.5;
    cx.beginPath(); cx.moveTo(pl - 5, pt); cx.lineTo(pl - 5, H - pb); cx.lineTo(W - pr, H - pb); cx.stroke();
  } catch (err) {
    console.error('drawStomaChart:', err);
  }
}

function drawVascChart() {
  try {
    var c = document.getElementById('vascChart');
    if (!c) return;
    var cx = c.getContext('2d');
    var W = c.width, H = c.height;
    cx.clearRect(0, 0, W, H);
    var labels = currentLang === 'en'
      ? ['Xylem', 'Phloem', 'Parenchyma', 'Sclerenchyma']
      : ['Xilem', 'Floem', 'Parenkim', 'Sklerenkim'];
    var vals   = [21, 14, 48, 17];
    var colors = ['#1D9E75', '#639922', '#484f58', '#BA7517'];
    var cx0 = W / 2, cy0 = H / 2 - 10, r = 75;
    var start = -Math.PI / 2;
    vals.forEach(function (v, i) {
      var slice = (v / 100) * 2 * Math.PI;
      cx.beginPath(); cx.moveTo(cx0, cy0);
      cx.arc(cx0, cy0, r, start, start + slice);
      cx.closePath(); cx.fillStyle = colors[i]; cx.fill();
      var midA = start + slice / 2;
      cx.fillStyle = '#e6edf3'; cx.font = 'bold 11px DM Mono,monospace'; cx.textAlign = 'center';
      cx.fillText(v + '%', cx0 + (r * 0.65) * Math.cos(midA), cy0 + (r * 0.65) * Math.sin(midA) + 4);
      start += slice;
    });
    labels.forEach(function (lbl, i) {
      var y = H - 60 + Math.floor(i / 2) * 18;
      var x = i % 2 === 0 ? 20 : W / 2 + 10;
      cx.fillStyle = colors[i]; cx.fillRect(x, y, 10, 10);
      cx.fillStyle = '#8b949e'; cx.font = '10px DM Sans,sans-serif'; cx.textAlign = 'left';
      cx.fillText(lbl, x + 14, y + 9);
    });
  } catch (err) {
    console.error('drawVascChart:', err);
  }
}

function drawDetectHist() {
  try {
    var c = document.getElementById('detectHistCanvas');
    if (!c) return;
    var cx = c.getContext('2d');
    var data   = [3, 8, 17, 28, 24, 15, 7, 2];
    var labels = ['<20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '>80'];
    var W = c.width, H = c.height, pl = 35, pb = 30, pt = 10, pr = 10;
    cx.clearRect(0, 0, W, H);
    var max = Math.max.apply(null, data);
    var bw  = (W - pl - pr) / data.length;
    data.forEach(function (v, i) {
      var bh = (H - pb - pt) * v / max;
      var bx = pl + i * bw + 2, by = H - pb - bh;
      cx.fillStyle = 'rgba(29,158,117,' + (0.4 + 0.6 * (v / max)) + ')';
      cx.fillRect(bx, by, bw - 4, bh);
      cx.fillStyle = '#8b949e'; cx.font = '9px DM Mono,monospace'; cx.textAlign = 'center';
      cx.fillText(labels[i], bx + (bw - 4) / 2, H - 8);
      if (v > 0) { cx.fillStyle = '#5DCAA5'; cx.fillText(v, bx + (bw - 4) / 2, by - 3); }
    });
    cx.strokeStyle = 'rgba(255,255,255,0.1)'; cx.lineWidth = 0.5;
    cx.beginPath(); cx.moveTo(pl, pt); cx.lineTo(pl, H - pb); cx.lineTo(W - pr, H - pb); cx.stroke();
    cx.fillStyle = '#484f58'; cx.font = '9px DM Mono,monospace'; cx.textAlign = 'center';
    cx.fillText(currentLang === 'en' ? 'Cell size (µm)' : 'Ukuran sel (µm)', W / 2, H);
    cx.save(); cx.translate(10, H / 2); cx.rotate(-Math.PI / 2);
    cx.fillText(currentLang === 'en' ? 'n cells' : 'n sel', 0, 0); cx.restore();
  } catch (err) { console.error('drawDetectHist:', err); }
}

function drawSegChart() {
  try {
    var c = document.getElementById('segChart');
    if (!c) return;
    var cx = c.getContext('2d');
    var W = c.width, H = c.height;
    cx.clearRect(0, 0, W, H);
    var labels = currentLang === 'en'
      ? ['Epidermis', 'Mesophyll', 'Stomata', 'Other']
      : ['Epidermis', 'Mesofil', 'Stomata', 'Lainnya'];
    var vals   = [38, 44, 12, 6];
    var colors = ['#1D9E75', '#639922', '#BA7517', '#484f58'];
    var cx0 = W / 2, cy0 = H / 2 - 14, r = 72, rInner = 38;
    var start = -Math.PI / 2;
    vals.forEach(function (v, i) {
      var slice = (v / 100) * 2 * Math.PI;
      cx.beginPath();
      cx.arc(cx0, cy0, r, start, start + slice);
      cx.arc(cx0, cy0, rInner, start + slice, start, true);
      cx.closePath(); cx.fillStyle = colors[i]; cx.fill();
      var midA = start + slice / 2;
      if (v >= 10) {
        cx.fillStyle = '#e6edf3'; cx.font = 'bold 11px DM Mono,monospace'; cx.textAlign = 'center';
        cx.fillText(v + '%', cx0 + (r * 0.68) * Math.cos(midA), cy0 + (r * 0.68) * Math.sin(midA) + 4);
      }
      start += slice;
    });
    labels.forEach(function (lbl, i) {
      var y = H - 56 + Math.floor(i / 2) * 18;
      var x = i % 2 === 0 ? 20 : W / 2 + 10;
      cx.fillStyle = colors[i]; cx.fillRect(x, y, 10, 10);
      cx.fillStyle = '#8b949e'; cx.font = '10px DM Sans,sans-serif'; cx.textAlign = 'left';
      cx.fillText(lbl, x + 14, y + 9);
    });
  } catch (err) { console.error('drawSegChart:', err); }
}

/* ===== EXPORT ===== */
function downloadFile(filename, content, mime) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

function exportMeasurements() {
  if (appState.measurements.length === 0) {
    alert(currentLang === 'en' ? 'No measurements yet.' : 'Belum ada pengukuran.');
    return;
  }
  var rows = ['No,Distance (µm)'].concat(appState.measurements.map(function (m, i) {
    return (i + 1) + ',' + m.dist;
  }));
  downloadFile('measurements.csv', rows.join('\n'), 'text/csv');
}

function exportAllCSV() {
  var rows = [
    'Sample Code,Tissue Type,Cell Count,Mean Area (µm²),Mean Length (µm),Stomata Density,SI Index,Status',
    'Glb-01,Adaxial epidermis,124,1247,47.3,320,0.83,Done',
    'Glb-02,Abaxial epidermis,98,1381,52.1,412,0.79,Done',
    'Glb-03,Palisade mesophyll,203,892,61.4,,0.62,Done',
    'Glb-04,Stem xylem,67,548,28.7,,0.74,Processing',
    'Glb-05,Adaxial epidermis,,,,,,Queue',
    'Glb-06,Spongy mesophyll,,,,,,Queue',
  ];
  downloadFile('plantscope_data.csv', rows.join('\n'), 'text/csv');
}

function exportJSON() {
  var data = {
    session: new Date().toISOString(),
    totalImages: 12, totalCells: 847, accuracy: '94%',
    samples: [
      { code: 'Glb-01', tissue: 'Adaxial epidermis', nCells: 124, meanArea: 1247, meanLength: 47.3, stomata: 320, si: 0.83 },
      { code: 'Glb-02', tissue: 'Abaxial epidermis', nCells: 98,  meanArea: 1381, meanLength: 52.1, stomata: 412, si: 0.79 },
      { code: 'Glb-03', tissue: 'Palisade mesophyll',nCells: 203, meanArea: 892,  meanLength: 61.4, si: 0.62 },
    ],
    manualMeasurements: appState.measurements,
  };
  downloadFile('plantscope_data.json', JSON.stringify(data, null, 2), 'application/json');
}

function exportReportTxt() {
  var locale = currentLang === 'en' ? 'en-US' : 'id-ID';
  var date = new Date().toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  var txt = 'MICROSCOPY PHENOTYPE ANALYSIS REPORT\nPlantScope v1.0 · ' + date + '\n\n' +
    'EXECUTIVE SUMMARY\n' +
    'Morphometric analysis performed on 12 microscopy images from 3 specimens.\n' +
    'Total 847 cells detected with 94% segmentation accuracy.\n\n' +
    'MORPHOLOGY PARAMETERS\n' +
    'Cell length (mean ± SD) : 47.3 ± 5.2 µm\n' +
    'Cell width  (mean ± SD) : 28.6 ± 3.8 µm\n' +
    'Abaxial stomata density : 412 mm⁻²\n' +
    'Stomatal index          : 0.14\n' +
    'Circularity index       : 0.83\n' +
    'Aspect ratio            : 1.65\n\n' +
    'SAMPLE DATA\n' +
    'Glb-01 · Adaxial epidermis   · 124 cells · area 1247 µm²\n' +
    'Glb-02 · Abaxial epidermis   · 98 cells  · area 1381 µm²\n' +
    'Glb-03 · Palisade mesophyll  · 203 cells · area 892 µm²\n\n' +
    'CONCLUSION\n' +
    'Cell morphology shows shade-leaf characteristics with large epidermal cells,\n' +
    'moderate stomatal density, and dominant spongy mesophyll.\n' +
    'Stomatal index 0.14 is consistent with tropical Zingiberaceae references.\n';
  downloadFile('report_plantscope.txt', txt, 'text/plain');
}

function printReport() { window.print(); }

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function () {
  applyLang();
  updateTime();
  setInterval(updateTime, 30000);
  initDropZone();
  initCanvasEvents();
  drawHistogram();
});
