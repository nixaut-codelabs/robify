'use client';

import { useEffect, useState, useCallback } from 'react';

// Platform configuration
const PLATFORM_CONFIG = {
  'Windows': {
    name: 'Windows',
    icon: '🪟',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  },
  'macOS': {
    name: 'macOS',
    icon: '🍎',
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  },
  'Android': {
    name: 'Android',
    icon: '🤖',
    color: 'bg-green-500/20 text-green-300 border-green-500/30'
  },
  'iOS': {
    name: 'iOS',
    icon: '📱',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  'Xbox': {
    name: 'Xbox',
    icon: '🎮',
    color: 'bg-green-600/20 text-green-400 border-green-600/30'
  },
  'PlayStation': {
    name: 'PlayStation',
    icon: '🎯',
    color: 'bg-blue-600/20 text-blue-400 border-blue-600/30'
  }
};

/**
 * Modern Flag Detail Modal Component
 * Responsive, accessible modal for displaying detailed flag information
 */
export default function FlagDetailModal({ flag, isOpen, onClose }) {
  const [isCopied, setIsCopied] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle modal close with animation
  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200);
  }, [onClose]);

  // Copy to clipboard with feedback
  const copyToClipboard = useCallback(async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setIsCopied(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  // Search on Google
  const searchOnGoogle = useCallback(() => {
    const searchQuery = `Roblox ${flag.name} fast flag`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  }, [flag?.name]);

  // Get status styling
  const getStatusStyling = (status) => {
    switch (status?.toLowerCase()) {
      case 'stable':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          border: 'border-green-500/30'
        };
      case 'beta':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30'
        };
      case 'experimental':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          border: 'border-red-500/30'
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30'
        };
    }
  };

  // Get type styling
  const getTypeStyling = (type) => {
    switch (type?.toLowerCase()) {
      case 'bool':
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-400',
          border: 'border-blue-500/30'
        };
      case 'int':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          border: 'border-green-500/30'
        };
      case 'string':
        return {
          bg: 'bg-purple-500/20',
          text: 'text-purple-400',
          border: 'border-purple-500/30'
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30'
        };
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

  if (!isOpen || !flag) {
    return null;
  }

  const statusStyling = getStatusStyling(flag.status);
  const typeStyling = getTypeStyling(flag.type);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(30, 41, 59, 0.4) 100%)',
        backdropFilter: 'blur(12px)'
      }}
      onClick={handleClose}
    >
      {/* Enhanced backdrop with animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/20 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      {/* Modal Content with enhanced styling */}
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] overflow-hidden transition-all duration-500 ${
          isAnimating ? 'scale-90 opacity-0 rotate-1' : 'scale-100 opacity-100 rotate-0'
        }`}
        style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.98) 100%)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(148, 163, 184, 0.05),
            inset 0 1px 0 rgba(148, 163, 184, 0.1)
          `
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        {/* Enhanced Header */}
        <div className="sticky top-0 z-10 px-8 py-6"
             style={{
               background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
               backdropFilter: 'blur(20px)',
               borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
             }}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              {/* Flag name with enhanced styling */}
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-300 font-mono">
                    {flag.name}
                  </h2>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 text-3xl font-bold text-white/5 font-mono blur-sm">
                    {flag.name}
                  </div>
                </div>
                
                {/* Enhanced status badge */}
                <div className={`relative px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${statusStyling.bg} ${statusStyling.text} ${statusStyling.border}`}
                     style={{ boxShadow: `0 4px 12px ${statusStyling.text.replace('text-', 'rgba(').replace('-400', ', 0.2)')}` }}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusStyling.bg} animate-pulse`}></div>
                    {flag.status || 'Unknown'}
                  </div>
                </div>
              </div>
              
              {/* Enhanced description */}
              {flag.description && (
                <div className="relative">
                  <p className="text-slate-300 text-base leading-relaxed max-w-3xl">
                    {flag.description}
                  </p>
                  {/* Subtle accent line */}
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 to-blue-500/50 rounded-full"></div>
                </div>
              )}
              
              {/* Quick info pills */}
              <div className="flex items-center gap-3 mt-4">
                <div className={`px-3 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${typeStyling.bg} ${typeStyling.text} ${typeStyling.border}`}>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    {flag.type || 'N/A'}
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-lg text-xs font-medium ${getImpactColor(flag.impact)} bg-current/10 border border-current/20`}>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {flag.impact || 'Unknown'} Impact
                  </div>
                </div>
                
                {flag.platforms && flag.platforms.length > 0 && (
                  <div className="px-3 py-1 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {flag.platforms.length} Platform{flag.platforms.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced close button */}
            <button
              onClick={handleClose}
              className="relative p-3 text-slate-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/5 group"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-200px)] px-8 py-6">
          {/* Main Info Grid with enhanced styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <InfoCard
              title="Type"
              value={flag.type || 'N/A'}
              styling={typeStyling}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
              mono
            />
            <InfoCard
              title="Impact"
              value={flag.impact || 'Unknown'}
              color={getImpactColor(flag.impact)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <InfoCard
              title="Category"
              value={flag.category || 'Unknown'}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <InfoCard
              title="Platforms"
              value={`${flag.platforms?.length || 0} platform${(flag.platforms?.length || 0) > 1 ? 's' : ''}`}
              color="text-cyan-400"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          {/* Enhanced Default Value Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                Default Value
              </h3>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-slate-800/50 border border-slate-600/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 overflow-x-auto">
                    <code className="text-lg font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 whitespace-pre-wrap">
                      {String(flag.defaultValue)}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(String(flag.defaultValue), 'value')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isCopied.value
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-lg hover:shadow-purple-500/25'
                    }`}
                  >
                    {isCopied.value ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Platforms Section */}
          {flag.platforms && flag.platforms.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                  Supported Platforms ({flag.platforms.length})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {flag.platforms.map((platformKey, index) => {
                  const platform = PLATFORM_CONFIG[platformKey] || {
                    name: platformKey,
                    icon: '❓',
                    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  };
                  
                  return (
                    <div
                      key={index}
                      className={`group relative px-4 py-3 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${platform.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{platform.name}</span>
                          <span className="text-xs opacity-75">Platform</span>
                        </div>
                      </div>
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer Actions */}
        <div className="sticky bottom-0 px-8 py-6"
             style={{
               background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
               backdropFilter: 'blur(20px)',
               borderTop: '1px solid rgba(148, 163, 184, 0.1)'
             }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => copyToClipboard(flag.name, 'name')}
              className={`group relative flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                isCopied.name
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 active:scale-95'
              }`}
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="relative flex items-center gap-3">
                {isCopied.name ? (
                  <>
                    <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Name Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Flag Name</span>
                  </>
                )}
              </div>
            </button>
            
            <button
              onClick={searchOnGoogle}
              className="group relative flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 active:scale-95 overflow-hidden"
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="relative flex items-center gap-3">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search on Google</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced Reusable Info Card Component
 */
function InfoCard({ title, value, styling, color, icon, mono = false }) {
  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-xl p-5 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-300">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        {/* Header with icon */}
        <div className="flex items-center gap-2 mb-3">
          {icon && (
            <div className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 group-hover:text-slate-300 transition-colors">
              {icon}
            </div>
          )}
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
            {title}
          </h4>
        </div>
        
        {/* Value */}
        <div className="flex items-center gap-2">
          {styling && (
            <div className={`relative px-3 py-2 rounded-lg text-sm font-semibold border backdrop-blur-sm ${styling.bg} ${styling.text} ${styling.border} group-hover:scale-105 transition-transform duration-300`}
                 style={{ boxShadow: `0 4px 12px ${styling.text.replace('text-', 'rgba(').replace('-400', ', 0.15)')}` }}>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${styling.bg} animate-pulse`}></div>
                {value}
              </div>
            </div>
          )}
          {!styling && (
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${color?.includes('emerald') ? 'bg-emerald-400' : color?.includes('yellow') ? 'bg-yellow-400' : color?.includes('red') ? 'bg-red-400' : 'bg-slate-400'} animate-pulse`}></div>
              <p className={`text-base font-semibold ${color || 'text-slate-200'} ${mono ? 'font-mono' : ''} group-hover:text-white transition-colors`}>
                {value}
              </p>
            </div>
          )}
        </div>
        
        {/* Decorative element */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
}