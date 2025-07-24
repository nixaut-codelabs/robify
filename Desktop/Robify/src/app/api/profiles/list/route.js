import { NextResponse } from 'next/server';
import { getAllProfiles, getProfilesStats } from '@/lib/server/profileService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const includeStats = searchParams.get('stats') === 'true';

    // Validate parameters
    if (limit > 100) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 100' },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: 'Offset cannot be negative' },
        { status: 400 }
      );
    }

    const allProfiles = getAllProfiles();
    
    // Apply pagination
    const total = allProfiles.length;
    const paginatedProfiles = allProfiles.slice(offset, offset + limit);
    
    // Return simplified version for listing
    const simplifiedProfiles = paginatedProfiles.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      impact: p.impact,
      difficulty: p.difficulty,
      flagCount: p.flags ? p.flags.length : 0,
      benefits: (p.benefits || []).slice(0, 2), // Limit benefits for list view
      compatibility: p.compatibility || [],
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    const response = {
      profiles: simplifiedProfiles,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };

    // Include stats if requested
    if (includeStats) {
      response.stats = getProfilesStats();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/profiles/list:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}