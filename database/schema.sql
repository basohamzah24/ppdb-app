-- Script SQL untuk membuat tabel PPDB
-- Jalankan di database PostgreSQL Neon

-- Membuat tabel pendaftar
CREATE TABLE IF NOT EXISTS pendaftar (
  id SERIAL PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  nisn VARCHAR(10) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  asal_sekolah VARCHAR(100) NOT NULL,
  jalur_pendaftaran VARCHAR(20) NOT NULL CHECK (jalur_pendaftaran IN ('Zonasi', 'Prestasi', 'Afirmasi')),
  tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status_pendaftaran VARCHAR(20) DEFAULT 'Menunggu' CHECK (status_pendaftaran IN ('Menunggu', 'Diterima', 'Ditolak')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Membuat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_pendaftar_nisn ON pendaftar(nisn);
CREATE INDEX IF NOT EXISTS idx_pendaftar_email ON pendaftar(email);
CREATE INDEX IF NOT EXISTS idx_pendaftar_jalur ON pendaftar(jalur_pendaftaran);
CREATE INDEX IF NOT EXISTS idx_pendaftar_tanggal ON pendaftar(tanggal_daftar);

-- Membuat fungsi trigger untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Membuat trigger untuk auto-update updated_at
DROP TRIGGER IF EXISTS update_pendaftar_updated_at ON pendaftar;
CREATE TRIGGER update_pendaftar_updated_at 
    BEFORE UPDATE ON pendaftar 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Contoh data sample (opsional)
-- INSERT INTO pendaftar (nama_lengkap, nisn, email, asal_sekolah, jalur_pendaftaran) VALUES 
-- ('John Doe', '1234567890', 'john@email.com', 'SMP Negeri 1', 'Zonasi'),
-- ('Jane Smith', '0987654321', 'jane@email.com', 'SMP Negeri 2', 'Prestasi');