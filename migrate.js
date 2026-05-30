// migrate.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPass = process.env.DB_PASS || '';
  const dbName = process.env.DB_NAME || 'backend_2';

  console.log(`Menghubungkan ke MySQL di ${dbHost} sebagai ${dbUser}...`);

  // Hubungkan ke server MySQL tanpa memilih database terlebih dahulu
  const connection = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPass,
  });

  // 1. Buat database dengan nama backend_2 jika belum ada
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  console.log(`Database '${dbName}' siap (dibuat atau sudah ada).`);

  // Gunakan database tersebut
  await connection.query(`USE \`${dbName}\``);

  // 2. Buat tabel produk sesuai spesifikasi
  await connection.query(`
    CREATE TABLE IF NOT EXISTS produk (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name TEXT NOT NULL,
      price INT NOT NULL,
      stock INT NOT NULL,
      category TEXT NOT NULL
    )
  `);
  console.log(`Tabel 'produk' siap (dibuat atau sudah ada).`);

  // 3. Buat tabel kategori
  await connection.query(`
    CREATE TABLE IF NOT EXISTS kategori (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    )
  `);
  console.log(`Tabel 'kategori' siap (dibuat atau sudah ada).`);

  await connection.end();
  console.log('✅ Migrasi database backend_2, tabel produk, dan tabel kategori berhasil diselesaikan!');
}

migrate().catch((err) => {
  console.error('❌ Terjadi kesalahan saat migrasi:', err);
  process.exit(1);
});
