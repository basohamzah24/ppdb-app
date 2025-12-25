import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📊 Generating report...')
    await prisma.$connect()

    // Ambil data untuk laporan
    const [
      totalPendaftar,
      pendaftarPerJalur,
      pendaftarPerStatus
    ] = await Promise.all([
      // Total pendaftar
      prisma.pendaftar.count(),
      
      // Pendaftar per jalur
      prisma.pendaftar.groupBy({
        by: ['jalurPendaftaran'],
        _count: {
          id: true
        }
      }),
      
      // Pendaftar per status
      prisma.pendaftar.groupBy({
        by: ['statusPendaftaran'],
        _count: {
          id: true
        }
      })
    ])

    console.log('📊 Report stats:', { totalPendaftar, pendaftarPerJalur, pendaftarPerStatus })

    // Ambil detail pendaftar untuk CSV
    const pendaftarDetails = await prisma.pendaftar.findMany({
      select: {
        noPendaftaran: true,
        nama: true,
        nik: true,
        tempatLahir: true,
        tanggalLahir: true,
        jenisKelamin: true,
        agama: true,
        alamat: true,
        jalurPendaftaran: true,
        asalSekolah: true,
        statusPendaftaran: true,
        tanggalDaftar: true,
        orangTua: {
          select: {
            namaAyah: true,
            namaIbu: true,
            noTelp: true,
            email: true
          }
        }
      },
      orderBy: {
        tanggalDaftar: 'desc'
      }
    })

    console.log('📊 Pendaftar details:', pendaftarDetails.length, 'records')

    // Prepare data for Excel
    const excelData = [
      // Header row
      [
        'No Pendaftaran',
        'Nama',
        'NIK',
        'Tempat Lahir',
        'Tanggal Lahir',
        'Jenis Kelamin',
        'Agama',
        'Alamat',
        'Jalur Pendaftaran',
        'Asal Sekolah',
        'Status Pendaftaran',
        'Nama Ayah',
        'Nama Ibu',
        'No Telepon',
        'Email',
        'Tanggal Daftar'
      ],
      // Data rows
      ...pendaftarDetails.map(pendaftar => {
        const orangTua = pendaftar.orangTua[0]
        
        return [
          pendaftar.noPendaftaran,
          pendaftar.nama,
          pendaftar.nik,
          pendaftar.tempatLahir,
          pendaftar.tanggalLahir.toISOString().split('T')[0],
          pendaftar.jenisKelamin,
          pendaftar.agama,
          pendaftar.alamat,
          pendaftar.jalurPendaftaran,
          pendaftar.asalSekolah || '-',
          pendaftar.statusPendaftaran,
          orangTua?.namaAyah || '-',
          orangTua?.namaIbu || '-',
          orangTua?.noTelp || '-',
          orangTua?.email || '-',
          pendaftar.tanggalDaftar.toISOString().split('T')[0]
        ]
      })
    ]

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(excelData)

    // Set column widths
    const colWidths = [
      { wch: 15 }, // No Pendaftaran
      { wch: 25 }, // Nama
      { wch: 18 }, // NIK
      { wch: 15 }, // Tempat Lahir
      { wch: 12 }, // Tanggal Lahir
      { wch: 12 }, // Jenis Kelamin
      { wch: 10 }, // Agama
      { wch: 30 }, // Alamat
      { wch: 15 }, // Jalur Pendaftaran
      { wch: 20 }, // Asal Sekolah
      { wch: 15 }, // Status
      { wch: 20 }, // Nama Ayah
      { wch: 20 }, // Nama Ibu
      { wch: 15 }, // No Telepon
      { wch: 25 }, // Email
      { wch: 12 }  // Tanggal Daftar
    ]
    ws['!cols'] = colWidths

    // Style header row
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center", vertical: "center" }
    }

    // Apply header style to first row
    for (let col = 0; col < excelData[0].length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle
      }
    }

    // Add summary sheet
    const summaryData = [
      ['RINGKASAN LAPORAN PPDB'],
      [''],
      ['Statistik Pendaftaran'],
      ['Total Pendaftar', totalPendaftar],
      ['Jalur Reguler', pendaftarPerJalur.find(j => j.jalurPendaftaran === 'reguler')?._count.id || 0],
      ['Jalur Prestasi', pendaftarPerJalur.find(j => j.jalurPendaftaran === 'prestasi')?._count.id || 0],
      [''],
      ['Status Pendaftaran'],
      ...pendaftarPerStatus.map(status => [
        status.statusPendaftaran.charAt(0).toUpperCase() + status.statusPendaftaran.slice(1),
        status._count.id
      ]),
      [''],
      ['Tanggal Generate', new Date().toLocaleString('id-ID')]
    ]

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 15 }]

    // Add both sheets to workbook
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Ringkasan')
    XLSX.utils.book_append_sheet(wb, ws, 'Data Pendaftar')

    // Generate Excel buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    // Return Excel file
    const fileName = `laporan-ppdb-${new Date().toISOString().split('T')[0]}.xlsx`
    
    console.log('✅ Excel report generated successfully:', fileName)
    
    return new Response(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('❌ Error generating report:', error)
    return NextResponse.json(
      { error: 'Gagal membuat laporan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Method lain tidak diizinkan
export async function POST() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}