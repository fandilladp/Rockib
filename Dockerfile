# Menggunakan image Node.js versi 20 dengan basis Alpine
FROM node:20-alpine

# Mengatur direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json ke dalam direktori kerja
COPY package*.json ./

# Menginstal dependencies
RUN npm install

# Menyalin seluruh kode aplikasi ke dalam direktori kerja
COPY . .

# Mengekspos port yang digunakan oleh aplikasi
EXPOSE 5000

# Menjalankan perintah untuk memulai aplikasi
CMD ["node", "index.js"]
