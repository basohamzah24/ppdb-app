const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleData() {
  try {
    console.log('🌱 Adding sample data for dashboard...');
    
    // Tambah beberapa pendaftar
    for (let i = 1; i <= 5; i++) {
      const noPendaftaran = 'PPDB2025' + String(i).padStart(3, '0');
      const nik = '32010' + String(i).padStart(11, '0');
      
      const pendaftar = await prisma.pendaftar.create({
        data: {
          noPendaftaran: noPendaftaran,
          nama: 'Siswa Test ' + i,
          nik: nik,
          tempatLahir: 'Jakarta',
          tanggalLahir: new Date('201' + (i % 5) + '-01-01'),
          jenisKelamin: i % 2 === 0 ? 'Perempuan' : 'Laki-laki',
          agama: 'Islam',
          alamat: 'Jalan Test ' + i + ', Jakarta',
          jalurPendaftaran: 'reguler',
          statusPendaftaran: i <= 2 ? 'submit' : 'draft'
        }
      });
      
      await prisma.orangTua.create({
        data: {
          pendaftarId: pendaftar.id,
          namaAyah: 'Ayah Test ' + i,
          namaIbu: 'Ibu Test ' + i,
          noTelp: '08123456789' + i,
          email: 'ortu' + i + '@test.com'
        }
      });
      
      // Tambah beberapa dokumen
      const dokumenTypes = ['foto', 'ijazah', 'kk', 'akta_lahir'];
      const jumlahDokumen = i > 3 ? 4 : 2;
      
      for (let j = 0; j < jumlahDokumen; j++) {
        await prisma.dokumen.create({
          data: {
            pendaftarId: pendaftar.id,
            jenisDokumen: dokumenTypes[j],
            namaFile: 'dokumen_' + dokumenTypes[j] + '_' + i + '.pdf',
            ukuranFile: 1024,
            pathFile: '/uploads/dokumen_' + dokumenTypes[j] + '_' + i + '.pdf'
          }
        });
      }
    }
    
    console.log('✅ Sample data added successfully!');
    console.log('📊 Dashboard should now show proper statistics');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleData();