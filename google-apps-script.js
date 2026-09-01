/**
 * GOOGLE APPS SCRIPT - BACKEND PERIZINAN ASRAMA
 * 
 * Petunjuk Pemasangan:
 * 1. Buka Google Spreadsheet baru (beri nama misal: "Database Perizinan Asrama").
 * 2. Klik menu 'Ekstensi' (Extensions) > 'Apps Script'.
 * 3. Hapus semua kode yang ada di editor Apps Script, lalu tempel (paste) seluruh kode di bawah ini.
 * 4. Klik tombol 'Simpan' (ikon disket).
 * 5. Klik tombol 'Terapkan' (Deploy) > 'Penerapan Baru' (New deployment).
 * 6. Pilih jenis: 'Aplikasi Web' (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: API Perizinan Asrama
 *    - Jalankan sebagai (Execute as): 'Saya' (Me / email Anda)
 *    - Siapa yang memiliki akses (Who has access): 'Siapa saja' (Anyone / Anonymous) -> PENTING!
 * 8. Klik 'Terapkan' (Deploy), berikan izin akses (Authorize access), lalu salin "URL Aplikasi Web" (Web App URL).
 * 9. Tempelkan URL tersebut ke variabel SCRIPT_URL di file index.html.
 */

const SHEET_NAME = 'Catatan';

function setupSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    const headers = [
      'ID', 
      'Tanggal', 
      'Nama', 
      'Kelas', 
      'Kamar', 
      'Tujuan', 
      'Jam Keluar', 
      'Jam Masuk', 
      'Durasi', 
      'Status'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1F4B4C').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  setupSheet(sheet);
  return sheet;
}

// Menangani permintaan membaca data (GET) untuk tabel admin
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      return createJsonResponse({ status: 'success', data: [] });
    }
    
    const headers = rows[0];
    const data = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      data.push({
        id: row[0],
        tanggal: row[1],
        nama: row[2],
        kelas: row[3],
        kamar: row[4],
        tujuan: row[5],
        jamKeluar: row[6],
        jamMasuk: row[7],
        durasi: row[8],
        status: row[9]
      });
    }
    
    // Urutkan dari data terbaru ke terlama
    data.reverse();
    
    return createJsonResponse({ status: 'success', data: data });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

// Menangani permintaan input / update data (POST) dari form santri
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const contents = JSON.parse(e.postData.contents);
    const mode = contents.mode; // 'keluar' atau 'masuk'
    const payload = contents.data;
    
    const timeZone = 'Asia/Jakarta';
    const now = new Date();
    const tanggalStr = Utilities.formatDate(now, timeZone, 'dd/MM/yyyy');
    const jamStr = Utilities.formatDate(now, timeZone, 'HH:mm:ss');
    
    if (mode === 'keluar') {
      const id = 'TRIP-' + now.getTime();
      const newRow = [
        id,
        tanggalStr,
        payload.nama,
        payload.kelas,
        payload.kamar,
        payload.tujuan,
        jamStr,
        '', // Jam Masuk kosong
        '', // Durasi kosong
        'Belum Kembali'
      ];
      sheet.appendRow(newRow);
      return createJsonResponse({ 
        status: 'success', 
        message: `Tercatat: ${payload.nama} keluar pukul ${jamStr}. Jangan lupa isi form "Masuk" saat kembali.` 
      });
    } 
    else if (mode === 'masuk') {
      const rows = sheet.getDataRange().getValues();
      let targetRowIndex = -1;
      
      // Cari baris terakhir yang cocok dengan nama & kamar yang belum kembali
      for (let i = rows.length - 1; i >= 1; i--) {
        const rowNama = String(rows[i][2]).trim().toLowerCase();
        const rowKamar = String(rows[i][4]).trim().toLowerCase();
        const inputNama = String(payload.nama).trim().toLowerCase();
        const inputKamar = String(payload.kamar).trim().toLowerCase();
        const status = rows[i][9];
        
        if (rowNama === inputNama && rowKamar === inputKamar && status === 'Belum Kembali') {
          targetRowIndex = i + 1; // 1-based index untuk SpreadsheetApp
          break;
        }
      }
      
      if (targetRowIndex !== -1) {
        // Hitung durasi jika ada jam keluar
        const keluarStr = sheet.getRange(targetRowIndex, 7).getValue();
        let durasiStr = '-';
        if (keluarStr) {
          try {
            const [kH, kM] = keluarStr.split(':').map(Number);
            const [mH, mM] = jamStr.split(':').map(Number);
            let diffMinutes = (mH * 60 + mM) - (kH * 60 + kM);
            if (diffMinutes < 0) diffMinutes += 24 * 60; // Lewat tengah malam
            const h = Math.floor(diffMinutes / 60);
            const m = diffMinutes % 60;
            durasiStr = h > 0 ? `${h} jam ${m} mnt` : `${m} menit`;
          } catch(err) {
            durasiStr = '-';
          }
        }
        
        sheet.getRange(targetRowIndex, 8).setValue(jamStr);     // Jam Masuk
        sheet.getRange(targetRowIndex, 9).setValue(durasiStr);  // Durasi
        sheet.getRange(targetRowIndex, 10).setValue('Sudah Kembali'); // Status
        
        return createJsonResponse({ 
          status: 'success', 
          message: `Selamat datang kembali, ${payload.nama}. Waktu masuk tercatat pukul ${jamStr}.` 
        });
      } else {
        // Jika tidak ditemukan catatan keluar sebelumnya
        const id = 'TRIP-' + now.getTime();
        const newRow = [
          id,
          tanggalStr,
          payload.nama,
          payload.kelas,
          payload.kamar,
          '(Tidak ada catatan izin keluar)',
          '-',
          jamStr,
          '-',
          'Tanpa Izin Keluar'
        ];
        sheet.appendRow(newRow);
        return createJsonResponse({ 
          status: 'success', 
          message: `Waktu masuk tercatat pukul ${jamStr}, tapi tidak ditemukan catatan "keluar" sebelumnya. Silakan konfirmasi ke pengurus.` 
        });
      }
    }
    
    return createJsonResponse({ status: 'error', message: 'Mode tidak dikenali' });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
