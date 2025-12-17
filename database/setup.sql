-- Jalankan script ini di psql untuk setup database PPDB
-- Connection: postgresql://neondb_owner:npg_znVT4IQZy8SA@ep-dawn-shape-a1ndtq31-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

-- 1. Buat tabel pendaftar
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

-- 2. Buat index untuk performance
CREATE INDEX IF NOT EXISTS idx_pendaftar_nisn ON pendaftar(nisn);
CREATE INDEX IF NOT EXISTS idx_pendaftar_email ON pendaftar(email);
CREATE INDEX IF NOT EXISTS idx_pendaftar_jalur ON pendaftar(jalur_pendaftaran);
CREATE INDEX IF NOT EXISTS idx_pendaftar_tanggal ON pendaftar(tanggal_daftar);

-- 3. Buat function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Buat trigger untuk auto-update
DROP TRIGGER IF EXISTS update_pendaftar_updated_at ON pendaftar;
CREATE TRIGGER update_pendaftar_updated_at 
    BEFORE UPDATE ON pendaftar 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Insert sample data (opsional - hapus jika tidak diperlukan)
INSERT INTO pendaftar (nama_lengkap, nisn, email, asal_sekolah, jalur_pendaftaran) 
VALUES 
('Ahmad Sudrajat', '1234567890', 'ahmad@email.com', 'SMP Negeri 1 Jakarta', 'Zonasi'),
('Siti Nurhaliza', '0987654321', 'siti@email.com', 'SMP Negeri 2 Jakarta', 'Prestasi'),
('Budi Santoso', '1122334455', 'budi@email.com', 'SMP Swasta Al-Azhar', 'Afirmasi')
ON CONFLICT (nisn) DO NOTHING;

-- 6. Verify table creation
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'pendaftar'
ORDER BY ordinal_position;