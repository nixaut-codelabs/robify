import { NextResponse } from 'next/server';
import { searchFlags } from '@/lib/server/fflagService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 20;
    const offset = (page - 1) * limit;

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: 'Invalid "page" parameter. Page must be a positive integer.' },
        { status: 400 }
      );
    }

    const options = {
      limit,
      offset,
    };

    // searchFlags artık hem arama hem de listeleme için kullanılıyor.
    const results = searchFlags('', options);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in /api/fflags/list:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}