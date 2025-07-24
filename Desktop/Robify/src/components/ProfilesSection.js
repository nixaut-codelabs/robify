'use client';

import { useState, useEffect } from 'react';

export default function ProfilesSection({ profiles = [], currentProfile = 0, setCurrentProfile, loading = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('profiles');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Icon mapping based on category
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'performance':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'graphics':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  // Color mapping based on category
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'performance':
        return 'from-green-500 to-green-600';
      case 'network':
        return 'from-blue-500 to-blue-600';
      case 'graphics':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!profiles || profiles.length === 0) {
    return (
      <section id="profiles" className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6 text-center">
          <p className="text-text-muted">No profiles available.</p>
        </div>
      </section>
    );
  }

  const currentProfileData = profiles[currentProfile] || profiles[0];

  return (
    <section id="profiles" className="py-20 bg-background-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/3 to-transparent rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Performance Profiles
          </div>
          <h2 className="text-responsive-lg font-bold text-foreground mb-6">
            Choose Your Optimization
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Pre-configured flag combinations designed for specific use cases. Each profile is carefully crafted to deliver maximum performance improvements for your gaming scenario.
          </p>
        </div>

        {/* Featured Profile Display */}
        <div className={`max-w-5xl mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${getCategoryColor(currentProfileData.category)} p-8 text-white glass-card shadow-2xl`}>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className='flex-grow'>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      {getCategoryIcon(currentProfileData.category)}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">{currentProfileData.name}</h3>
                      <p className="text-white/80">{currentProfileData.category} Profile</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                    {currentProfileData.description}
                  </p>
                  
                  {/* Profile Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-xl font-bold text-accent">{currentProfileData.flagCount || currentProfileData.flags?.length || 0}</div>
                      <div className="text-xs text-white/80">Flags</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className={`text-xl font-bold ${getImpactColor(currentProfileData.impact)}`}>{currentProfileData.impact}</div>
                      <div className="text-xs text-white/80">Impact</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-xl font-bold text-green-400">{currentProfileData.difficulty}</div>
                      <div className="text-xs text-white/80">Difficulty</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                      {currentProfileData.flagCount || currentProfileData.flags?.length || 0} Flags
                    </span>
                    <span className="text-accent-light font-semibold">
                      Ready to Apply
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {currentProfileData.benefits?.map((benefit, idx) => (
                      <span key={idx} className="px-3 py-1 bg-accent/20 rounded-md text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button className="px-8 py-3 bg-accent hover:bg-accent-light rounded-xl font-semibold
                                   transition-all duration-300 hover-scale shadow-lg min-w-[200px]">
                    Apply Profile
                  </button>
                  <button className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold
                                   transition-all duration-300 hover-scale border border-white/20 min-w-[200px]">
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full translate-y-24 -translate-x-24 animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Profile Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {profiles.map((profile, index) => {
            const isActive = currentProfile === index;
            const isHovered = hoveredProfile === index;
            
            return (
              <div
                key={profile.id || index}
                className={`group glass-card rounded-xl p-6 cursor-pointer transition-all duration-300
                          hover-scale hover:shadow-2xl border relative overflow-hidden ${
                            isActive
                              ? 'ring-2 ring-accent border-accent/50 shadow-xl'
                              : 'border-border-light hover:border-accent/30'
                          }`}
                onClick={() => setCurrentProfile(index)}
                onMouseEnter={() => setHoveredProfile(index)}
                onMouseLeave={() => setHoveredProfile(null)}
              >
                {/* Hover background effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(profile.category)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-r ${getCategoryColor(profile.category)} rounded-xl flex items-center
                                 justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                                   isActive ? 'shadow-lg' : ''
                                 }`}>
                    {getCategoryIcon(profile.category)}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    isActive ? 'text-accent' : 'text-foreground group-hover:text-accent'
                  }`}>
                    {profile.name}
                  </h3>
                  
                  <p className="text-text-muted text-sm mb-4 leading-relaxed line-clamp-2">
                    {profile.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isActive
                        ? 'bg-accent/20 text-accent'
                        : 'bg-primary/20 text-primary group-hover:bg-accent/20 group-hover:text-accent'
                    }`}>
                      {profile.category}
                    </span>
                    <span className={`font-medium text-sm ${
                      isActive ? 'text-accent' : 'text-foreground'
                    }`}>
                      {profile.flagCount || profile.flags?.length || 0} flags
                    </span>
                  </div>
                  
                  {/* Profile indicators */}
                  <div className="flex gap-1 mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${getImpactColor(profile.impact)} bg-current/20`}>
                      {profile.impact} Impact
                    </span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {profile.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {profile.benefits?.slice(0, 2).map((benefit, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs rounded ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'bg-accent/10 text-accent opacity-70 group-hover:opacity-100'
                      }`}>
                        {benefit}
                      </span>
                    ))}
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="glass-card rounded-xl p-8 border border-border-light max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Need a Custom Profile?</h3>
            <p className="text-text-muted mb-6">
              Can't find the perfect profile for your needs? Create your own custom configuration with our advanced flag editor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/fflags"
                className="bg-accent hover:bg-accent-light text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Browse All Flags
              </a>
              <a
                href="/fflags/validator"
                className="bg-accent/10 hover:bg-accent/20 text-accent font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-accent/30"
              >
                Validate Configuration
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}