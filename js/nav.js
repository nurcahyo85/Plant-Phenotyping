export function updateTime() {
  const now = new Date();
  document.getElementById('headerTime').textContent =
    now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
    now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const reportDate = document.getElementById('reportDate');
  if (reportDate) {
    reportDate.textContent =
      'Tanggal: ' + now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
}

export function initTime() {
  updateTime();
  setInterval(updateTime, 30000);
}
