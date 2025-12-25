import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Ambil semua jadwal
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { order: 'asc' },
        { startDate: 'asc' }
      ]
    });

    console.log('✅ Schedules loaded:', schedules.length, 'items');
    return NextResponse.json({ schedules });
  } catch (error) {
    console.error('❌ Error loading schedules:', error);
    return NextResponse.json(
      { error: 'Gagal memuat jadwal' },
      { status: 500 }
    );
  }
}

// POST - Tambah jadwal baru
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('📋 Creating new schedule:', data);

    // Validasi data
    if (!data.title || !data.startDate) {
      return NextResponse.json(
        { error: 'Title dan tanggal mulai harus diisi' },
        { status: 400 }
      );
    }

    // Buat jadwal baru
    const newSchedule = await prisma.schedule.create({
      data: {
        title: data.title,
        description: data.description || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        location: data.location || null,
        type: data.type || 'regular',
        order: parseInt(data.order) || 0,
        createdBy: 'admin' // hardcode for now
      }
    });

    console.log('✅ Schedule created:', newSchedule.id);
    return NextResponse.json({ 
      message: 'Jadwal berhasil dibuat',
      schedule: newSchedule 
    });

  } catch (error) {
    console.error('❌ Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Gagal membuat jadwal' },
      { status: 500 }
    );
  }
}

// PUT - Update jadwal
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    console.log('📝 Updating schedule:', id, updateData);

    if (!id) {
      return NextResponse.json(
        { error: 'ID jadwal diperlukan' },
        { status: 400 }
      );
    }

    // Update jadwal
    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
        order: updateData.order ? parseInt(updateData.order) : undefined,
        updatedAt: new Date()
      }
    });

    console.log('✅ Schedule updated:', id);
    return NextResponse.json({ 
      message: 'Jadwal berhasil diperbarui',
      schedule: updatedSchedule 
    });

  } catch (error) {
    console.error('❌ Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui jadwal' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus jadwal (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('🗑️ Deleting schedule:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'ID jadwal diperlukan' },
        { status: 400 }
      );
    }

    // Soft delete - set isActive ke false
    await prisma.schedule.update({
      where: { id },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });

    console.log('✅ Schedule deleted (soft):', id);
    return NextResponse.json({ 
      message: 'Jadwal berhasil dihapus' 
    });

  } catch (error) {
    console.error('❌ Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus jadwal' },
      { status: 500 }
    );
  }
}