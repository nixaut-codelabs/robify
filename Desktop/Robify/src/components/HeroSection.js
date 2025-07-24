'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDownIcon } from './icons';

export default function HeroSection({ isVisible, stats, scrollToSection, loading, error }) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const features = [
    `${stats?.totalFlags ? (stats.totalFlags).toLocaleString() + '+' : '25,000+'} Fast Flags`,
    "Real-time Updates",
    "Pre-built Profiles",
    "100% Free & Open Source"
  ];

  const fullText = "Advanced Fast Flags Library for Roblox";

  useEffect(() => {
    // Typewriter effect
    let timeout;
    if (isTyping && typedText.length < fullText.length) {
      timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
    } else if (typedText.length === fullText.length) {
      setIsTyping(false);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isTyping, fullText]);

  useEffect(() => {
    // Rotate features
    const featureTimer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(featureTimer);
  }, [features.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-particles pt-16">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-matrix">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full animate-particle-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-primary/15 to-accent-light/15 rounded-full animate-particle-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-accent-light/10 to-accent/10 rounded-full animate-particle-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full animate-particle-float" style={{animationDelay: '6s'}}></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-accent/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-primary/5 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-foreground">
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          
          {/* Enhanced Logo Section */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <Image
                src="/logo.png"
                alt="Robify Logo"
                width={140}
                height={140}
                className="relative animate-glow rounded-2xl animate-scale-breath group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Enhanced Title */}
          <h1 className="text-responsive-xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent animate-shimmer">
            Robify
          </h1>
          
          {/* Typewriter Subtitle */}
          <div className="h-16 mb-4 flex items-center justify-center">
            <p className="text-responsive-lg text-text-secondary font-mono">
              {typedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>
          
          {/* Enhanced Description with Feature Rotation */}
          <div className="mb-8">
            <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              Unlock the full potential of your Roblox experience with{' '}
              <span className="relative inline-block min-w-[200px]">
                <span 
                  key={currentFeature}
                  className="text-accent font-bold animate-fade-in-up"
                >
                  {features[currentFeature]}
                </span>
              </span>
              . Optimize performance, reduce latency, and enhance graphics - all completely free, forever.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => scrollToSection('profiles')}
              className="group relative px-8 py-4 bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent text-white font-semibold rounded-xl 
                       transition-all duration-300 hover-scale hover-glow shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative">Explore Profiles</span>
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-8 py-4 bg-transparent border-2 border-accent/30 text-accent font-semibold 
                       rounded-xl hover:bg-accent/10 hover:border-accent transition-all duration-300 hover-scale glass-card"
            >
              Learn More
            </button>
            <a
              href="/fflags/validator"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold 
                       rounded-xl transition-all duration-300 hover-scale shadow-lg"
            >
              Try Validator
            </a>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-8">
            {[
              {
                label: "Fast Flags",
                value: stats?.totalFlags || 25000,
                suffix: "+",
                icon: "⚡",
                description: "Comprehensive database",
                color: "accent",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                label: "Active Profiles",
                value: stats?.activeProfiles || 3,
                suffix: "",
                icon: "🎯",
                description: "Ready-to-use configurations",
                color: "green-300",
                gradient: "from-green-500 to-teal-600"
              },
              {
                label: "Users Helped",
                value: stats?.usersHelped || 15847,
                suffix: "+",
                icon: "👥",
                description: "Growing community",
                color: "accent-light",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                label: "Update Frequency",
                value: stats?.updateFrequency || "5min",
                suffix: "",
                icon: "🔄",
                description: "Real-time synchronization",
                color: "green-400",
                gradient: "from-orange-500 to-red-600"
              },
              {
                label: "Accuracy",
                value: stats?.accuracy || "99.9%",
                suffix: "",
                icon: "✅",
                description: "Verified compatibility",
                color: "blue-400",
                gradient: "from-cyan-500 to-blue-600"
              }
            ].map((stat, index) => (
              <div key={index} className="group glass-card rounded-xl p-6 hover-scale border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-accent/20 rounded mb-2"></div>
                      <div className="h-4 bg-accent/10 rounded mb-1"></div>
                      <div className="h-3 bg-accent/10 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <div className={`text-2xl md:text-3xl font-bold text-${stat.color} mb-2 group-hover:scale-105 transition-transform`}>
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                      </div>
                      <div className="text-foreground font-semibold mb-1 text-sm">{stat.label}</div>
                      <div className="text-text-muted text-xs">{stat.description}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl max-w-md mx-auto">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <span>⚠️</span>
                <span>Some data may be outdated. Refresh to try again.</span>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-text-muted text-sm mb-8">
            <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full border border-border-light/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Always Up-to-date</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full border border-border-light/30">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Community Driven</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full border border-border-light/30">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-full border border-border-light/30">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}