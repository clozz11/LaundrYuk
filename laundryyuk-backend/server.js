const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Register
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Enkripsi password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'customer')";
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Email atau Username mungkin sudah terdaftar" });
            }
            res.status(201).json({ message: "User berhasil didaftarkan!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// API Login
// API Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // --- LOGIKA HARDCODE ADMIN (UNTUK KEAMANAN AKSES) ---
    if (email === "admin@gmail.com" && password === "admin123") {
        return res.json({
            message: "Login Berhasil (Admin Mode)",
            user: { 
                id_user: 1, // Sesuaikan dengan ID admin di DB Anda
                username: "Administrator", 
                role: "admin" 
            }
        });
    }

    // --- LOGIKA NORMAL UNTUK USER LAIN ---
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (results.length === 0) return res.status(401).json({ message: "Email tidak ditemukan" });

        const user = results[0];
        
        // Cek password menggunakan bcrypt untuk user biasa
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Password salah" });

        res.json({
            message: "Login Berhasil",
            user: { 
                id_user: user.id_user || user.id, 
                username: user.username, 
                role: user.role 
            }
        });
    });
});

app.post('/api/laundry', (req, res) => {
    const { user_id, total_harga, alamat_order, tgl_laundry, id_layanan, berat } = req.body;

    const sqlLaundry = `
        INSERT INTO laundry 
        (user_id, id_harga, id_slot, total_berat, total_harga, alamat_order, status, tanggal_order) 
        VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `;
    
    const valuesLaundry = [user_id, id_layanan, 1, berat, total_harga, alamat_order, tgl_laundry];

    db.query(sqlLaundry, valuesLaundry, (err, result) => {
        if (err) {
            console.error("DETAIL ERROR MYSQL:", err.message); 
            return res.status(500).json({ message: "Gagal menyimpan data induk laundry: " + err.message });
        }

        const newLaundryId = result.insertId;

        const sqlDetail = "INSERT INTO detail_laundry (id_laundry, id_harga, jumlah, subtotal) VALUES (?, ?, ?, ?)";
        
        db.query(sqlDetail, [newLaundryId, id_layanan, berat, total_harga], (errDetail) => {
            if (errDetail) {
                console.error("ERROR DETAIL:", errDetail.message);
                return res.status(500).json({ message: "Gagal menyimpan detail laundry" });
            }
            res.status(200).json({ message: "Pesanan Berhasil Disimpan!" });
        });
    });
});

// API Ambil Pesanan Dalam Proses untuk User tertentu
app.get('/api/laundry/proses/:user_id', (req, res) => {
    const userId = req.params.user_id;
    
    // Ubah h.nama_layanan atau h.layanan menjadi h.jenis_layanan
    const sql = `
        SELECT l.*, h.jenis_layanan AS nama_layanan 
        FROM laundry l 
        LEFT JOIN harga h ON l.id_harga = h.id_harga 
        WHERE l.user_id = ? AND l.status != 'selesai'
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// Endpoint untuk mengambil semua pesanan laundry
app.get('/api/admin/orders', (req, res) => {
    const query = `
        SELECT 
            l.id_laundry AS order_id, 
            u.username AS buyer_name, 
            l.total_harga AS total_amount, 
            l.status, 
            l.tanggal_order AS created_at 
        FROM laundry l
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY l.tanggal_order DESC`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint untuk update status pesanan
app.put('/api/admin/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Memanggil procedure sp_update_status(id, status) sesuai file SQL
    const sql = "CALL sp_update_status(?, ?)";
    
    db.query(sql, [id, status], (err, result) => {
        if (err) {
            console.error("Error update status:", err);
            return res.status(500).json({ message: "Gagal update status" });
        }
        res.json({ message: "Status berhasil diperbarui" });
    });
});

// Endpoint untuk menyimpan ulasan pelanggan
app.post('/api/laundry/feedback', (req, res) => {
    const { id_laundry, rating, komentar } = req.body;

    // Query sesuai struktur tabel feedback di SQL Anda
    const sql = "INSERT INTO feedback (id_laundry, rating, komentar, created_at) VALUES (?, ?, ?, NOW())";
    
    db.query(sql, [id_laundry, rating, komentar], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            // Cek jika error karena sudah pernah memberi ulasan (Unique Constraint)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Anda sudah memberikan ulasan untuk pesanan ini." });
            }
            return res.status(500).json({ message: "Gagal menyimpan ulasan ke database." });
        }
        res.status(200).json({ message: "Ulasan berhasil disimpan!" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});