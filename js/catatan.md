/*=========================================================
GBI ALTAR TABERNAKEL BATAM

FILE
index.js

FUNGSI
- Registrasi Ponsel
- Login
- Installation ID
- Status Perangkat

ALUR

1. Cek Installation ID
2. Jika belum ada
   -> Registrasi

3. Jika Status=PENDING
   -> Tampilkan Pending

4. Jika Status=AKTIF
   -> Login

5. Jika Login Berhasil
   -> jemaat-baru.html

=========================================================*/

LOGIKA INDEX.JS:

BAGIAN 1:
Yang sudah bekerja setelah Bagian 1
✅ Membuat Installation ID (belum disimpan).
✅ Mengecek apakah sudah ada Installation ID.
✅ Menentukan tampilan:
Form Registrasi
Pending
Login
✅ Tombol tampil/sembunyi password.

BAGIAN 2:
Setelah Bagian 2
Sekarang sudah berjalan:
✅ Tombol Daftarkan Ponsel
✅ Membuat Installation ID
✅ Menyimpan ke localStorage
✅ Menyimpan status = PENDING
✅ Mengambil:
Nama
Nomor WhatsApp
Role
Browser
Platform Android
Timestamp
✅ Menampilkan halaman Menunggu Aktivasi