import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSchedules() {
  console.log('🌱 Seeding schedule data...');

  try {
    // Hapus data lama (jika ada)
    await prisma.schedule.deleteMany({});

    // Data jadwal sample
    const scheduleData = [
      {
        title: 'Sosialisasi PPDB 2025',
        description: 'Penyebarluasan informasi tentang PPDB 2025 kepada masyarakat melalui berbagai media',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-15'),
        startTime: '08:00',
        endTime: '16:00',
        location: 'Online & Sekolah',
        type: 'regular',
        order: 1,
        createdBy: 'admin'
      },
      {
        title: 'Pendaftaran Online Dibuka',
        description: 'Pendaftaran online melalui website resmi sekolah mulai dibuka untuk semua jalur',
        startDate: new Date('2025-05-16'),
        endDate: new Date('2025-06-15'),
        startTime: '00:00',
        endTime: '23:59',
        location: 'Website Sekolah',
        type: 'important',
        order: 2,
        createdBy: 'admin'
      },
      {
        title: 'Verifikasi Berkas',
        description: 'Verifikasi dokumen dan berkas persyaratan pendaftaran oleh tim verifikasi sekolah',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        startTime: '08:00',
        endTime: '15:00',
        location: 'Ruang TU Sekolah',
        type: 'regular',
        order: 3,
        createdBy: 'admin'
      },
      {
        title: 'Batas Akhir Pendaftaran',
        description: 'Batas terakhir untuk melengkapi semua persyaratan pendaftaran PPDB 2025',
        startDate: new Date('2025-06-15'),
        startTime: '23:59',
        location: 'Online',
        type: 'deadline',
        order: 4,
        createdBy: 'admin'
      },
      {
        title: 'Pengumuman Hasil Seleksi',
        description: 'Pengumuman hasil seleksi PPDB untuk semua jalur pendaftaran',
        startDate: new Date('2025-06-20'),
        startTime: '10:00',
        location: 'Website & Papan Pengumuman',
        type: 'important',
        order: 5,
        createdBy: 'admin'
      },
      {
        title: 'Daftar Ulang Siswa Diterima',
        description: 'Daftar ulang bagi siswa yang dinyatakan lulus seleksi PPDB',
        startDate: new Date('2025-06-25'),
        endDate: new Date('2025-06-30'),
        startTime: '08:00',
        endTime: '14:00',
        location: 'Sekolah',
        type: 'regular',
        order: 6,
        createdBy: 'admin'
      }
    ];

    // Insert data
    for (const data of scheduleData) {
      await prisma.schedule.create({
        data
      });
      console.log('✅ Created schedule:', data.title);
    }

    console.log('🎉 Schedule seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding schedules:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedSchedules();