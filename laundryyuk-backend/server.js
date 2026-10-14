const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error('JWT_SECRET must be set and contain at least 32 characters.');
}

// Middleware
app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authorization = req.get('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Token autentikasi diperlukan.' });
    }

    try {
        const payload = jwt.verify(token, jwtSecret);
        if (
            !payload ||
            typeof payload !== 'object' ||
            !Number.isInteger(payload.userId) ||
            !['admin', 'customer'].includes(payload.role)
        ) {
            return res.status(401).json({ message: 'Token autentikasi tidak valid.' });
        }

        req.auth = { userId: payload.userId, role: payload.role };
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token autentikasi tidak valid atau kedaluwarsa.' });
        }
        return next(error);
    }
};

const requireRole = (role) => (req, res, next) => {
    if (req.auth.role !== role) {
        return res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengakses fitur ini.' });
    }
    return next();
};

// API Register
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, dan password wajib diisi.' });
    }

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
        console.error('Gagal memproses registrasi:', error);
        res.status(500).json({ message: "Server error" });
    }
});

// API Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (results.length === 0) return res.status(401).json({ message: "Email tidak ditemukan" });

        const user = results[0];
        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ message: "Password salah" });

            const userId = user.id_user || user.id;
            if (!Number.isInteger(userId) || !['admin', 'customer'].includes(user.role)) {
                return res.status(500).json({ message: 'Data akun tidak valid.' });
            }

            const token = jwt.sign(
                { userId, role: user.role },
                jwtSecret,
                { expiresIn: '8h' }
            );

            return res.json({
                message: "Login Berhasil",
                token,
                user: {
                    id_user: userId,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Gagal memverifikasi password:', error);
            return res.status(500).json({ message: 'Gagal memverifikasi akun.' });
        }
    });
});

app.post('/api/laundry', authenticateToken, requireRole('customer'), (req, res) => {
    const { total_harga, alamat_order, nomor_telepon, tgl_laundry, id_layanan, berat } = req.body;

    const sqlLaundry = `
        INSERT INTO laundry 
        (user_id, id_harga, id_slot, total_berat, total_harga, alamat_order, nomor_telepon, status, tanggal_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `;
    
    const valuesLaundry = [
        req.auth.userId, id_layanan, 1, berat, total_harga, alamat_order,
        nomor_telepon, tgl_laundry
    ];

    db.query(sqlLaundry, valuesLaundry, (err, result) => {
        if (err) {
            console.error("DETAIL ERROR MYSQL:", err.message); 
            return res.status(500).json({ message: "Gagal menyimpan pesanan laundry." });
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

// Return the signed-in customer's orders; the frontend separates active and completed orders.
app.get('/api/laundry/proses', authenticateToken, requireRole('customer'), (req, res) => {
    const sql = `
        SELECT l.*, h.jenis_layanan AS nama_layanan 
        FROM laundry l 
        LEFT JOIN harga h ON l.id_harga = h.id_harga 
        WHERE l.user_id = ?
    `;

    db.query(sql, [req.auth.userId], (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ message: "Gagal mengambil pesanan." });
        }
        res.json(results);
    });
});

// Endpoint untuk mengambil semua pesanan laundry
app.get('/api/admin/orders', authenticateToken, requireRole('admin'), (req, res) => {
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
            return res.status(500).json({ message: "Gagal mengambil daftar pesanan." });
        }
        res.json(results);
    });
});

// Endpoint untuk update status pesanan
app.put('/api/admin/orders/:id', authenticateToken, requireRole('admin'), (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'on_progress', 'ready_for_pickup', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status pesanan tidak valid.' });
    }

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
app.post('/api/laundry/feedback', authenticateToken, requireRole('customer'), (req, res) => {
    const { id_laundry, rating, komentar } = req.body;

    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 || !komentar?.trim()) {
        return res.status(400).json({ message: 'Rating 1-5 dan komentar wajib diisi.' });
    }

    const orderQuery = "SELECT id_laundry FROM laundry WHERE id_laundry = ? AND user_id = ? AND status = 'completed'";
    db.query(orderQuery, [id_laundry, req.auth.userId], (orderError, orders) => {
        if (orderError) {
            console.error('Gagal memeriksa pesanan untuk ulasan:', orderError);
            return res.status(500).json({ message: 'Gagal memeriksa pesanan.' });
        }
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Pesanan selesai tidak ditemukan untuk akun ini.' });
        }

        insertFeedback();
    });

    const sql = "INSERT INTO feedback (id_laundry, rating, komentar, created_at) VALUES (?, ?, ?, NOW())";

    function insertFeedback() {
        db.query(sql, [id_laundry, Number(rating), komentar.trim()], (err) => {
            if (err) {
                console.error("Database Error:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Anda sudah memberikan ulasan untuk pesanan ini." });
                }
                return res.status(500).json({ message: "Gagal menyimpan ulasan ke database." });
            }
            return res.status(200).json({ message: "Ulasan berhasil disimpan!" });
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});