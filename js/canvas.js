/**
 * Canvas Drawing and Measurement Functions
 */

// ===== CHART DRAWING =====
function drawHistogram() {
  try {
    const canvas = document.getElementById('histCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;

    // Clear canvas
    ctx.fillStyle = 'var(--bg3)';
    ctx.fillRect(0, 0, width, height);

    // Sample histogram data (should be replaced with actual data)
    const data = [5, 12, 25, 38, 42, 35, 28, 15, 8, 2];
    const maxValue = Math.max(...data);

    // Draw bars
    const barWidth = (width - 2 * padding) / data.length;
    data.forEach((value, i) => {
      const barHeight = (value / maxValue) * (height - 2 * padding);
      const x = padding + i * barWidth + barWidth * 0.1;
      const y = height - padding - barHeight;

      // Bar
      ctx.fillStyle = '#1D9E75';
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);

      // Label
      ctx.fillStyle = '#8b949e';
      ctx.font = '10px "DM Mono", monospace';
      ctx.textAlign = 'center';
      const label = `${40 + i * 5}`;
      ctx.fillText(label, x + barWidth * 0.4, height - 10);
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
  } catch (error) {
    console.error('Error drawing histogram:', error);
  }
}

function drawStomaChart() {
  try {
    const canvas = document.getElementById('stomaChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'var(--bg3)';
    ctx.fillRect(0, 0, width, height);

    // Sample bar chart for stomata comparison
    const data = [
      { label: 'Adaksial', value: 180, color: '#1D9E75' },
      { label: 'Abaksial', value: 412, color: '#639922' },
    ];

    const barHeight = 40;
    const maxValue = 450;
    const startY = height / 2 - barHeight;

    data.forEach((item, i) => {
      const barWidth = (item.value / maxValue) * (width - 100);
      const y = startY + i * 60;

      // Bar
      ctx.fillStyle = item.color;
      ctx.fillRect(50, y, barWidth, barHeight);

      // Label
      ctx.fillStyle = '#e6edf3';
      ctx.font = '12px "DM Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${item.value} mm⁻²`, width - 20, y + 26);

      // Category label
      ctx.font = '11px "DM Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#8b949e';
      ctx.fillText(item.label, 10, y + 26);
    });
  } catch (error) {
    console.error('Error drawing stomata chart:', error);
  }
}

function drawVascChart() {
  try {
    const canvas = document.getElementById('vascChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'var(--bg3)';
    ctx.fillRect(0, 0, width, height);

    // Pie chart for vascular tissue composition
    const data = [
      { label: 'Xilem', value: 60, color: '#1D9E75' },
      { label: 'Floem', value: 25, color: '#639922' },
      { label: 'Parenkim', value: 15, color: '#BA7517' },
    ];

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    let currentAngle = -Math.PI / 2;

    data.forEach((item) => {
      const sliceAngle = (item.value / 100) * 2 * Math.PI;

      // Draw slice
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.value}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Legend
    let legendY = height - 50;
    data.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(20, legendY, 12, 12);

      ctx.fillStyle = '#e6edf3';
      ctx.font = '10px "DM Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, 40, legendY + 6);

      legendY += 20;
    });
  } catch (error) {
    console.error('Error drawing vascular chart:', error);
  }
}

// ===== CELL DETECTION (PLACEHOLDER) =====
function detectCells() {
  try {
    if (!AppState.uploadedImg) {
      alert('Please upload an image first');
      return;
    }

    // Placeholder: Simple edge detection visualization
    const threshold = parseInt(document.getElementById('threshold').value) || 128;

    // This is a placeholder - real implementation would use image processing
    const detectionResult = simulateCellDetection(threshold);

    const detectedInfo = document.getElementById('detectedInfo');
    if (detectedInfo) {
      detectedInfo.innerHTML = `
        <strong>Detection Results:</strong>
        <ul style="margin-top: 8px; margin-left: 16px;">
          <li>Cells detected: ${detectionResult.cellCount}</li>
          <li>Average cell size: ${detectionResult.avgSize.toFixed(2)} µm²</li>
          <li>Confidence: ${detectionResult.confidence}%</li>
        </ul>
      `;
      detectedInfo.style.display = 'block';
    }
  } catch (error) {
    console.error('Error in cell detection:', error);
    alert('Error during cell detection');
  }
}

function simulateCellDetection(threshold) {
  // Placeholder simulation - replace with actual image processing
  return {
    cellCount: Math.floor(Math.random() * 100) + 50,
    avgSize: Math.random() * 1000 + 800,
    confidence: Math.floor(Math.random() * 30) + 70,
  };
}
