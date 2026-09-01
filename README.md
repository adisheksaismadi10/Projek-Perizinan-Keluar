# Panduan Publikasi & Koneksi Google Sheets - Pos Jaga Asrama

Projek ini telah disiapkan agar dapat terhubung langsung ke **Google Spreadsheet** secara gratis (tanpa biaya server) dan dapat di-publish ke internet agar bisa diakses oleh santri/pengurus lewat HP (scan QR Code).

---

## 📋 Langkah 1: Buat Database Google Spreadsheet & Pasang Script

1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama file Spreadsheet, misalnya: `Database Perizinan Asrama`.
3. Klik menu **Ekstensi (Extensions)** > **Apps Script**.
4. Hapus semua kode default di editor Apps Script, lalu buka file [`google-apps-script.js`](./google-apps-script.js) dan salin (*copy-paste*) seluruh kodenya ke editor Apps Script tersebut.
5. Klik ikon **Simpan** (💾).

---

## 🚀 Langkah 2: Deploy Google Apps Script sebagai Web App

1. Di halaman Apps Script, klik tombol **Terapkan (Deploy)** di pojok kanan atas > pilih **Penerapan baru (New deployment)**.
2. Klik ikon gerigi ⚙️ di sebelah *Pilih jenis*, lalu pilih **Aplikasi Web (Web app)**.
3. Isi konfigurasi berikut:
   - **Deskripsi**: `API Form Asrama`
   - **Jalankan sebagai (Execute as)**: `Saya (email@gmail.com)`
   - **Siapa yang memiliki akses (Who has access)**: `Siapa saja (Anyone)` ⚠️ **PENTING: Jangan pilih 'Hanya saya'**
4. Klik **Terapkan (Deploy)**.
5. Klik **Beri akses (Authorize access)** jika diminta Google:
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik **Advanced** > klik **Go to Untitled project (unsafe)**.
   - Klik **Allow**.
6. Salin **URL Aplikasi Web (Web App URL)** yang berakhiran `/exec`.

---

## 🔗 Langkah 3: Hubungkan URL ke File `index.html`

1. Buka file [`index.html`](./index.html).
2. Cari baris sekitar baris 214:
   ```javascript
   const SCRIPT_URL = 'PASTE_URL_WEB_APP_ANDA_DI_SINI';
   ```
3. Ganti `'PASTE_URL_WEB_APP_ANDA_DI_SINI'` dengan URL yang Anda salin pada Langkah 2.
4. Simpan file `index.html`.

---

## 🌐 Langkah 4: Publikasikan (Publish) ke Internet (Gratis)

Ada beberapa cara gratis yang sangat mudah untuk mempublikasikan file `index.html`:

### Opsi A: Menggunakan Netlify Drop (Paling Mudah - Tanpa Koding)
1. Buka [app.netlify.com/drop](https://app.netlify.com/drop) di browser.
2. Drag & drop folder `Projek Perizinan Keluar` langsung ke area upload.
3. Website Anda langsung online dalam 5 detik dan mendapatkan link publik (contoh: `https://asrama-pos.netlify.app`).

### Opsi B: Menggunakan Vercel
1. Buka [vercel.com](https://vercel.com).
2. Login dan upload project folder Anda.
3. Dapatkan domain gratis seperti `https://perizinan-asrama.vercel.app`.

### Opsi C: Menggunakan GitHub Pages
1. Buat repository baru di GitHub.
2. Upload file `index.html`.
3. Buka **Settings** > **Pages** > pilih branch `main` > Save.

---

## 📱 Langkah 5: Cetak QR Code untuk Pos Jaga

1. Buka website Anda yang sudah di-publish.
2. Klik **"Buka rekap & QR (pengurus asrama)"**.
3. Masukkan PIN: `2468` *(bisa diubah di `index.html`)*.
4. QR Code otomatis terbentuk berdasarkan link website Anda.
5. Screenshot atau cetak (print) QR Code tersebut dan tempelkan di pos jaga/meja piket.
6. Santri tinggal scan QR code menggunakan kamera HP untuk mencatat izin keluar dan masuk!
