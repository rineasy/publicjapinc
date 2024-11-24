# JAPIN URL - URL Shortener

JAPIN URL adalah layanan pemendek URL modern yang dibangun dengan React dan Node.js. Aplikasi ini menyediakan antarmuka yang ramah pengguna untuk membuat, mengelola, dan melacak URL yang dipersingkat dengan fitur analitik yang kuat.

## Fitur

- **Pemendek URL**: Buat URL pendek dengan kode kustom atau yang dibuat otomatis
- **Manajemen Tautan**: Atur tautan dengan judul, tag, dan kategori
- **Pelacakan Analitik**: Lacak klik tautan dan statistik penggunaan
- **Tautan Publik/Privat**: Pilih untuk membuat tautan publik atau menjaga privasi
- **Pencarian & Filter**: Cari tautan dan filter berdasarkan kategori atau tag
- **Autentikasi Aman**: Registrasi dan login pengguna dengan JWT dan reCAPTCHA
- **UI Modern**: Desain yang responsif dan menarik dengan Tailwind CSS

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- Node.js (v14 atau lebih tinggi)
- MongoDB
- npm atau yarn

## Instalasi

1. Clone repositori:
   ```bash
   git clone https://github.com/rineasy/shortlink-japin.git
   cd shortlink-japin
   ```

2. Instal dependensi untuk frontend dan backend:
   ```bash
   # Instal dependensi frontend
   npm install

   # Instal dependensi backend
   cd server
   npm install
   ```

3. Siapkan variabel lingkungan:
   Buat file `.env` di direktori root:
   ```
   REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   ```

   Buat file `.env` di direktori server:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/links
   JWT_SECRET=your_jwt_secret
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   ```

4. Jalankan server development:
   ```bash
   # Jalankan server backend (dari direktori server)
   npm run dev

   # Jalankan server frontend (dari direktori root)
   npm start
   ```

## Penggunaan

1. **Registrasi/Login**:
   - Buat akun baru atau masuk dengan kredensial yang ada
   - Verifikasi reCAPTCHA untuk keamanan

2. **Membuat URL Pendek**:
   - Klik "Buat Tautan" di dasbor
   - Masukkan URL asli
   - Tambahkan judul, tag, dan kategori (opsional)
   - Pilih visibilitas publik/privat
   - Dapatkan URL pendek Anda

3. **Mengelola Tautan**:
   - Lihat semua tautan Anda di dasbor
   - Cari dan filter tautan
   - Lihat analitik untuk setiap tautan
   - Edit atau hapus tautan sesuai kebutuhan

4. **Tautan Publik**:
   - Jelajahi tautan publik di halaman beranda
   - Gunakan pencarian dan filter untuk menemukan tautan yang relevan
   - Penghitung klik menunjukkan popularitas tautan

## Teknologi yang Digunakan

### Frontend
- React.js
- React Router v7
- Tailwind CSS
- DaisyUI
- React Query
- Axios
- React Google reCAPTCHA

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- reCAPTCHA Integration

## Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur yang mengagumkan'`)
4. Push ke branch (`git push origin fitur/AmazingFeature`)
5. Buka Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## Kontak

Nama Anda - [@twitter_handle](https://twitter.com/twitter_handle) - email@example.com

Link Proyek: [https://github.com/yourusername/shortlink-japin](https://github.com/yourusername/shortlink-japin)
