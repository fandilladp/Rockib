# ROCIKIB | Log Management System
![Rockib Logo](./assets/Rockib.webp)

Rockib adalah sistem manajemen log sederhana yang dibangun menggunakan Node.js, Express, dan MongoDB. Sistem ini menyediakan API untuk menambah log dan mengambil log berdasarkan berbagai filter, seperti nama aplikasi, bagian, dan rentang tanggal. Sistem juga terintegrasi dengan layanan monitoring utilisasi eksternal.

## Fitur

- **Tambah Log**: Menyimpan log dengan field yang dapat disesuaikan, termasuk nama aplikasi, bagian, sub-bagian, dan data.
- **Ambil Log**: Mengambil log berdasarkan nama aplikasi, bagian, sub-bagian, rentang tanggal, dan pagination.
- **Caching**: Meng-cache respons API untuk meningkatkan performa.
- **Integrasi Data Utilisasi Eksternal**: Memposting data penggunaan log ke layanan monitoring eksternal secara otomatis.
- **Pencarian Dinamis**: Mencari log berdasarkan beberapa field dalam data menggunakan regex.
- **Isolasi Keamanan dengan `app-key`**: Memfilter log berdasarkan `app-key` untuk memastikan hanya data log yang sesuai yang dapat diakses.

## Instalasi

### Prasyarat

- Node.js (v14 atau lebih tinggi)
- MongoDB
- npm (Node Package Manager) atau `yarn`

### Setup

1. **Clone repository**:

   ```bash
   git clone https://github.com/fandilladp/Rockib
   cd Rockib
   ```

2. **Instal dependensi**:

   ```bash
   yarn
   ```

3. **Konfigurasi Lingkungan**:

   Buat file `.env` di direktori root proyek Anda dan atur variabel lingkungan berikut:

   ```env
   PORT=5000
   TOKEN=your_auth_token
   DB_HOST=your_mongo_host
   DB_PORT=your_mongo_port
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   HOSTUTILITOR=url_of_utilization_monitoring_service
   TOKENUTILITOR=token_for_utilization_service
   ```

4. **Jalankan Server**:

   ```bash
   npm start
   ```

   Server akan berjalan di port yang ditentukan dalam file `.env` (default adalah `5000`).

## API Endpoints

### Tambah Log

- **URL**: `/api/addLog`
- **Method**: `POST`
- **Deskripsi**: Menambah entri log baru ke database.
- **Header Opsional**: `app-key` untuk menyimpan `key` log (opsional).
- **Body Request**:

  ```json
  {
    "app": "string",
    "section": "string",
    "subsection": "string",
    "data": {}
  }
  ```

- **Respons**:

  ```json
  {
    "message": "Log added successfully",
    "newLog": {
      "_id": "unique_log_id",
      "app": "string",
      "section": "string",
      "subsection": "string",
      "data": {},
      "createdAt": "timestamp",
      "key": "app-key if provided"
    }
  }
  ```

### Ambil Log

- **URL**: `/api/getData/:app?/:section?/:subsection?`
- **Method**: `GET`
- **Deskripsi**: Mengambil log berdasarkan nama aplikasi, bagian, sub-bagian, dan filter opsional tanggal.
- **Header Opsional**: `app-key` untuk memfilter log berdasarkan key yang sesuai.
- **Query Parameters**:
  - `app`: Nama aplikasi (wajib).
  - `section`: Nama bagian (opsional).
  - `subsection`: Nama sub-bagian (opsional).
  - `startDate`: Filter log mulai dari tanggal ini (opsional).
  - `endDate`: Filter log sampai tanggal ini (opsional).
  - `limitFrom`: Pagination start (opsional).
  - `limitTo`: Pagination end (opsional).

- **Contoh**:

  ```bash
  GET /api/getData?app=testApp&startDate=2024-08-20&endDate=2024-08-29
  ```

- **Respons**:

  ```json
  [
    {
      "_id": "unique_log_id",
      "app": "string",
      "section": "string",
      "subsection": "string",
      "data": {},
      "createdAt": "timestamp",
      "key": "app-key if exists"
    },
    ...
  ]
  ```

### Pencarian Log dengan Elastic Search

- **URL**: `/api/elasticLogs/:app/:section/:subsection?`
- **Method**: `GET`
- **Deskripsi**: Mencari log berdasarkan aplikasi, bagian, sub-bagian, serta data yang ada dalam field `data` menggunakan regex.
- **Header Opsional**: `app-key` untuk memfilter log yang memiliki `key`.
- **Query Parameters**:
  - `data`: String yang akan dicari dalam beberapa field (`data.id`, `data._id`, `data.page`, `data.key`).
  
- **Contoh**:

  ```bash
  GET /api/elasticLogs/testApp/auth/login?data=fandilaz
  ```

- **Respons**:

  ```json
  [
    {
      "_id": "unique_log_id",
      "app": "string",
      "section": "string",
      "subsection": "string",
      "data": {
        "id": "string",
        "page": "string",
        "key": "string"
      },
      "createdAt": "timestamp"
    },
    ...
  ]
  ```

## Fitur Tambahan

### Caching

Aplikasi menggunakan cache sederhana berbasis in-memory untuk menyimpan respons API selama 60 detik. Ini membantu mengurangi beban pada database untuk data yang sering diakses.

### Pengawasan Utilisasi Eksternal

Aplikasi memposting data penggunaan log ke layanan monitoring eksternal setiap kali log ditambahkan atau diambil. Ini dapat dikonfigurasi menggunakan variabel lingkungan `HOSTUTILITOR` dan `TOKENUTILITOR`.

### Isolasi Keamanan dengan `app-key`

Setiap log dapat memiliki `key` yang disertakan dalam header `app-key`. Ketika mengambil log, jika `app-key` disediakan, hanya log yang memiliki `key` yang sama yang akan dikembalikan. Jika `app-key` tidak disediakan, hanya log tanpa `key` yang akan dikembalikan.

---

Dokumentasi ini bertujuan untuk membantu pengembang memahami cara menggunakan dan mengonfigurasi sistem manajemen log **Rockib** dengan fitur tambahan pencarian dinamis dan isolasi data berbasis `key`. Jangan ragu untuk memodifikasi sesuai kebutuhan proyek Anda.