import { NextResponse } from 'next/server';
import { getFlagsStats } from '@/lib/server/fflagService';

// This is now the stats endpoint
export async function GET() {
  try {
    const stats = getFlagsStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in /api/fflags/stats:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}