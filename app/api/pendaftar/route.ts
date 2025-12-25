import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nama, 
      nik, 
      tempat_lahir, 
      tanggal_lahir, 
      jenis_kelamin, 
      alamat, 
      nama_ayah, 
      nama_ibu, 
      no_telp, 
      email 
    } = body;

    // Validasi input
    if (!nama || !nik || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || 
        !alamat || !nama_ayah || !nama_ibu || !no_telp) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Validasi NIK
    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        { error: 'NIK harus terdiri dari 16 digit angka' },
        { status: 400 }
      );
    }

    // Validasi email jika ada
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Format email tidak valid' },
          { status: 400 }
        );
      }
    }

    // Validasi jenis kelamin
    const validGender = ['Laki-laki', 'Perempuan'];
    if (!validGender.includes(jenis_kelamin)) {
      return NextResponse.json(
        { error: 'Jenis kelamin tidak valid' },
        { status: 400 }
      );
    }

    // Validasi nomor telepon
    if (!/^(\+62|62|0)[0-9]{9,13}$/.test(no_telp)) {
      return NextResponse.json(
        { error: 'Format nomor telepon tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah NIK sudah ada
    const existingByNik = await prisma.pendaftar.findUnique({
      where: { nik }
    });
    
    if (existingByNik) {
      return NextResponse.json(
        { error: 'NIK sudah terdaftar sebelumnya' },
        { status: 409 }
      );
    }

    // Cek apakah email sudah ada (jika email diberikan)
    if (email) {
      const existingByEmail = await prisma.orangTua.findFirst({
        where: { email }
      });
      
      if (existingByEmail) {
        return NextResponse.json(
          { error: 'Email sudah terdaftar sebelumnya' },
          { status: 409 }
        );
      }
    }

    // Konversi tanggal_lahir ke Date object
    const birthDate = new Date(tanggal_lahir);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: 'Format tanggal lahir tidak valid' },
        { status: 400 }
      );
    }

    // Generate nomor pendaftaran
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const noPendaftaran = `PPDB-${year}${month}${day}-${Date.now().toString().slice(-6)}`;

    // Insert data pendaftar menggunakan Prisma
    const newPendaftar = await prisma.pendaftar.create({
      data: {
        noPendaftaran,
        nama,
        nik,
        tempatLahir: tempat_lahir,
        tanggalLahir: birthDate,
        jenisKelamin: jenis_kelamin,
        alamat,
        agama: 'Islam', // default value
        jalurPendaftaran: 'regular', // default value
        statusPendaftaran: 'draft',
        orangTua: {
          create: {
            namaAyah: nama_ayah,
            namaIbu: nama_ibu,
            noTelp: no_telp,
            email: email || null
          }
        }
      },
      include: {
        orangTua: true
      }
    });
      
    return NextResponse.json({
      message: 'Pendaftaran berhasil',
      data: {
        id: newPendaftar.id,
        noPendaftaran: newPendaftar.noPendaftaran,
        nama: newPendaftar.nama,
        nik: newPendaftar.nik,
        tempatLahir: newPendaftar.tempatLahir,
        tanggalLahir: newPendaftar.tanggalLahir,
        jenisKelamin: newPendaftar.jenisKelamin,
        alamat: newPendaftar.alamat,
        orangTua: newPendaftar.orangTua,
        createdAt: newPendaftar.createdAt,
        updatedAt: newPendaftar.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Database error:', error);
    
    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Data sudah terdaftar sebelumnya' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('Connection')) {
        return NextResponse.json(
          { error: 'Gagal terhubung ke database' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan server internal' },
      { status: 500 }
    );
  }
}

// GET method untuk retrieve data
export async function GET() {
  try {
    const pendaftarList = await prisma.pendaftar.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalPendaftar = await prisma.pendaftar.count();
    
    return NextResponse.json({
      data: pendaftarList,
      total: totalPendaftar,
      message: 'Data pendaftar berhasil diambil'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server internal' },
      { status: 500 }
    );
  }
}

