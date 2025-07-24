'use client';

import { useState, useEffect } from 'react';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { label: "Performance Boost", value: "Up to 300%" },
    { label: "Users Helped", value: "12,000+" },
    { label: "Flags Available", value: "15,247" },
    { label: "Success Rate", value: "98.5%" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('#community');
    if (section) observer.observe(section);

    // Rotate stats
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 2000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [stats.length]);

  return (
    <section id="community" className="py-20 bg-gradient-to-r from-primary via-primary-light to-accent relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-particles opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full translate-y-24 -translate-x-24 animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-6 text-center text-white relative">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>Join the Community</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to{' '}
            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Supercharge
            </span>
            <br />
            Your Roblox Experience?
          </h2>
          
          {/* Dynamic Stats Display */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-white/20">
              <div className="text-3xl font-bold text-accent mb-2">
                {stats[currentStat].value}
              </div>
              <div className="text-white/80">
                {stats[currentStat].label}
              </div>
            </div>
          </div>

          <p className="text-xl mb-12 text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Join thousands of users who have already improved their Roblox performance with Robify. 
            Start exploring our comprehensive Fast Flags database and professional optimization profiles - completely free, forever.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a
              href="/fflags"
              className="group relative px-8 py-4 bg-white text-primary hover:bg-gray-100 font-semibold rounded-xl transition-all duration-300 hover-scale shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative flex items-center justify-center gap-2">
                <span>Browse Fast Flags</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            
            <a
              href="/fflags/validator"
              className="px-8 py-4 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-300 hover-scale shadow-lg"
            >
              Try Validator
            </a>
            
            <a
              href="/api"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 hover-scale backdrop-blur-sm"
            >
              View API Docs
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: "🚀", label: "Performance", value: "300% Faster", delay: "0ms" },
              { icon: "🔒", label: "Secure", value: "100% Safe", delay: "200ms" },
              { icon: "🆓", label: "Free", value: "Always", delay: "400ms" },
              { icon: "🌟", label: "Rating", value: "4.9/5 Stars", delay: "600ms" }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/15 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 200 + 800}ms` }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-lg font-bold text-white mb-1">{item.value}</div>
                <div className="text-sm text-white/70">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-white/70 text-sm">
              No registration required • Works with all Roblox versions • Community supported
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}