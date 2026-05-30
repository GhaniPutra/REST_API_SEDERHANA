// index.js
const express = require('express');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

// Middleware untuk memparsing JSON
app.use(express.json());

// Serve file statis dari folder public (UI Testing Dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. ENDPOINT PRODUK (PRODUCTS)
// ==========================================

// GET /api/products - Menampilkan semua produk
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM produk');
    res.json({
      success: true,
      message: 'Berhasil mengambil semua produk',
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil produk',
      error: error.message
    });
  }
});

// POST /api/products - Menambah produk baru
app.post('/api/products', async (req, res) => {
  const { name, price, stock, category } = req.body;

  // Validasi input
  if (!name || price === undefined || stock === undefined || !category) {
    return res.status(400).json({
      success: false,
      message: 'Field name, price, stock, dan category wajib diisi'
    });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO produk (name, price, stock, category) VALUES (?, ?, ?, ?)',
      [name, price, stock, category]
    );

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: {
        id: result.insertId,
        name,
        price,
        stock,
        category
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan produk',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Mengupdate data produk (Harga/Stok) berdasarkan ID
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { price, stock, name, category } = req.body;

  try {
    // Pastikan produk ada
    const [existing] = await db.query('SELECT * FROM produk WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Produk dengan ID ${id} tidak ditemukan`
      });
    }

    // Bangun query secara dinamis
    const updates = [];
    const values = [];

    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (stock !== undefined) {
      updates.push('stock = ?');
      values.push(stock);
    }
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Harap kirim setidaknya satu field (price/stock/name/category) untuk diupdate'
      });
    }

    values.push(id);
    await db.query(`UPDATE produk SET ${updates.join(', ')} WHERE id = ?`, values);

    // Ambil data produk terbaru
    const [updatedProduct] = await db.query('SELECT * FROM produk WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: updatedProduct[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate produk',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Menghapus produk berdasarkan ID
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Pastikan produk ada
    const [existing] = await db.query('SELECT * FROM produk WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Produk dengan ID ${id} tidak ditemukan`
      });
    }

    await db.query('DELETE FROM produk WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Produk dengan ID ${id} berhasil dihapus`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus produk',
      error: error.message
    });
  }
});


// ==========================================
// 2. ENDPOINT KATEGORI (CATEGORIES)
// ==========================================

// GET /api/categories - Menampilkan semua kategori
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kategori');
    res.json({
      success: true,
      message: 'Berhasil mengambil semua kategori',
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil kategori',
      error: error.message
    });
  }
});

// POST /api/categories - Menambah kategori baru
app.post('/api/categories', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Field name kategori wajib diisi'
    });
  }

  try {
    const [result] = await db.query('INSERT INTO kategori (name) VALUES (?)', [name]);
    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: {
        id: result.insertId,
        name
      }
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: `Kategori '${name}' sudah ada`
      });
    }
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan kategori',
      error: error.message
    });
  }
});

// PUT /api/categories/:id - Mengupdate nama kategori berdasarkan ID
app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Field name kategori wajib diisi'
    });
  }

  try {
    const [existing] = await db.query('SELECT * FROM kategori WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Kategori dengan ID ${id} tidak ditemukan`
      });
    }

    await db.query('UPDATE kategori SET name = ? WHERE id = ?', [name, id]);

    res.json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: { id: parseInt(id), name }
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: `Kategori '${name}' sudah ada`
      });
    }
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate kategori',
      error: error.message
    });
  }
});

// DELETE /api/categories/:id - Menghapus kategori berdasarkan ID
app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query('SELECT * FROM kategori WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Kategori dengan ID ${id} tidak ditemukan`
      });
    }

    await db.query('DELETE FROM kategori WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Kategori dengan ID ${id} berhasil dihapus`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kategori',
      error: error.message
    });
  }
});


// Jalankan server Express
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
