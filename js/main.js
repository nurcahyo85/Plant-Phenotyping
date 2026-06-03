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
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (el) el.classList.add('active');
  if (name === 'morphology') { setTimeout(drawHistogram, 100); updateMeasList(); }
  if (name === 'stomata') setTimeout(drawStomaChart, 100);
  if (name === 'vascular') setTimeout(drawVascChart, 100);
}

// Expose functions needed by inline onclick handlers in the HTML
Object.assign(window, {
  showPanel,
  handleFile, setTool, applyCalib,
  adjustImage, resetCanvas, clearAnnotations, detectCells,
  updateMeasList, clearMeasurements,
  exportMeasurements, exportAllCSV, exportJSON, exportReportTxt, printReport,
});

initTime();
initDropZone();
initCanvasEvents();
window.addEventListener('load', drawHistogram);
