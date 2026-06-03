/**
 * Main Application Logic
 * Handles initialization, state management, and core functionality
 */

// ===== APPLICATION STATE =====
const AppState = {
  uploadedImg: null,
  currentTool: 'zoom',
  isDrawing: false,
  startX: 0,
  startY: 0,
  measurements: [],
  annotations: [],
  pixPerUm: 2.5,

  reset() {
    this.measurements = [];
    this.annotations = [];
  },
};

// ===== DOM ELEMENTS =====
const DOM = {
  canvas: null,
  ctx: null,
  headerTime: null,
  reportDate: null,
  fileInput: null,
  dropZone: null,
  imageSection: null,
  brightVal: null,
  contrastVal: null,
  satVal: null,
  thrVal: null,
  pixPerUmInput: null,

  init() {
    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.headerTime = document.getElementById('headerTime');
    this.reportDate = document.getElementById('reportDate');
    this.fileInput = document.getElementById('fileInput');
    this.dropZone = document.getElementById('dropZone');
    this.imageSection = document.getElementById('imageSection');
    this.brightVal = document.getElementById('brightVal');
    this.contrastVal = document.getElementById('contrastVal');
    this.satVal = document.getElementById('satVal');
    this.thrVal = document.getElementById('thrVal');
    this.pixPerUmInput = document.getElementById('pixPerUm');
  },
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  DOM.init();
  initializeEventListeners();
  updateTime();
  setInterval(updateTime, 30000);
});

// ===== TIME MANAGEMENT =====
function updateTime() {
  if (!DOM.headerTime || !DOM.reportDate) return;

  const now = new Date();

  DOM.headerTime.textContent =
    now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) +
    ' · ' +
    now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

  DOM.reportDate.textContent =
    'Tanggal: ' +
    now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
}

// ===== NAVIGATION =====
function showPanel(name, el) {
  try {
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));

    const panel = document.getElementById('panel-' + name);
    if (!panel) {
      console.error(`Panel "panel-${name}" not found`);
      return;
    }

    panel.classList.add('active');
    if (el) el.classList.add('active');

    // Trigger drawing functions on panel activation
    if (name === 'morphology') {
      setTimeout(drawHistogram, 100);
      updateMeasList();
    }
    if (name === 'stomata') setTimeout(drawStomaChart, 100);
    if (name === 'vascular') setTimeout(drawVascChart, 100);
  } catch (error) {
    console.error('Error showing panel:', error);
  }
}

// ===== EVENT LISTENERS INITIALIZATION =====
function initializeEventListeners() {
  // File upload
  if (DOM.fileInput) {
    DOM.fileInput.addEventListener('change', handleFile);
  }

  // Drag and drop
  if (DOM.dropZone) {
    DOM.dropZone.addEventListener('dragover', handleDragOver);
    DOM.dropZone.addEventListener('dragleave', handleDragLeave);
    DOM.dropZone.addEventListener('drop', handleDrop);
    DOM.dropZone.addEventListener('click', () => DOM.fileInput?.click());
  }

  // Canvas interactions
  if (DOM.canvas) {
    DOM.canvas.addEventListener('mousedown', handleCanvasMouseDown);
    DOM.canvas.addEventListener('mousemove', handleCanvasMouseMove);
    DOM.canvas.addEventListener('mouseup', handleCanvasMouseUp);
    DOM.canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
  }

  // Image adjustment sliders
  const brightnessInput = document.getElementById('brightness');
  const contrastInput = document.getElementById('contrast');
  const saturationInput = document.getElementById('saturation');
  const thresholdInput = document.getElementById('threshold');

  if (brightnessInput) brightnessInput.addEventListener('input', adjustImage);
  if (contrastInput) contrastInput.addEventListener('input', adjustImage);
  if (saturationInput) saturationInput.addEventListener('input', adjustImage);
  if (thresholdInput) thresholdInput.addEventListener('input', adjustImage);
}

// ===== ERROR HANDLING UTILITY =====
function handleError(error, context = '') {
  console.error(`Error ${context}:`, error);
  const message = error instanceof Error ? error.message : String(error);
  alert(`An error occurred${context ? ` (${context})` : ''}: ${message}`);
}

// ===== FILE UPLOAD =====
function handleFile(event) {
  try {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    const reader = new FileReader();

    reader.onload = (ev) => {
      try {
        const img = new Image();

        img.onload = () => {
          try {
            loadImage(img);
          } catch (error) {
            handleError(error, 'loading image');
          }
        };

        img.onerror = () => {
          throw new Error('Failed to load image');
        };

        img.src = ev.target?.result as string;
      } catch (error) {
        handleError(error, 'processing image');
      }
    };

    reader.onerror = () => {
      throw new Error('Failed to read file');
    };

    reader.readAsDataURL(file);
  } catch (error) {
    handleError(error, 'file upload');
  }
}

function loadImage(img) {
  AppState.uploadedImg = img;

  const maxW = 380;
  const maxH = 280;
  let w = img.width;
  let h = img.height;

  // Maintain aspect ratio
  if (w > maxW) {
    h = (h * maxW) / w;
    w = maxW;
  }
  if (h > maxH) {
    w = (w * maxH) / h;
    h = maxH;
  }

  DOM.canvas.width = Math.round(w);
  DOM.canvas.height = Math.round(h);

  DOM.ctx.drawImage(AppState.uploadedImg, 0, 0, DOM.canvas.width, DOM.canvas.height);

  if (DOM.imageSection) {
    DOM.imageSection.style.display = 'block';
  }

  AppState.reset();
}

// ===== DRAG & DROP =====
function handleDragOver(e) {
  e.preventDefault();
  DOM.dropZone.classList.add('dragover');
}

function handleDragLeave() {
  DOM.dropZone.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  DOM.dropZone.classList.remove('dragover');

  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    const dt = new DataTransfer();
    dt.items.add(file);
    DOM.fileInput.files = dt.files;
    handleFile({ target: DOM.fileInput });
  }
}

// ===== TOOL MANAGEMENT =====
function setTool(tool, el) {
  try {
    AppState.currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach((b) => b.classList.remove('active'));
    if (el) el.classList.add('active');

    const cursorMap = {
      measure: 'crosshair',
      annotate: 'cell',
      zoom: 'zoom-in',
    };

    DOM.canvas.style.cursor = cursorMap[tool] || 'default';
  } catch (error) {
    handleError(error, 'setting tool');
  }
}

function applyCalib() {
  try {
    AppState.pixPerUm = parseFloat(DOM.pixPerUmInput.value) || 2.5;
    if (AppState.pixPerUm <= 0) {
      throw new Error('Calibration value must be positive');
    }
  } catch (error) {
    handleError(error, 'applying calibration');
    AppState.pixPerUm = 2.5;
    DOM.pixPerUmInput.value = '2.5';
  }
}

// ===== CANVAS INTERACTIONS =====
function handleCanvasMouseDown(e) {
  if (!AppState.uploadedImg) return;

  const rect = DOM.canvas.getBoundingClientRect();
  AppState.startX = e.clientX - rect.left;
  AppState.startY = e.clientY - rect.top;
  AppState.isDrawing = true;
}

function handleCanvasMouseMove(e) {
  if (!AppState.isDrawing || !AppState.uploadedImg) return;

  const rect = DOM.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  redrawCanvas();

  if (AppState.currentTool === 'measure') {
    drawMeasureLine(x, y);
  } else if (AppState.currentTool === 'annotate') {
    drawAnnotationBox(x, y);
  }
}

function handleCanvasMouseUp(e) {
  if (!AppState.isDrawing) return;
  AppState.isDrawing = false;

  const rect = DOM.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (AppState.currentTool === 'measure') {
    saveMeasurement(x, y);
  } else if (AppState.currentTool === 'annotate') {
    saveAnnotation(x, y);
  }

  hideTooltip();
  redrawCanvas();
}

function handleCanvasMouseLeave() {
  hideTooltip();
  if (AppState.isDrawing) {
    AppState.isDrawing = false;
    redrawCanvas();
  }
}

// ===== IMAGE ADJUSTMENT =====
function adjustImage() {
  try {
    if (DOM.brightVal) DOM.brightVal.textContent = document.getElementById('brightness').value;
    if (DOM.contrastVal) DOM.contrastVal.textContent = document.getElementById('contrast').value;
    if (DOM.satVal) DOM.satVal.textContent = document.getElementById('saturation').value;
    if (DOM.thrVal) DOM.thrVal.textContent = document.getElementById('threshold').value;

    redrawCanvas();
  } catch (error) {
    handleError(error, 'adjusting image');
  }
}

function redrawCanvas() {
  if (!AppState.uploadedImg) return;

  try {
    const brightness = parseInt(document.getElementById('brightness').value) || 50;
    const contrast = parseInt(document.getElementById('contrast').value) || 50;
    const saturation = parseInt(document.getElementById('saturation').value) || 50;

    DOM.ctx.filter = `brightness(${brightness / 50}) contrast(${contrast / 50}) saturate(${saturation / 50})`;
    DOM.ctx.drawImage(
      AppState.uploadedImg,
      0,
      0,
      DOM.canvas.width,
      DOM.canvas.height
    );
    DOM.ctx.filter = 'none';

    // Redraw all measurements
    AppState.measurements.forEach((m) => {
      drawStoredMeasurement(m);
    });

    // Redraw all annotations
    AppState.annotations.forEach((a) => {
      drawStoredAnnotation(a);
    });
  } catch (error) {
    handleError(error, 'redrawing canvas');
  }
}

// ===== MEASUREMENT DRAWING =====
function drawMeasureLine(x, y) {
  const dist =
    Math.round(
      (Math.sqrt((x - AppState.startX) ** 2 + (y - AppState.startY) ** 2) /
        AppState.pixPerUm) *
        10
    ) / 10;

  DOM.ctx.strokeStyle = '#1D9E75';
  DOM.ctx.lineWidth = 1.5;
  DOM.ctx.setLineDash([4, 3]);
  DOM.ctx.beginPath();
  DOM.ctx.moveTo(AppState.startX, AppState.startY);
  DOM.ctx.lineTo(x, y);
  DOM.ctx.stroke();
  DOM.ctx.setLineDash([]);

  DOM.ctx.fillStyle = '#5DCAA5';
  DOM.ctx.font = 'bold 11px "DM Mono", monospace';
  DOM.ctx.fillText(`${dist} µm`, (AppState.startX + x) / 2 + 5, (AppState.startY + y) / 2 - 5);

  showTooltip(event, `${dist} µm`);
}

function drawStoredMeasurement(m) {
  DOM.ctx.strokeStyle = '#1D9E75';
  DOM.ctx.lineWidth = 1.5;
  DOM.ctx.setLineDash([]);
  DOM.ctx.beginPath();
  DOM.ctx.moveTo(m.x1, m.y1);
  DOM.ctx.lineTo(m.x2, m.y2);
  DOM.ctx.stroke();

  DOM.ctx.fillStyle = '#5DCAA5';
  DOM.ctx.font = '10px "DM Mono", monospace';
  DOM.ctx.fillText(`${m.dist} µm`, (m.x1 + m.x2) / 2 + 5, (m.y1 + m.y2) / 2 - 4);

  // Endpoint dots
  [m.x1, m.x2].forEach((px, i) => {
    const py = i === 0 ? m.y1 : m.y2;
    DOM.ctx.fillStyle = '#1D9E75';
    DOM.ctx.beginPath();
    DOM.ctx.arc(px, py, 3, 0, 2 * Math.PI);
    DOM.ctx.fill();
  });
}

function saveMeasurement(x, y) {
  const distPx = Math.sqrt((x - AppState.startX) ** 2 + (y - AppState.startY) ** 2);
  const distUm = Math.round((distPx / AppState.pixPerUm) * 10) / 10;

  if (distPx > 5) {
    AppState.measurements.push({
      x1: AppState.startX,
      y1: AppState.startY,
      x2: x,
      y2: y,
      dist: distUm,
    });
    updateMeasList();
  }
}

// ===== ANNOTATION DRAWING =====
function drawAnnotationBox(x, y) {
  DOM.ctx.strokeStyle = '#BA7517';
  DOM.ctx.lineWidth = 1;
  DOM.ctx.setLineDash([]);
  DOM.ctx.strokeRect(
    Math.min(AppState.startX, x),
    Math.min(AppState.startY, y),
    Math.abs(x - AppState.startX),
    Math.abs(y - AppState.startY)
  );
}

function drawStoredAnnotation(a) {
  DOM.ctx.strokeStyle = '#BA7517';
  DOM.ctx.lineWidth = 1;
  DOM.ctx.setLineDash([3, 2]);
  DOM.ctx.strokeRect(a.x, a.y, a.w, a.h);
  DOM.ctx.setLineDash([]);
}

function saveAnnotation(x, y) {
  AppState.annotations.push({
    x: Math.min(AppState.startX, x),
    y: Math.min(AppState.startY, y),
    w: Math.abs(x - AppState.startX),
    h: Math.abs(y - AppState.startY),
  });
}

// ===== UTILITY FUNCTIONS =====
function showTooltip(e, text) {
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;
  tooltip.textContent = text;
  tooltip.style.display = 'block';
  tooltip.style.left = `${e.clientX + 10}px`;
  tooltip.style.top = `${e.clientY + 10}px`;
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

function updateMeasList() {
  // Placeholder for updating measurement list
  console.log('Measurements:', AppState.measurements);
}

function resetCanvas() {
  if (!AppState.uploadedImg) return;
  AppState.reset();
  DOM.canvas.width = DOM.canvas.width; // Clear canvas
  loadImage(AppState.uploadedImg);
}

function clearAnnotations() {
  AppState.annotations = [];
  redrawCanvas();
}

function clearMeasurements() {
  AppState.measurements = [];
  updateMeasList();
  redrawCanvas();
}

// ===== PLACEHOLDER FUNCTIONS (to be implemented) =====
function drawHistogram() {
  console.log('drawHistogram not yet implemented');
}

function drawStomaChart() {
  console.log('drawStomaChart not yet implemented');
}

function drawVascChart() {
  console.log('drawVascChart not yet implemented');
}

function detectCells() {
  alert('Cell detection feature coming soon!');
}

function exportMeasurements() {
  alert('Export measurements feature coming soon!');
}

function exportAllCSV() {
  alert('Export all CSV feature coming soon!');
}

function exportJSON() {
  alert('Export JSON feature coming soon!');
}

function exportReportTxt() {
  alert('Export report feature coming soon!');
}

function printReport() {
  alert('Print report feature coming soon!');
}
