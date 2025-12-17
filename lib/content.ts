'use server'

// Fungsi sementara untuk content statis saat development
export async function getContentByKey(key: string) {
  // Return default content untuk development
  const defaultContent = {
    'hero-title': {
      id: '1',
      key: 'hero-title',
      title: 'Selamat Datang di PPDB Online',
      content: 'SMK Pembangunan Cimahi',
      type: 'hero'
    },
    'hero-subtitle': {
      id: '2',
      key: 'hero-subtitle',
      title: 'Subtitle Hero',
      content: 'Bergabunglah dengan SMK terbaik di Cimahi. Raih masa depan gemilang bersama kami!',
      type: 'hero'
    },
    'info-pendaftaran': {
      id: '3',
      key: 'info-pendaftaran',
      title: 'Informasi Pendaftaran',
      content: 'Pendaftaran dibuka mulai 1 Maret 2024 hingga 30 April 2024.',
      type: 'info'
    },
    'kontak-sekolah': {
      id: '4',
      key: 'kontak-sekolah',
      title: 'Kontak Sekolah',
      content: 'Jl. Raya Cimahi No. 123, Cimahi | Telp: (022) 1234567 | Email: info@smkpembangunan.sch.id',
      type: 'contact'
    }
  };

  return defaultContent[key as keyof typeof defaultContent] || null;
}

// Get multiple content berdasarkan type
export async function getContentByType() {
  // Return empty array untuk development
  return [];
}

// Get pengaturan PPDB
export async function getPPDBSettings() {
  // Return default settings untuk development
  return {
    id: '1',
    tahunAjaran: '2024/2025',
    tanggalBuka: new Date('2024-03-01'),
    tanggalTutup: new Date('2024-04-30'),
    kuotaSiswa: 200,
    statusPendaftaran: 'buka',
    persyaratan: [
      'Ijazah SMP/MTs atau sederajat',
      'Kartu Keluarga',
      'Akta Kelahiran',
      'Pas foto 3x4 (3 lembar)',
      'Fotocopy KTP orang tua'
    ],
    alurPendaftaran: [
      'Registrasi online',
      'Upload dokumen',
      'Verifikasi data',
      'Pengumuman hasil'
    ],
    informasiTambahan: 'Untuk informasi lebih lanjut, silakan hubungi panitia PPDB.'
  };
}