import { initTime } from './nav.js';
import { drawHistogram, drawStomaChart, drawVascChart } from './charts.js';
import {
  setTool, applyCalib, handleFile, initDropZone, initCanvasEvents,
  adjustImage, resetCanvas, clearAnnotations, detectCells,
  updateMeasList, clearMeasurements,
} from './canvas.js';
import {
  exportMeasurements, exportAllCSV, exportJSON, exportReportTxt, printReport,
} from './export.js';

function showPanel(name, el) {
  try {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const panel = document.getElementById('panel-' + name);
    if (!panel) { console.error(`Panel "panel-${name}" not found`); return; }
    panel.classList.add('active');
    if (el) el.classList.add('active');
    if (name === 'morphology') { setTimeout(drawHistogram, 100); updateMeasList(); }
    if (name === 'stomata')   setTimeout(drawStomaChart, 100);
    if (name === 'vascular')  setTimeout(drawVascChart, 100);
  } catch (err) {
    console.error('showPanel:', err);
  }
}

// Expose functions needed by inline onclick handlers
Object.assign(window, {
  showPanel,
  handleFile, setTool, applyCalib,
  adjustImage, resetCanvas, clearAnnotations, detectCells,
  updateMeasList, clearMeasurements,
  exportMeasurements, exportAllCSV, exportJSON, exportReportTxt, printReport,
});

document.addEventListener('DOMContentLoaded', () => {
  initTime();
  initDropZone();
  initCanvasEvents();
  drawHistogram();
});
