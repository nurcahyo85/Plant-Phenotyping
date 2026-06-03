export function drawHistogram() {
  const c = document.getElementById('histCanvas');
  if (!c) return;
  const cx = c.getContext('2d');
  const data = [3, 8, 17, 28, 24, 15, 7, 2];
  const labels = ['<20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '>80'];
  const W = c.width, H = c.height, pl = 35, pb = 30, pt = 10, pr = 10;
  cx.clearRect(0, 0, W, H);
  const max = Math.max(...data);
  const bw = (W - pl - pr) / data.length;
  data.forEach((v, i) => {
    const bh = (H - pb - pt) * v / max;
    const bx = pl + i * bw + 2;
    const by = H - pb - bh;
    cx.fillStyle = `rgba(29,158,117,${0.4 + 0.6 * (v / max)})`;
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
  cx.fillText('Ukuran sel (µm)', W / 2, H);
  cx.save(); cx.translate(10, H / 2); cx.rotate(-Math.PI / 2);
  cx.fillText('n sel', 0, 0); cx.restore();
}

export function drawStomaChart() {
  const c = document.getElementById('stomaChart');
  if (!c) return;
  const cx = c.getContext('2d');
  const W = c.width, H = c.height;
  cx.clearRect(0, 0, W, H);
  const cats = ['Adaksial', 'Abaksial'];
  const vals = [180, 412];
  const maxV = 500;
  const pl = 70, pb = 30, pt = 20, pr = 20;
  const bw = (W - pl - pr) / cats.length * 0.6;
  cats.forEach((cat, i) => {
    const x = pl + i * (W - pl - pr) / cats.length + 20;
    const bh = (H - pb - pt) * vals[i] / maxV;
    const by = H - pb - bh;
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
}

export function drawVascChart() {
  const c = document.getElementById('vascChart');
  if (!c) return;
  const cx = c.getContext('2d');
  const W = c.width, H = c.height;
  cx.clearRect(0, 0, W, H);
  const labels = ['Xilem', 'Floem', 'Parenkim', 'Sklerenkim'];
  const vals = [21, 14, 48, 17];
  const colors = ['#1D9E75', '#639922', '#484f58', '#BA7517'];
  const cx0 = W / 2, cy0 = H / 2 - 10, r = 75;
  let start = -Math.PI / 2;
  vals.forEach((v, i) => {
    const slice = (v / 100) * 2 * Math.PI;
    cx.beginPath(); cx.moveTo(cx0, cy0);
    cx.arc(cx0, cy0, r, start, start + slice);
    cx.closePath(); cx.fillStyle = colors[i]; cx.fill();
    const midA = start + slice / 2;
    cx.fillStyle = '#e6edf3'; cx.font = 'bold 11px DM Mono,monospace'; cx.textAlign = 'center';
    cx.fillText(v + '%', cx0 + (r * 0.65) * Math.cos(midA), cy0 + (r * 0.65) * Math.sin(midA) + 4);
    start += slice;
  });
  labels.forEach((lbl, i) => {
    const y = H - 60 + Math.floor(i / 2) * 18;
    const x = i % 2 === 0 ? 20 : W / 2 + 10;
    cx.fillStyle = colors[i]; cx.fillRect(x, y, 10, 10);
    cx.fillStyle = '#8b949e'; cx.font = '10px DM Sans,sans-serif'; cx.textAlign = 'left';
    cx.fillText(lbl, x + 14, y + 9);
  });
}
