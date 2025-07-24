import { NextResponse } from 'next/server';
import { getFlagByName, getFlagsByNames } from '@/lib/server/fflagService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const flagName = searchParams.get('flag');

    if (!flagName) {
      return NextResponse.json(
        { error: 'The "flag" query parameter is required.' },
        { status: 400 }
      );
    }

    const flag = getFlagByName(flagName);

    if (!flag) {
      return NextResponse.json(
        { error: `Flag "${flagName}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(flag);
  } catch (error) {
    console.error('Error in /api/fflags/get:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const flagNames = body.flags;

    if (!Array.isArray(flagNames)) {
      return NextResponse.json(
        { error: 'Request body must be an array of flag names in the "flags" property.' },
        { status: 400 }
      );
    }

    if (flagNames.length > 500) {
      return NextResponse.json(
        { error: 'You can request a maximum of 500 flags per request.' },
        { status: 413 } // 413 Payload Too Large
      );
    }

    const flags = getFlagsByNames(flagNames);

    return NextResponse.json(flags);

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
    }
    console.error('Error in POST /api/fflags/get:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}