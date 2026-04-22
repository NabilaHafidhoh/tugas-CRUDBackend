const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

/* ========================
   CREATE (POST)
======================== */
app.post('/peserta', async (req, res) => {
    try {
        const {
            nama, lahir, agama, alamat, no_telp, jk, hobi, foto
        } = req.body;

        // Pastikan jumlah kolom ($1-$8) sama dengan jumlah isi array
        const result = await pool.query(
            `INSERT INTO peserta 
            (nama, lahir, agama, alamat, no_telp, jk, hobi, foto)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [nama, lahir, agama, alamat, no_telp, jk, hobi, foto]
        );

        res.json(result.rows[0]);

    } catch (err) {
        // Jika error "kolom tempatlahir tidak ada" muncul lagi, 
        // ganti kata 'lahir' di query atas menjadi 'tempatlahir'
        res.status(500).json({ error: err.message });
    }
});

/* ========================
   READ ALL (GET)
======================== */
app.get('/peserta', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM peserta ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ========================
   READ BY ID (GET)
======================== */
app.get('/peserta/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM peserta WHERE id = $1',
            [req.params.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ========================
   UPDATE (PUT)
======================== */
app.put('/peserta/:id', async (req, res) => {
    try {
        const {
            nama, lahir, agama, alamat, no_telp, jk, hobi, foto
        } = req.body;

        const result = await pool.query(
            `UPDATE peserta SET
            nama=$1, lahir=$2, agama=$3,
            alamat=$4, no_telp=$5, jk=$6,
            hobi=$7, foto=$8
            WHERE id=$9
            RETURNING *`,
            [nama, lahir, agama, alamat, no_telp, jk, hobi, foto, req.params.id]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ========================
   DELETE
======================== */
app.delete('/peserta/:id', async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM peserta WHERE id = $1',
            [req.params.id]
        );

        res.json({ message: 'Data berhasil dihapus' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running di http://localhost:3000');
});