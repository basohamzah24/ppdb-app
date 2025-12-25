const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testReportGeneration() {
  try {
    console.log('🧪 Testing report generation...');
    
    // Test data query
    const totalPendaftar = await prisma.pendaftar.count();
    const pendaftarPerJalur = await prisma.pendaftar.groupBy({
      by: ['jalurPendaftaran'],
      _count: { id: true }
    });
    
    console.log('📊 Report data:');
    console.log('Total Pendaftar:', totalPendaftar);
    console.log('Per Jalur:', pendaftarPerJalur);
    
    if (totalPendaftar > 0) {
      console.log('✅ Data available for Excel report generation');
      console.log('💡 You can now download XLSX reports from /admin/laporan');
    } else {
      console.log('⚠️  No data found. Consider adding sample data first.');
    }
    
  } catch (error) {
    console.error('❌ Error testing report:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testReportGeneration();