import { NextResponse } from 'next/server';
import { searchProfiles } from '@/lib/server/profileService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const category = searchParams.get('category') || 'All';
    const impact = searchParams.get('impact') || 'All';
    const difficulty = searchParams.get('difficulty') || 'All';
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

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

    const searchOptions = {
      category: category !== 'All' ? category : undefined,
      impact: impact !== 'All' ? impact : undefined,
      difficulty: difficulty !== 'All' ? difficulty : undefined,
      limit,
      offset
    };

    const searchResults = searchProfiles(query, searchOptions);
    
    // Return simplified version for search results
    const simplifiedResults = {
      ...searchResults,
      profiles: searchResults.profiles.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        impact: p.impact,
        difficulty: p.difficulty,
        flagCount: p.flags ? p.flags.length : 0,
        benefits: (p.benefits || []).slice(0, 3), // Limit benefits for search results
        compatibility: p.compatibility || [],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
    };

    return NextResponse.json(simplifiedResults);
  } catch (error) {
    console.error('Error in /api/profiles/search:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}