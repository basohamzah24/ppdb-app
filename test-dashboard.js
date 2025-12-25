const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDashboardData() {
  try {
    console.log('📊 Testing Dashboard Data...');
    
    const totalPendaftar = await prisma.pendaftar.count();
    const pendaftarHariIni = await prisma.pendaftar.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    
    const pendaftarDenganDokumen = await prisma.pendaftar.count({
      where: {
        dokumen: {
          some: {}
        }
      }
    });
    
    // Hitung yang memiliki minimal 3 dokumen
    const pendaftarDenganJumlahDokumen = await prisma.pendaftar.findMany({
      select: {
        _count: {
          select: {
            dokumen: true
          }
        }
      }
    });
    
    const dokumenLengkap = pendaftarDenganJumlahDokumen.filter(
      pendaftar => pendaftar._count.dokumen >= 3
    ).length;

    const menungguVerifikasi = Math.max(0, pendaftarDenganDokumen - dokumenLengkap);
    
    console.log('📊 Dashboard Stats:');
    console.log('Total Pendaftar:', totalPendaftar);
    console.log('Pendaftar Hari Ini:', pendaftarHariIni);
    console.log('Pendaftar dengan Dokumen:', pendaftarDenganDokumen);
    console.log('Dokumen Lengkap (>=3 docs):', dokumenLengkap);
    console.log('Menunggu Verifikasi:', menungguVerifikasi);
    
    console.log('\n✅ Dashboard API should show these numbers!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboardData();