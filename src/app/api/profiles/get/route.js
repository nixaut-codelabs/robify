import { NextResponse } from 'next/server';
import { getProfileByName, getProfileById } from '@/lib/server/profileService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileName = searchParams.get('name');
    const profileId = searchParams.get('id');

    if (!profileName && !profileId) {
      return NextResponse.json(
        { error: 'Either "name" or "id" query parameter is required.' },
        { status: 400 }
      );
    }

    let profile = null;

    // Try to get profile by ID first, then by name
    if (profileId) {
      profile = getProfileById(profileId);
    } else if (profileName) {
      profile = getProfileByName(profileName);
    }

    if (!profile) {
      const identifier = profileId || profileName;
      return NextResponse.json(
        { error: `Profile "${identifier}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in /api/profiles/get:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}