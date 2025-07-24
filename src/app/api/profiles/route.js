import { NextResponse } from 'next/server';
import { getAllProfiles, searchProfiles, getProfilesStats } from '@/lib/server/profileService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const impact = searchParams.get('impact') || 'All';
    const difficulty = searchParams.get('difficulty') || 'All';
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const stats = searchParams.get('stats') === 'true';

    // If stats are requested, return statistics
    if (stats) {
      const profileStats = getProfilesStats();
      return NextResponse.json(profileStats);
    }

    // If no search parameters, return all profiles
    if (!query && category === 'All' && impact === 'All' && difficulty === 'All') {
      const profiles = getAllProfiles();
      
      // Return a simplified version of the profiles for listing
      const simplifiedProfiles = profiles.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        impact: p.impact,
        difficulty: p.difficulty,
        flags: p.flags || [], // Include the full flags array
        flagCount: p.flags ? p.flags.length : 0,
        benefits: p.benefits || [],
        compatibility: p.compatibility || [],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));

      return NextResponse.json({
        profiles: simplifiedProfiles,
        total: profiles.length,
        limit,
        offset: 0,
        hasMore: false
      });
    }

    // Search profiles with filters
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
        flags: p.flags || [], // Include the full flags array
        flagCount: p.flags ? p.flags.length : 0,
        benefits: p.benefits || [],
        compatibility: p.compatibility || [],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
    };

    return NextResponse.json(simplifiedResults);
  } catch (error) {
    console.error('Error in /api/profiles:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}