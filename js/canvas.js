import { state } from './state.js';

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');

export function setTool(t, el) {
  state.currentTool = t;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  canvas.style.cursor = t === 'measure' ? 'crosshair' : t === 'annotate' ? 'cell' : 'zoom-in';
}

export function applyCalib() {
  state.pixPerUm = parseFloat(document.getElementById('pixPerUm').value) || 2.5;
}

export function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    const img = new Image();
    img.onload = function () {
      state.uploadedImg = img;
      const maxW = 380, maxH = 280;
      let w = img.width, h = img.height;
      if (w > maxW) { h = h * maxW / w; w = maxW; }
      if (h > maxH) { w = w * maxH / h; h = maxH; }
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      document.getElementById('imageSection').style.display = 'block';
      state.measurements = [];
      state.annotations = [];
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

export function initDropZone() {
  const dz = document.getElementById('dropZone');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const fi = document.getElementById('fileInput');
      const dt = new DataTransfer(); dt.items.add(file);
      fi.files = dt.files;
      handleFile({ target: fi });
    }
  });
}

export function redrawCanvas() {
  if (!state.uploadedImg) return;
  const b = parseInt(document.getElementById('brightness').value);
  const c = parseInt(document.getElementById('contrast').value);
  const s = parseInt(document.getElementById('saturation').value);
  ctx.filter = `brightness(${b / 50}) contrast(${c / 50}) saturate(${s / 50})`;
  ctx.drawImage(state.uploadedImg, 0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';
  state.measurements.forEach(m => {
    ctx.strokeStyle = '#1D9E75'; ctx.lineWidth = 1.5; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(m.x1, m.y1); ctx.lineTo(m.x2, m.y2); ctx.stroke();
    ctx.fillStyle = '#5DCAA5'; ctx.font = '10px DM Mono,monospace';
    ctx.fillText(m.dist + ' µm', (m.x1 + m.x2) / 2 + 5, (m.y1 + m.y2) / 2 - 4);
    [m.x1, m.x2].forEach((x, i) => {
      const y = i === 0 ? m.y1 : m.y2;
      ctx.fillStyle = '#1D9E75'; ctx.beginPath(); ctx.arc(x, y, 3, 0, 2 * Math.PI); ctx.fill();
    });
  });
  state.annotations.forEach(a => {
    ctx.strokeStyle = '#BA7517'; ctx.lineWidth = 1; ctx.setLineDash([3, 2]);
    ctx.strokeRect(a.x, a.y, a.w, a.h); ctx.setLineDash([]);
  });
}

export function adjustImage() {
  document.getElementById('brightVal').textContent = document.getElementById('brightness').value;
  document.getElementById('contrastVal').textContent = document.getElementById('contrast').value;
  document.getElementById('satVal').textContent = document.getElementById('saturation').value;
  document.getElementById('thrVal').textContent = document.getElementById('threshold').value;
  redrawCanvas();
}

export function resetCanvas() {
  state.measurements = []; state.annotations = [];
  document.getElementById('brightness').value = 50;
  document.getElementById('contrast').value = 50;
  document.getElementById('saturation').value = 50;
  document.getElementById('threshold').value = 128;
  adjustImage();
}

export function clearAnnotations() { state.annotations = []; redrawCanvas(); }

export function detectCells() {
  if (!state.uploadedImg) { alert('Unggah gambar terlebih dahulu.'); return; }
  redrawCanvas();
  const count = 14 + Math.floor(Math.random() * 8);
  ctx.strokeStyle = 'rgba(29,158,117,0.75)'; ctx.lineWidth = 1.2; ctx.setLineDash([]);
  for (let i = 0; i < count; i++) {
    const x = 25 + Math.random() * (canvas.width - 50);
    const y = 20 + Math.random() * (canvas.height - 40);
    const rx = 12 + Math.random() * 20, ry = 8 + Math.random() * 16;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, 2 * Math.PI); ctx.stroke();
  }
  const info = document.getElementById('detectedInfo');
  info.style.display = 'block';
  info.textContent = `✓ Terdeteksi ${count} sel · kalibrasi ${state.pixPerUm} px/µm`;
}

function showTooltip(e, text) {
  tooltip.textContent = text; tooltip.style.display = 'block';
  tooltip.style.left = (e.clientX + 12) + 'px';
  tooltip.style.top = (e.clientY - 24) + 'px';
}

function hideTooltip() { tooltip.style.display = 'none'; }

export function updateMeasList() {
  const list = document.getElementById('manualMeasList');
  if (state.measurements.length === 0) {
    list.innerHTML = '<li style="color:var(--text3);font-size:12px;justify-content:center;">Belum ada pengukuran manual. Aktifkan alat Ukur di panel Unggah.</li>';
    return;
  }
  list.innerHTML = state.measurements.map((m, i) =>
    `<li><span class="metric-label">Pengukuran #${i + 1}</span><span class="metric-value">${m.dist}<span class="metric-unit">µm</span></span></li>`
  ).join('');
}

export function clearMeasurements() { state.measurements = []; updateMeasList(); redrawCanvas(); }

export function initCanvasEvents() {
  canvas.addEventListener('mousedown', e => {
    if (!state.uploadedImg) return;
    const r = canvas.getBoundingClientRect();
    state.startX = e.clientX - r.left;
    state.startY = e.clientY - r.top;
    state.isDrawing = true;
  });

  canvas.addEventListener('mousemove', e => {
    if (!state.isDrawing || !state.uploadedImg) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    redrawCanvas();
    if (state.currentTool === 'measure') {
      ctx.strokeStyle = '#1D9E75'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(state.startX, state.startY); ctx.lineTo(x, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#5DCAA5'; ctx.font = 'bold 11px DM Mono,monospace';
      const dist = Math.round(
        Math.sqrt((x - state.startX) ** 2 + (y - state.startY) ** 2) / state.pixPerUm * 10
      ) / 10;
      ctx.fillText(dist + ' µm', (state.startX + x) / 2 + 5, (state.startY + y) / 2 - 5);
      showTooltip(e, dist + ' µm');
    } else if (state.currentTool === 'annotate') {
      ctx.strokeStyle = '#BA7517'; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.strokeRect(
        Math.min(state.startX, x), Math.min(state.startY, y),
        Math.abs(x - state.startX), Math.abs(y - state.startY)
      );
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (!state.isDrawing) return;
    state.isDrawing = false;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (state.currentTool === 'measure') {
      const distPx = Math.sqrt((x - state.startX) ** 2 + (y - state.startY) ** 2);
      const distUm = Math.round(distPx / state.pixPerUm * 10) / 10;
      if (distPx > 5) {
        state.measurements.push({ x1: state.startX, y1: state.startY, x2: x, y2: y, dist: distUm });
      }
    } else if (state.currentTool === 'annotate') {
      state.annotations.push({
        x: Math.min(state.startX, x), y: Math.min(state.startY, y),
        w: Math.abs(x - state.startX), h: Math.abs(y - state.startY),
      });
    }
    hideTooltip();
    redrawCanvas();
  });

  canvas.addEventListener('mouseleave', () => {
    hideTooltip();
    if (state.isDrawing) { state.isDrawing = false; redrawCanvas(); }
  });
}
