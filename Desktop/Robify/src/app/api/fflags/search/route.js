import { NextResponse } from 'next/server';
import { searchFlags } from '@/lib/server/fflagService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('flag') || '';
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const impact = searchParams.get('impact');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0 || limit > 100) {
        return NextResponse.json(
            { error: 'Invalid "limit" or "offset" parameter. Limit must be between 1 and 100. Offset must be a non-negative integer.' },
            { status: 400 }
        );
    }

    const options = {
        category,
        type,
        status,
        impact,
        platform,
        limit,
        offset
    };

    const results = searchFlags(query, options);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in /api/fflags/search:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}