'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllProfiles, searchProfiles, getProfilesStats } from '@/lib/profileService';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

function ProfilesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [profiles, setProfiles] = useState([]);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [stats, setStats] = useState({ categories: [], impacts: [], difficulties: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedImpact, setSelectedImpact] = useState(searchParams.get('impact') || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'All');

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = 12;

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Fast Flags', href: '/fflags' },
    { name: 'API', href: '/api' },
    { name: 'Profiles', href: '/profiles' }
  ];

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      const searchOptions = {
        category: selectedCategory,
        impact: selectedImpact,
        difficulty: selectedDifficulty,
        limit,
        offset,
      };

      let data;
      if (debouncedSearchTerm) {
        data = await searchProfiles(debouncedSearchTerm, searchOptions);
      } else {
        data = await getAllProfiles(searchOptions);
      }

      setProfiles(data.profiles || []);
      setTotalProfiles(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
      setProfiles([]);
      setTotalProfiles(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory, selectedImpact, selectedDifficulty]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to page 1 on search
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('category', selectedCategory);
    params.set('impact', selectedImpact);
    params.set('difficulty', selectedDifficulty);
    params.set('page', '1'); // Reset to page 1 on filter change
    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedCategory, selectedImpact, selectedDifficulty]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles, currentPage]);

  useEffect(() => {
    const fetchInitialStats = async () => {
      try {
        const statsData = await getProfilesStats();
        setStats({
          categories: [...new Set(['All', ...Object.keys(statsData.categories || {})])],
          impacts: [...new Set(['All', ...Object.keys(statsData.impacts || {})])],
          difficulties: [...new Set(['All', ...Object.keys(statsData.difficulties || {})])],
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchInitialStats();
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Performance': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Network': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Graphics': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Debug': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'UI': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'Audio': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Performance':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Network':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'Graphics':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  const handleOpenModal = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const copyProfileToClipboard = (profile) => {
    const profileData = {
      name: profile.name,
      flags: profile.flags || []
    };
    navigator.clipboard.writeText(JSON.stringify(profileData, null, 2));
  };

  return (
    <div className="min-h-screen bg-background bg-animated-gradient">
      <Navbar navItems={navItems} />
      
      {/* Hero Section */}
      <section className="py-20 bg-background-secondary bg-particles">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-responsive-xl font-bold mb-4 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
            Performance Profiles
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            Discover pre-configured Fast Flag combinations designed for specific use cases. Each profile is carefully crafted to deliver maximum performance improvements for your gaming scenario.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Impact</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Enhanced Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              
              {/* Categories */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Categories
                </h3>
                <div className="space-y-2">
                  {(stats.categories || []).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedCategory === category
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-secondary hover:bg-card-hover hover:text-accent'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Filter */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Impact
                </h3>
                <div className="space-y-2">
                  {(stats.impacts || []).map(impact => (
                    <button
                      key={impact}
                      onClick={() => setSelectedImpact(impact)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedImpact === impact
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-secondary hover:bg-card-hover hover:text-accent'
                      }`}
                    >
                      {impact}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Difficulty
                </h3>
                <div className="space-y-2">
                  {(stats.difficulties || []).map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedDifficulty === difficulty
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-secondary hover:bg-card-hover hover:text-accent'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4">
            
            {/* Search and Controls */}
            <div className="glass-card rounded-xl p-6 border border-border-light mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search profiles by name, description, or benefits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-background border border-border-light rounded-lg px-4 py-3 pl-12 text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-border-light">
                <p className="text-text-secondary text-sm">
                  Showing <span className="text-accent font-semibold">{profiles.length}</span> of {totalProfiles.toLocaleString()} profiles
                </p>
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {profiles.map(profile => (
                <div key={profile.id} className="glass-card rounded-xl p-6 border border-border-light hover:border-accent/50 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(profile.category)}`}>
                      {getCategoryIcon(profile.category)}
                    </div>
                    <span className={`px-2 py-1 text-xs font-mono rounded-md border ${getCategoryColor(profile.category)}`}>
                      {profile.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
                    {profile.name}
                  </h3>
                  
                  <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-3">
                    {profile.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-background/50 rounded-lg border border-border-light/50">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{profile.flagCount}</div>
                      <div className="text-xs text-text-muted">Flags</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getImpactColor(profile.impact)}`}>{profile.impact}</div>
                      <div className="text-xs text-text-muted">Impact</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getDifficultyColor(profile.difficulty)}`}>{profile.difficulty}</div>
                      <div className="text-xs text-text-muted">Difficulty</div>
                    </div>
                  </div>
                  
                  {profile.benefits && profile.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {profile.benefits.slice(0, 2).map((benefit, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-accent/10 text-accent rounded">
                          {benefit}
                        </span>
                      ))}
                      {profile.benefits.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-500/10 text-gray-400 rounded">
                          +{profile.benefits.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyProfileToClipboard(profile)}
                      className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                    <button
                      onClick={() => handleOpenModal(profile)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-text-muted">Loading profiles...</p>
              </div>
            )}

            {!isLoading && totalProfiles > limit && (
              <Pagination totalPages={Math.ceil(totalProfiles / limit)} />
            )}

            {!isLoading && profiles.length === 0 && (
              <div className="glass-card rounded-xl p-12 border border-border-light text-center">
                <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Profiles Found</h3>
                <p className="text-text-muted">
                  Your search and filter combination did not return any results. Try adjusting your criteria.
                </p>
              </div>
            )}
            
          </main>
        </div>
      </div>

      <Footer />

      {/* Profile Detail Modal */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border-light rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(selectedProfile.category)}`}>
                    {getCategoryIcon(selectedProfile.category)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedProfile.name}</h2>
                    <p className="text-text-muted">{selectedProfile.category} Profile</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-text-muted mb-6 leading-relaxed">{selectedProfile.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-background-secondary rounded-lg">
                  <div className="text-2xl font-bold text-accent">{selectedProfile.flagCount}</div>
                  <div className="text-sm text-text-muted">Flags</div>
                </div>
                <div className="text-center p-4 bg-background-secondary rounded-lg">
                  <div className={`text-2xl font-bold ${getImpactColor(selectedProfile.impact)}`}>{selectedProfile.impact}</div>
                  <div className="text-sm text-text-muted">Impact</div>
                </div>
                <div className="text-center p-4 bg-background-secondary rounded-lg">
                  <div className={`text-2xl font-bold ${getDifficultyColor(selectedProfile.difficulty)}`}>{selectedProfile.difficulty}</div>
                  <div className="text-sm text-text-muted">Difficulty</div>
                </div>
                <div className="text-center p-4 bg-background-secondary rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{selectedProfile.compatibility?.length || 0}</div>
                  <div className="text-sm text-text-muted">Platforms</div>
                </div>
              </div>
              
              {selectedProfile.benefits && selectedProfile.benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.benefits.map((benefit, idx) => (
                      <span key={idx} className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProfile.compatibility && selectedProfile.compatibility.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Compatible Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.compatibility.map((platform, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => copyProfileToClipboard(selectedProfile)}
                  className="flex-1 bg-accent hover:bg-accent-light text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Copy Profile Configuration
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-background-secondary hover:bg-card-hover text-foreground font-semibold rounded-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilesPageContent />
    </Suspense>
  );
}