'use client';

import { useState, useEffect, useRef } from 'react';

export default function FeaturesSection({ features, isVisible }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  // Intersection Observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => [...new Set([...prev, cardIndex])]);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 bg-background-secondary relative overflow-hidden" ref={sectionRef}>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-accent/8 to-primary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-accent-light/8 to-accent/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/3 to-blue-500/3 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-accent/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-primary/20 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-accent-light/20 rounded-full animate-float delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 text-accent px-6 py-3 rounded-full text-sm font-medium mb-6 border border-accent/20">
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powerful Features
          </div>
          <h2 className="text-responsive-lg font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
            Why Choose Robify?
          </h2>
          <p className="text-xl text-text-muted max-w-4xl mx-auto leading-relaxed">
            Built by the community, for the community. Our mission is to make Roblox optimization accessible to everyone with cutting-edge technology, real-time updates, and user-friendly design that puts performance first.
          </p>
        </div>

        {/* Enhanced Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            const isHovered = hoveredFeature === index;
            const isVisible = visibleCards.includes(index);
            
            return (
              <div
                key={index}
                data-index={index}
                className="group relative"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  className={`glass-card rounded-2xl p-8 h-full border transition-all duration-700 transform relative overflow-hidden ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                  } ${
                    isHovered
                      ? 'border-accent/50 shadow-2xl scale-105 -translate-y-3'
                      : 'border-border-light hover:border-accent/30'
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    background: isHovered
                      ? `linear-gradient(135deg, ${feature.gradient ? feature.gradient.replace('from-', 'rgba(').replace('to-', ', 0.05), rgba(').replace('-500', '').replace('-600', '') + ', 0.05)' : 'rgba(var(--accent-rgb), 0.05), rgba(var(--accent-light-rgb), 0.05)'}) 100%)`
                      : undefined
                  }}
                >
                  {/* Enhanced Background Effects */}
                  <div className="absolute inset-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient || 'from-accent/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  </div>

                  {/* Enhanced Icon with multiple effects */}
                  <div className="relative mb-8 z-10">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${
                      isHovered ? 'bg-accent/20 scale-110 rotate-3' : 'bg-accent/10'
                    }`}>
                      <FeatureIcon className={`w-10 h-10 transition-all duration-500 ${
                        isHovered ? `${feature.iconColor || 'text-accent'} scale-125 rotate-12` : feature.iconColor || 'text-accent'
                      }`} />
                      
                      {/* Pulsing background */}
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                        isHovered ? 'bg-accent/10 animate-pulse' : ''
                      }`}></div>
                    </div>
                    
                    {/* Multiple animated rings */}
                    {isHovered && (
                      <>
                        <div className="absolute inset-0 w-20 h-20 border-2 border-accent/30 rounded-2xl animate-ping"></div>
                        <div className="absolute inset-0 w-20 h-20 border border-accent/20 rounded-2xl animate-pulse delay-300"></div>
                      </>
                    )}
                  </div>

                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${
                      isHovered ? 'text-accent scale-105' : 'text-foreground'
                    }`}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-text-muted leading-relaxed mb-6 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Enhanced Feature highlights */}
                    {feature.highlights && (
                      <div className="space-y-3">
                        {feature.highlights.map((highlight, highlightIndex) => (
                          <div
                            key={highlightIndex}
                            className={`flex items-start gap-3 text-sm transition-all duration-300 ${
                              isHovered ? 'translate-x-1' : ''
                            }`}
                            style={{ animationDelay: `${highlightIndex * 100}ms` }}
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 transition-all duration-300 ${
                              isHovered ? 'bg-accent scale-125' : 'bg-accent/70'
                            }`}></div>
                            <span className="text-text-secondary leading-relaxed">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced hover effect overlay */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-light"></div>
                  </div>
                </div>

                {/* Enhanced floating badge */}
                {feature.badge && (
                  <div className={`absolute -top-4 -right-4 transition-all duration-500 z-20 ${
                    isHovered ? 'scale-110 -rotate-3' : ''
                  }`}>
                    <div className={`bg-gradient-to-r ${feature.gradient || 'from-accent to-accent-light'} text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/20`}>
                      {feature.badge}
                    </div>
                  </div>
                )}

                {/* Subtle glow effect */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-500 -z-10 ${
                  isHovered ? 'bg-accent/5 blur-xl scale-110' : ''
                }`}></div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-20">
          <div className="glass-card rounded-2xl p-10 border border-border-light max-w-3xl mx-auto relative overflow-hidden group">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
                Ready to Optimize Your Experience?
              </h3>
              <p className="text-text-muted mb-8 text-lg leading-relaxed">
                Join thousands of users who have already improved their Roblox performance with Robify. Start your optimization journey today with our comprehensive tools and community-driven profiles.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/fflags"
                  className="group bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Explore Fast Flags
                  </span>
                </a>
                <a
                  href="/profiles"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Browse Profiles
                  </span>
                </a>
                <a
                  href="/api"
                  className="bg-transparent border-2 border-accent/30 hover:border-accent text-accent font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:bg-accent/10 hover:shadow-lg hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    View API Docs
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}