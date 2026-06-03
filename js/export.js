import { state } from './state.js';

function downloadFile(filename, content, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

export function exportMeasurements() {
  if (state.measurements.length === 0) { alert('Belum ada pengukuran.'); return; }
  const rows = ['No,Jarak (µm)', ...state.measurements.map((m, i) => `${i + 1},${m.dist}`)];
  downloadFile('pengukuran.csv', rows.join('\n'), 'text/csv');
}

export function exportAllCSV() {
  const rows = [
    'Kode Sampel,Jenis Jaringan,Jumlah Sel,Rerata Luas (µm²),Rerata Panjang (µm),Kerapatan Stomata,Indeks SI,Status',
    'Glb-01,Epidermis adaksial,124,1247,47.3,320,0.83,Selesai',
    'Glb-02,Epidermis abaksial,98,1381,52.1,412,0.79,Selesai',
    'Glb-03,Mesofil palisade,203,892,61.4,,0.62,Selesai',
    'Glb-04,Xilem batang,67,548,28.7,,0.74,Proses',
    'Glb-05,Epidermis adaksial,,,,,,,Antre',
    'Glb-06,Mesofil spons,,,,,,Antre',
  ];
  downloadFile('plantscope_data.csv', rows.join('\n'), 'text/csv');
}

export function exportJSON() {
  const data = {
    sesi: new Date().toISOString(),
    totalGambar: 12, totalSel: 847, akurasi: '94%',
    sampel: [
      { kode: 'Glb-01', jaringan: 'Epidermis adaksial', nSel: 124, luasRerata: 1247, panjangRerata: 47.3, stomata: 320, si: 0.83 },
      { kode: 'Glb-02', jaringan: 'Epidermis abaksial', nSel: 98, luasRerata: 1381, panjangRerata: 52.1, stomata: 412, si: 0.79 },
      { kode: 'Glb-03', jaringan: 'Mesofil palisade', nSel: 203, luasRerata: 892, panjangRerata: 61.4, si: 0.62 },
    ],
    pengukuranManual: state.measurements,
  };
  downloadFile('plantscope_data.json', JSON.stringify(data, null, 2), 'application/json');
}

export function exportReportTxt() {
  const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const txt = `LAPORAN ANALISIS FENOTIPE MIKROSKOPI
PlantScope v1.0 · ${date}

RINGKASAN EKSEKUTIF
Analisis morfometri dilakukan terhadap 12 gambar mikroskop dari 3 spesimen berbeda.
Total 847 sel berhasil dideteksi dengan akurasi segmentasi 94%.

PARAMETER MORFOLOGI
Panjang sel (rerata ± SD) : 47.3 ± 5.2 µm
Lebar sel (rerata ± SD)   : 28.6 ± 3.8 µm
Kerapatan stomata abaksial: 412 mm⁻²
Indeks stomata            : 0.14
Indeks kebulatan          : 0.83
Rasio aspek               : 1.65

DATA SAMPEL
Glb-01 · Epidermis adaksial · 124 sel · luas 1247 µm²
Glb-02 · Epidermis abaksial · 98 sel · luas 1381 µm²
Glb-03 · Mesofil palisade  · 203 sel · luas 892 µm²

KESIMPULAN
Morfologi sel menunjukkan karakteristik daun naungan dengan sel epidermis berukuran besar,
kerapatan stomata moderat, dan dominasi mesofil spons. Konsisten dengan tanaman famili Zingiberaceae.
`;
  downloadFile('laporan_plantscope.txt', txt, 'text/plain');
}

export function printReport() { window.print(); }
