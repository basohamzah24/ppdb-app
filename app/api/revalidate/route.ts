import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path = '/' } = body

    // Revalidate specific path
    revalidatePath(path)
    
    // Also revalidate related paths
    revalidatePath('/')
    revalidatePath('/informasi')
    revalidatePath('/jadwal') 
    revalidatePath('/pendaftaran')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache revalidated successfully',
      revalidated: true,
      now: Date.now()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to revalidate' }, 
      { status: 500 }
    )
  }
}