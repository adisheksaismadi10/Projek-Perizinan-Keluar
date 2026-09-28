/**
 * GOOGLE APPS SCRIPT - SISTEM PERIZINAN ASRAMA (DENGAN FITUR PERGI BARENG TEMAN)
 * 
 * Fitur Utama:
 * 1. Tab 'Master_Santri': Database nama, kelas, dan kamar santri.
 * 2. Tab 'Catatan': Riwayat log perorangan & rombongan.
 * 3. Fitur Pergi Bareng Teman:
 *    -> Sekali submit bisa mencatat beberapa santri sekaligus dengan tujuan & jam keluar yang sama.
 *    -> Masing-masing santri tetap memiliki catatan individual sehingga bisa check-in masuk sendiri-sendiri atau bersama.
 * 4. Pencatatan Masuk HANYA di Hari yang Sama.
 * 5. Notifikasi ramah dengan penekanan pada form masuk.
 */

const SHEET_CATATAN = 'Catatan';
const SHEET_MASTER = 'Master_Santri';
const SERVER_ADMIN_PIN = '2468';

// Data Awal Santri untuk inisialisasi otomatis jika tab Master_Santri masih kosong
const DATA_AWAL_SANTRI = [
  ["SAFM-2024-001","Aan Adriyana","Cepatan","2B Putra"],
  ["SAFM-2024-013","Abdulloh Hasan Al Kahfi","Cepatan","3B Putra"],
  ["SAFM-2023-001","Abira Wisnunggal","Cepatan","3T Putra"],
  ["SAFM-2025-001","Adis Heksa Ismadi","Lanjutan","2T Putra"],
  ["SAFM-2024-014","Adnan Windfall Al Choiri","Cepatan","3B Putra"],
  ["SAFM-2025-003","Alfian Istawa Dinaza","Lambatan","3T Putra"],
  ["SAFM-2025-005","Alka Dewa","Lanjutan","3T Putra"],
  ["SAFM-2022-001","Ananda Naufalindo Dava","Lanjutan","2B Putra"],
  ["SAFM-2023-002","Andyana Habrizi Aqhsha","Cepatan","3T Putra"],
  ["SAFM-2021-001","Arya Guntur Shihabudin","Cepatan","1B"],
  ["SAFM-2025-007","Athallah Dzaky Rulifa","Lanjutan","3B Putra"],
  ["SAFM-2026-003","Athar Mirza Abdullah","Dasar","2T Putra"],
  ["SAFM-2023-003","Baskoro Bayu Baruno","Cepatan","3T Putra"],
  ["SAFM-2026-004","Bratadikara Syafif Arkan Setiono","Dasar","2T Putra"],
  ["SAFM-2026-006","Erlangga Ubaidillah Damar Panulung","Dasar","2T Putra"],
  ["SAFM-2022-003","Faqihuddin","Lanjutan","2B Putra"],
  ["SAFM-2022-004","Febrialam Akbar Sanjaya","Cepatan","2B Putra"],
  ["SAFM-2025-009","Ferdian Satria Rachman","Lambatan","2B Putra"],
  ["SAFM-2022-005","Galang Nurzaman","Cepatan","2B Putra"],
  ["SAFM-2026-007","Garbatara Dwika Sadewa","Dasar","2T Putra"],
  ["SAFM-2023-008","Ginton Afnanin Khoir","Cepatan","2B Putra"],
  ["SAFM-2026-008","Hammad Raihan Hilmi","Dasar","2T Putra"],
  ["SAFM-2023-010","Hanif Al-Ubaidani","Cepatan","3T Putra"],
  ["SAFM-2023-012","Ikhsan Jordan Dwi Putra","Cepatan","3B Putra"],
  ["SAFM-2022-006","Kalingga Kencana LA","Cepatan","3B Putra"],
  ["SAFM-2025-011","Kenaz Shidqi Baswara","Lambatan","3B Putra"],
  ["SAFM-2024-016","Laetitia Kayla Alika","Cepatan","3T Putra"],
  ["SAFM-2026-011","M. Zidan Alfadillah","Lanjutan","2T Putra"],
  ["SAFM-2023-014","Mirza Athallah Salman","Cepatan","3B Putra"],
  ["SAFM-2022-008","Muhamad Satria Budi Bintang","Cepatan","2B Putra"],
  ["SAFM-2023-015","Muhammad Akyas Rifki Fernando","Cepatan","2B Putra"],
  ["SAFM-2025-014","Muhammad Arnando Al Faaris","Dasar","3B Putra"],
  ["SAFM-2026-012","Muhammad Aziz Fathurohman","Lanjutan","2T Putra"],
  ["SAFM-2023-016","Muhammad Beri Al Fauzu","Cepatan","3T Putra"],
  ["SAFM-2026-013","Muhammad Fawwaz Azrayya","Dasar","2T Putra"],
  ["SAFM-2023-017","Muhammad Fikri Asadillah","Lanjutan","3T Putra"],
  ["SAFM-2026-014","Muhammad Ikhbar Sani Abdullah","Lanjutan","2T Putra"],
  ["SAFM-2023-018","Muhammad Irsyan Ghothfan","Cepatan","3T Putra"],
  ["SAFM-2026-015","Muhammad Izza Aroyan","Dasar","2T Putra"],
  ["SAFM-2025-015","Muhammad Rendy Saputra","Lanjutan","3B Putra"],
  ["SAFM-2025-016","Muhammad Reyes","Lambatan","3T Putra"],
  ["SAFM-2025-017","Muhammad Wildan Habiibi","Lanjutan","2B Putra"],
  ["SAFM-2023-019","Muhammad Yafaz Fabian","Lanjutan","2T Putra"],
  ["SAFM-2023-020","Mushab Hirson Firdaus","Cepatan","3T Putra"],
  ["SAFM-2026-016","Mustafa Kemal Pasha","Lanjutan","2T Putra"],
  ["SAFM-2024-011","Neal Guarddin","Cepatan","3B Putra"],
  ["SAFM-2022-009","Rafadhila Pramudita Hamadi","Cepatan","2B Putra"],
  ["SAFM-2023-021","Rahis Galih Pramudya Darmawan","Cepatan","3T Putra"],
  ["SAFM-2024-016","Rainer Adityatama","Cepatan","3T Putra"],
  ["SAFM-2025-020","Renda Panca Buana","Lanjutan","2B Putra"],
  ["SAFM-2023-022","Reyhan Abdilah Mabruri","Lanjutan","2B Putra"],
  ["SAFM-2026-019","Zaki Abdul Aziz","Dasar","2T Putra"],
  ["SAFM-2023-024","Zulfadhli Mahardika","Lanjutan","3T Putra"],
  ["SAFM-2026-020","Fauzan Toefl","Lanjutan","2B Putra"],
  ["SAFM-2025-022","M Dafa Rais","Lanjutan","3B Putra"],
  ["SAFM-2023-025","Nur Fazriyanda Rifqi Alhafiz","Lanjutan","3B Putra"],
  ["SAFM-2023-026","Muhammad Handriano Marceleno","Lanjutan","3B Putra"],
  ["SAFM-2023-025","Nur Fazriyanda Rifqi Ahafids","Lanjutan","3B Putra"],
  ["SAFM-2024-002","Addiena Haqqi","Cepatan","4T Putri"],
  ["SAFM-2024-003","Aghnia Sahala Rizki","Cepatan","2B Putri"],
  ["SAFM-2025-002","Aisha Azkiya Raihana","Lambatan","4T Putri"],
  ["SAFM-2026-001","Aisyah Bening Floydian","Dasar","3B Putri"],
  ["SAFM-2025-004","Alin Khoirunnisa","Lanjutan","4T Putri"],
  ["SAFM-2024-004","Alina Prafasya","Cepatan","3B Putri"],
  ["SAFM-2026-002","Alleidya Revandita","Dasar","3B Putri"],
  ["SAFM-2024-005","Anis Adriyani","Cepatan","2B Putri"],
  ["SAFM-2025-006","Arrifanisa Fauzia","Lanjutan","3T Putri"],
  ["SAFM-2024-006","Aufa Aulia Ulhaq","Cepatan","4T Putri"],
  ["SAFM-2023-004","Cantik Suci Arilla","Lanjutan","3T Putri"],
  ["SAFM-2023-005","Chiquita Labitta","Cepatan","2B Putri"],
  ["SAFM-2023-006","Denia Asha Rushdina","Cepatan","3T Putri"],
  ["SAFM-2026-005","Dinda Azkia Faza","Dasar","3B Putri"],
  ["SAFM-2022-002","Fa'aza Siva'a Fitri R","Cepatan","2B Putri"],
  ["SAFM-2025-008","Fatimah Zahra Choirunnisa","Lambatan","4T Putri"],
  ["SAFM-2023-007","Ginirza Izzati Sabila","Cepatan","3T Putri"],
  ["SAFM-2023-009","Gracia Kayla Sujarwadi","Cepatan","2B Putri"],
  ["SAFM-2025-010","Hadistia Cantik","Lambatan","2B Putri"],
  ["SAFM-2024-008","Hafidah Hasna Fitrina","Lanjutan","4B Putri"],
  ["SAFM-2024-015","Haris Azzahra Lunaaya","Cepatan","3B Putri"],
  ["SAFM-2023-011","Hoa Hayun Bintari","Cepatan","3B Putri"],
  ["SAFM-2026-009","Kayyisah Noor Faza","Dasar","3B Putri"],
  ["SAFM-2026-010","Keisya Anandhita Jasmine Ramadhani","Dasar","3B Putri"],
  ["SAFM-2022-007","Kessya Melvy Ananda","Lanjutan","2B Putri"],
  ["SAFM-2025-012","Khulwa Arika Resti","Lambatan","4B Putri"],
  ["SAFM-2023-013","Matsna Aura Sabila","Cepatan","4B Putri"],
  ["SAFM-2024-009","Mutiara Rahma Waris","Cepatan","4T Putri"],
  ["SAFM-2025-018","Najuni Fahma Aidina","Lambatan","4T Putri"],
  ["SAFM-2026-017","Natasya Fadila Syifara","Dasar","3B Putri"],
  ["SAFM-2024-010","Nayla Malika Anjani","Cepatan","4B Putri"],
  ["SAFM-2024-012","Novita Syaifani","Cepatan","3T Putri"],
  ["SAFM-2026-018","Octafia Anggi Fratista","Dasar","3B Putri"],
  ["SAFM-2025-019","Oktavia Handayani","Lanjutan","4B Putri"],
  ["SAFM-2022-010","Revalina Rizki Andiani","Cepatan","2B Putri"],
  ["SAFM-2022-011","Rini Isnaini Khoirunnisa","Lanjutan","2B Putri"],
  ["SAFM-2022-012","Sarah Salsabila","Cepatan","2B Putri"],
  ["SAFM-2025-021","Tiffani Amanda Azzahra","Lambatan","3T Putri"],
  ["SAFM-2023-023","Zulfa Nur Aina Putri","Cepatan","2B Putri"],
  ["SAFM-2025-025","Yosinta Hera Elviana","Lambatan","4T Putri"],
  ["SAFM-2021-004","Wahyulia Widya Lestari","Lanjutan","3T Putri"],
  ["SAFM-2025-023","Mourabel Indra Auli","Lambatan","4B Putri"]
];

const NAMA_BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

function cleanStr(s) {
  if (!s) return '';
  return String(s).replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim();
}

function formatTanggalSimpel(d) {
  const tgl = d.getDate();
  const bln = NAMA_BULAN[d.getMonth()];
  const thn = d.getFullYear();
  return `${tgl} ${bln} ${thn}`;
}

function formatJamSimpel(d) {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m} WIB`;
}

function getOrCreateMasterSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_MASTER);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_MASTER);
  }
  if (sheet.getLastRow() === 0) {
    const headers = ['ID Santri', 'Nama Lengkap', 'Kelas', 'Kamar / Lorong'];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1F4B4C').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    for (let i = 0; i < DATA_AWAL_SANTRI.length; i++) {
      sheet.appendRow(DATA_AWAL_SANTRI[i]);
    }
  }
  return sheet;
}

function getOrCreateCatatanSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_CATATAN);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_CATATAN);
  }
  if (sheet.getLastRow() === 0) {
    const headers = [
      'ID', 
      'Tanggal', 
      'ID Santri',
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
  return sheet;
}

// Menangani permintaan GET
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : '';
    const pin = (e && e.parameter && e.parameter.pin) ? String(e.parameter.pin).trim() : '';
    
    // 1. Ambil data master santri & daftar santri yang sedang keluar HARI INI
    if (action === 'get_santri' || action === 'init') {
      const masterSheet = getOrCreateMasterSheet();
      const rows = masterSheet.getDataRange().getDisplayValues();
      const santriList = [];
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][1]) {
          santriList.push({
            id: cleanStr(rows[i][0]),
            nama: cleanStr(rows[i][1]),
            kelas: cleanStr(rows[i][2]),
            kamar: cleanStr(rows[i][3])
          });
        }
      }
      
      const catatanSheet = getOrCreateCatatanSheet();
      const cRows = catatanSheet.getDataRange().getDisplayValues();
      const todayStr = formatTanggalSimpel(new Date());
      const activeKeluar = [];
      
      for (let i = 1; i < cRows.length; i++) {
        const rowTanggal = cleanStr(cRows[i][1]);
        const rowStatus = cleanStr(cRows[i][10]);
        if (rowStatus === 'Belum Kembali' && rowTanggal === todayStr) {
          activeKeluar.push({
            idLog: cleanStr(cRows[i][0]),
            tanggal: rowTanggal,
            idSantri: cleanStr(cRows[i][2]),
            nama: cleanStr(cRows[i][3]),
            kelas: cleanStr(cRows[i][4]),
            kamar: cleanStr(cRows[i][5]),
            tujuan: cleanStr(cRows[i][6]),
            jamKeluar: cleanStr(cRows[i][7])
          });
        }
      }
      activeKeluar.reverse();

      return createJsonResponse({
        status: 'success',
        santri: santriList,
        activeKeluar: activeKeluar,
        today: todayStr
      });
    }

    // 2. Ambil data rekap pengurus (dilindungi PIN)
    if (pin === SERVER_ADMIN_PIN) {
      const sheet = getOrCreateCatatanSheet();
      const rows = sheet.getDataRange().getDisplayValues();
      
      if (rows.length <= 1) {
        return createJsonResponse({ status: 'success', data: [] });
      }
      
      const data = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        data.push({
          id: cleanStr(row[0]),
          tanggal: cleanStr(row[1]),
          idSantri: cleanStr(row[2]),
          nama: cleanStr(row[3]),
          kelas: cleanStr(row[4]),
          kamar: cleanStr(row[5]),
          tujuan: cleanStr(row[6]),
          jamKeluar: cleanStr(row[7]),
          jamMasuk: cleanStr(row[8]),
          durasi: cleanStr(row[9]),
          status: cleanStr(row[10])
        });
      }
      data.reverse();
      return createJsonResponse({ status: 'success', data: data });
    }

    return createJsonResponse({ 
      status: 'error', 
      message: 'Akses Ditolak: PIN Pengurus salah atau tidak disertakan.' 
    });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

// Menangani permintaan POST (Submit Keluar / Masuk)
function doPost(e) {
  try {
    const catatanSheet = getOrCreateCatatanSheet();
    const contents = JSON.parse(e.postData.contents);
    const mode = contents.mode; // 'keluar' atau 'masuk'
    const payload = contents.data;
    
    if (!payload) {
      return createJsonResponse({ status: 'error', message: 'Data tidak lengkap.' });
    }

    const now = new Date();
    const tanggalStr = formatTanggalSimpel(now);
    const jamStr = formatJamSimpel(now);

    if (mode === 'keluar') {
      // Mendukung array santri (Pergi Sendiri maupun Bareng Teman)
      let listSantri = [];
      if (Array.isArray(payload.members) && payload.members.length > 0) {
        listSantri = payload.members;
      } else if (payload.nama) {
        listSantri = [payload];
      }

      if (listSantri.length === 0) {
        return createJsonResponse({ status: 'error', message: 'Daftar santri tidak boleh kosong.' });
      }

      const baseTripId = 'TRIP-' + now.getTime();
      const tujuan = cleanStr(payload.tujuan || '');
      const namaList = [];

      for (let i = 0; i < listSantri.length; i++) {
        const s = listSantri[i];
        const sId = cleanStr(s.idSantri || s.id || '');
        const sNama = cleanStr(s.nama);
        const sKelas = cleanStr(s.kelas || '');
        const sKamar = cleanStr(s.kamar || '');

        namaList.push(sNama);

        const rowId = listSantri.length > 1 ? `${baseTripId}-${i + 1}` : baseTripId;
        const newRow = [
          rowId,
          "'" + tanggalStr,
          sId,
          sNama,
          sKelas,
          sKamar,
          tujuan,
          "'" + jamStr,
          '', // Jam Masuk kosong
          '', // Durasi kosong
          'Belum Kembali'
        ];
        catatanSheet.appendRow(newRow);
      }
      
      let pesanSukses = '';
      if (listSantri.length > 1) {
        pesanSukses = `Tercatat: <strong>${listSantri.length} santri</strong> (${namaList.join(', ')}) izin keluar bersama pada pukul ${jamStr}. Hati-hati di jalan yaa, dan <strong>jangan lupa mengisi form masuk</strong> saat kembali.`;
      } else {
        pesanSukses = `Hati-hati di jalan yaa, dan <strong>jangan lupa mengisi form masuk</strong> saat kembali.`;
      }

      return createJsonResponse({ 
        status: 'success', 
        message: pesanSukses 
      });
    } 
    else if (mode === 'masuk') {
      const idSantri = cleanStr(payload.idSantri || '');
      const nama = cleanStr(payload.nama || '');

      const rows = catatanSheet.getDataRange().getDisplayValues();
      let targetRowIndex = -1;
      let keluarStrRaw = '';
      
      // Cari baris santri yang keluar HARI INI dan statusnya masih 'Belum Kembali'
      for (let i = rows.length - 1; i >= 1; i--) {
        const rowTanggal = cleanStr(rows[i][1]);
        const rowIdSantri = cleanStr(rows[i][2]);
        const rowNama = cleanStr(rows[i][3]).toLowerCase();
        const rowStatus = cleanStr(rows[i][10]);
        
        const isSameDay = (rowTanggal === tanggalStr);
        const isSameSantri = (idSantri && rowIdSantri === idSantri) || (rowNama === nama.toLowerCase());
        
        if (isSameDay && isSameSantri && rowStatus === 'Belum Kembali') {
          targetRowIndex = i + 1;
          keluarStrRaw = rows[i][7]; // Kolom Jam Keluar
          break;
        }
      }
      
      if (targetRowIndex !== -1) {
        let durasiStr = '-';
        if (keluarStrRaw) {
          try {
            const keluarClean = keluarStrRaw.replace(' WIB', '').replace('1899-12-30T', '').trim();
            let [kH, kM] = [0, 0];
            if (keluarClean.includes(':')) {
              const parts = keluarClean.split(':').map(Number);
              kH = parts[0];
              kM = parts[1];
            }
            const [mH, mM] = [now.getHours(), now.getMinutes()];
            
            let diffMinutes = (mH * 60 + mM) - (kH * 60 + kM);
            if (diffMinutes < 0) diffMinutes += 24 * 60;
            
            const h = Math.floor(diffMinutes / 60);
            const m = diffMinutes % 60;
            
            if (h === 0) {
              durasiStr = `${m} menit`;
            } else if (m === 0) {
              durasiStr = `${h} jam`;
            } else {
              durasiStr = `${h} jam ${m} mnt`;
            }
          } catch(err) {
            durasiStr = '-';
          }
        }
        
        catatanSheet.getRange(targetRowIndex, 9).setValue("'" + jamStr);     // Jam Masuk
        catatanSheet.getRange(targetRowIndex, 10).setValue(durasiStr);       // Durasi
        catatanSheet.getRange(targetRowIndex, 11).setValue('Sudah Kembali'); // Status
        
        return createJsonResponse({ 
          status: 'success', 
          message: `Alhamdulillah selamat datang kembali, <strong>${nama}</strong>. Waktu masuk tercatat pukul ${jamStr} (Durasi: ${durasiStr}).` 
        });
      } else {
        return createJsonResponse({ 
          status: 'warn', 
          message: `Tidak ditemukan catatan izin keluar untuk <strong>${nama}</strong> pada hari ini (${tanggalStr}). Silakan hubungi pengurus asrama jika ada kendala.` 
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
