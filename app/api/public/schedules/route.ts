import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ambil jadwal yang aktif
    const schedules = await prisma.schedule.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { order: 'asc' },
        { startDate: 'asc' }
      ],
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
        location: true,
        type: true,
        order: true,
        updatedAt: true
      }
    });

    console.log('📅 Public schedules loaded:', schedules.length, 'items');
    
    return NextResponse.json(
      { schedules },
      { 
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('❌ Error loading public schedules:', error);
    return NextResponse.json(
      { error: 'Gagal memuat jadwal', schedules: [] },
      { status: 500 }
    );
  }
}