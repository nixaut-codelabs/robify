'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getFlagsStats, searchFlags } from '@/lib/fflagService';
import FlagDetailModal from '@/components/FlagDetailModal';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

function FFlagsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [flags, setFlags] = useState([]);
  const [totalFlags, setTotalFlags] = useState(0);
  const [stats, setStats] = useState({ categories: [], types: [], statuses: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [selectedPlatform, setSelectedPlatform] = useState(searchParams.get('platform') || 'All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = 20;

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Fast Flags', href: '/fflags' },
    { name: 'Editor', href: '/fflags/editor' },
    { name: 'API', href: '/api' },
    { name: 'Profiles', href: '/profiles' }
  ];

  const fetchFlags = useCallback(async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      const searchOptions = {
        category: selectedCategory,
        type: selectedType,
        status: selectedStatus,
        platform: selectedPlatform,
        limit,
        offset,
      };
      const data = await searchFlags(debouncedSearchTerm, searchOptions);
      setFlags(data.flags);
      setTotalFlags(data.total);
    } catch (error) {
      console.error("Failed to fetch flags:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory, selectedType, selectedStatus, selectedPlatform]);

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
    params.set('type', selectedType);
    params.set('status', selectedStatus);
    params.set('platform', selectedPlatform);
    params.set('page', '1'); // Reset to page 1 on filter change
    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedCategory, selectedType, selectedStatus, selectedPlatform]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags, currentPage]);

  useEffect(() => {
    const fetchInitialStats = async () => {
      try {
        const statsData = await getFlagsStats();
        setStats({
          categories: [...new Set(['All', ...Object.keys(statsData.categories || {}), 'Unknown'])],
          types: [...new Set(['All', ...Object.keys(statsData.types || {})])],
          statuses: [...new Set(['All', ...Object.keys(statsData.statuses || {}), 'Unknown'])],
          platforms: [...new Set(['All', ...Object.keys(statsData.platforms || {}), 'Unknown'])],
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchInitialStats();
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Bool': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Int': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'String': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Stable': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Beta': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Experimental': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Unknown': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      case 'Unknown': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    
    switch (category) {
      case 'Debug': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Rendering': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Network': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Physics': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Performance': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'UI': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'Audio': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const searchFlagOnGoogle = (flagName) => {
    const searchQuery = `Roblox ${flagName} fast flag`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleUrl, '_blank');
  };

  const handleValidatorClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/fflags/validator';
    }
  };

  const handleOpenModal = (flag) => {
    setSelectedFlag(flag);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlag(null);
  };

  const truncateValue = (value, maxLength = 22) => {
    const stringValue = String(value);
    if (stringValue.length <= maxLength) {
      return stringValue;
    }
    return stringValue.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-background bg-animated-gradient">
      <Navbar navItems={navItems} />
      
      {/* Hero Section */}
      <section className="py-20 bg-background-secondary bg-particles">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-responsive-xl font-bold mb-4 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
            Fast Flags Explorer
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            Discover, search, and explore over {(totalFlags || 0).toLocaleString()} Roblox Fast Flags. Fine-tune your experience with powerful configuration options.
          </p>
          
          {/* Clean Validator Button Section */}
          <div className="mb-12">
            <div className="text-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={handleValidatorClick}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 20px 50px rgba(168, 85, 247, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.2)';
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(168, 85, 247, 0.2)',
                    fontSize: '18px',
                    zIndex: 10,
                    position: 'relative'
                  }}
                >
                  {/* Icon */}
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  
                  {/* Text */}
                  <span>Fast Flag Validator</span>
                  
                  {/* Arrow */}
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
              
              {/* Supporting text */}
              <p className="text-center text-text-muted text-sm mt-4 max-w-md mx-auto">
                Validate your Fast Flags configuration for syntax errors and compatibility issues before applying them.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Stable Flags</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Beta Features</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Experimental</span>
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

              {/* Type Filter */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Type
                </h3>
                <div className="space-y-2">
                  {(stats.types || []).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedType === type
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-secondary hover:bg-card-hover hover:text-accent'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </h3>
                <div className="space-y-2">
                  {(stats.statuses || []).map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedStatus === status
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-secondary hover:bg-card-hover hover:text-accent'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Filter */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Platform
                </h3>
                <div className="space-y-2">
                  {(stats.platforms || []).map(platform => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedPlatform === platform
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-secondary hover:bg-card-hover hover:text-accent'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4">
            
            {/* AI Classification Warning */}
            <div className="bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-300 p-4 rounded-lg mb-8 shadow-lg" role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5.414V8a1 1 0 112 0v4.586a1 1 0 11-2 0zM10 5a1 1 0 100 2 1 1 0 000-2z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">AI-Powered Classification Notice</p>
                  <p className="text-sm">Over 15,000 Fast Flags have been specially classified by AI. These classifications may be incorrect. Please double-check.</p>
                </div>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="glass-card rounded-xl p-6 border border-border-light mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by name or description..."
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
                  Showing <span className="text-accent font-semibold">{flags.length}</span> of {totalFlags.toLocaleString()} flags
                </p>
              </div>
            </div>

            {/* Enhanced FFlags Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {flags.map(flag => (
                <div key={flag.name} className="glass-card rounded-xl p-6 border border-border-light hover:border-accent/50 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-mono text-lg text-foreground font-semibold truncate group-hover:text-accent transition-colors">
                          {flag.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs font-mono rounded-md border ${getCategoryColor(flag.category)}`}>
                            {flag.category || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <span className={`px-2 py-1 text-xs font-mono rounded-md border ${getTypeColor(flag.type)}`}>
                          {flag.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-mono rounded-md border ${getStatusColor(flag.status)}`}>
                          {flag.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed mb-4">
                      {flag.description || 'No description available.'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-background/50 rounded-lg border border-border-light/50">
                      <div>
                        <span className="text-text-muted text-xs">Default Value</span>
                        <p className="font-mono text-sm text-foreground">{truncateValue(flag.defaultValue)}</p>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs">Performance Impact</span>
                        <p className={`text-sm font-semibold ${getImpactColor(flag.impact)}`}>{flag.impact || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(flag.name)}
                        className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Name
                      </button>
                      <button
                        onClick={() => handleOpenModal(flag)}
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
              <div className="text-center py-8 col-span-full">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-text-muted">Loading flags...</p>
              </div>
            )}

            {!isLoading && totalFlags > limit && (
              <Pagination totalPages={Math.ceil(totalFlags / limit)} />
            )}

            {!isLoading && flags.length === 0 && (
              <div className="col-span-full">
                <div className="glass-card rounded-xl p-12 border border-border-light text-center">
                  <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-2.5 5.291m0 0L18 20.5m-2.5-3.209L18 20.5M6 12a8 8 0 012.5-5.291m0 0L6 3.5m2.5 3.209L6 3.5" />
                  </svg>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Flags Found</h3>
                  <p className="text-text-muted">
                    Your search and filter combination did not return any results. Try adjusting your criteria.
                  </p>
                </div>
              </div>
            )}
            
          </main>
        </div>
      </div>

      <Footer />

      <FlagDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        flag={selectedFlag}
      />
    </div>
  );
}

export default function FFlagsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FFlagsPageContent />
    </Suspense>
  );
}