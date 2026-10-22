-- Untuk database online (Aiven): database sudah disediakan, jadi hanya perlu membuat tabel.
CREATE TABLE IF NOT EXISTS ucapan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kehadiran ENUM('hadir','tidak hadir','ragu') NOT NULL DEFAULT 'hadir',
  jumlah_tamu INT NOT NULL DEFAULT 1,
  ucapan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
