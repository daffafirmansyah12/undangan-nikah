const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const STATUS = ['hadir', 'tidak hadir', 'ragu'];

function validasi(body) {
  const nama = String(body.nama || '').trim();
  const kehadiran = body.kehadiran;
  const jumlah = parseInt(body.jumlah_tamu, 10);
  const ucapan = String(body.ucapan || '').trim();
  if (!nama || nama.length > 100) return { error: 'Nama wajib diisi (maks. 100 karakter)' };
  if (!STATUS.includes(kehadiran)) return { error: 'Status kehadiran tidak valid' };
  if (!(jumlah >= 1 && jumlah <= 10)) return { error: 'Jumlah tamu 1-10' };
  if (ucapan.length > 500) return { error: 'Ucapan maksimal 500 karakter' };
  return { nama, kehadiran, jumlah, ucapan };
}

// READ
app.get('/api/ucapan', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ucapan ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal mengambil data' });
  }
});

// CREATE
app.post('/api/ucapan', async (req, res) => {
  const v = validasi(req.body);
  if (v.error) return res.status(400).json({ pesan: v.error });
  try {
    await db.execute(
      'INSERT INTO ucapan (nama, kehadiran, jumlah_tamu, ucapan) VALUES (?,?,?,?)',
      [v.nama, v.kehadiran, v.jumlah, v.ucapan]
    );
    res.status(201).json({ pesan: 'Terima kasih, konfirmasi Anda tersimpan' });
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal menyimpan data' });
  }
});

// UPDATE
app.put('/api/ucapan/:id', async (req, res) => {
  const v = validasi(req.body);
  if (v.error) return res.status(400).json({ pesan: v.error });
  try {
    const [hasil] = await db.execute(
      'UPDATE ucapan SET nama=?, kehadiran=?, jumlah_tamu=?, ucapan=? WHERE id=?',
      [v.nama, v.kehadiran, v.jumlah, v.ucapan, req.params.id]
    );
    if (!hasil.affectedRows) return res.sendStatus(404);
    res.json({ pesan: 'Data diperbarui' });
  } catch (err) { res.sendStatus(500); }
});

// DELETE
app.delete('/api/ucapan/:id', async (req, res) => {
  try {
    const [hasil] = await db.execute('DELETE FROM ucapan WHERE id=?', [req.params.id]);
    if (!hasil.affectedRows) return res.sendStatus(404);
    res.json({ pesan: 'Data dihapus' });
  } catch (err) { res.sendStatus(500); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Undangan berjalan di port ' + PORT));
