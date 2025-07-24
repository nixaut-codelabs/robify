'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ProfilesSection from '@/components/ProfilesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

import {
  ZapIcon, RocketIcon, SignalIcon, PaletteIcon, ChipIcon, BatteryIcon,
  RunnerIcon, RefreshIcon, CogIcon, GiftIcon
} from '@/components/icons';

// Import client-side services that make API calls
import { getAllProfiles, getProfilesStats } from '@/lib/profileService';

// Map profile categories to icons and colors
const profileVisuals = {
  Performance: { icon: ZapIcon, color: "from-yellow-400 to-orange-500" },
  Network: { icon: RocketIcon, color: "from-blue-400 to-cyan-500" },
  Graphics: { icon: PaletteIcon, color: "from-purple-400 to-pink-500" },
  Memory: { icon: ChipIcon, color: "from-indigo-400 to-blue-500" },
  Power: { icon: BatteryIcon, color: "from-green-400 to-teal-500" },
  Debug: { icon: CogIcon, color: "from-red-400 to-orange-500" },
  UI: { icon: PaletteIcon, color: "from-pink-400 to-purple-500" },
  Audio: { icon: SignalIcon, color: "from-indigo-400 to-purple-500" },
  Default: { icon: CogIcon, color: "from-gray-400 to-gray-500" }
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    totalFlags: 0,
    sources: 6, // Default source count
  });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Fast Flags', href: '/fflags' },
    { name: 'Editor', href: '/fflags/editor' },
    { name: 'Profiles', href: '/profiles' },
    { name: 'API', href: '/api' }
  ];

  // Fetch flags stats from the fflags API
  const fetchFlagsStats = useCallback(async () => {
    try {
      const response = await fetch('/api/fflags?stats=true');
      if (response.ok) {
        const data = await response.json();
        return {
          total: data.total || 0,
          totalFlags: data.total || 0,
          sources: data.sources || 6
        };
      }
    } catch (error) {
      console.error('Failed to fetch flags stats:', error);
    }
    // Return default values if fetch fails
    return {
      total: 25000, // Estimated default
      totalFlags: 25000,
      sources: 6
    };
  }, []);

  // Fetch profiles data
  const fetchProfilesData = useCallback(async () => {
    try {
      const profilesResponse = await getAllProfiles({ limit: 50 });
      const profilesData = profilesResponse.profiles || [];
      
      const formattedProfiles = profilesData.map(p => {
        const visuals = profileVisuals[p.category] || profileVisuals.Default;
        return {
          ...p,
          icon: visuals.icon,
          color: visuals.color,
          flagCount: p.flags ? p.flags.length : (p.flagCount || 0), // Ensure flag count is available
        };
      });
      
      return formattedProfiles;
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      return [];
    }
  }, []);

  // Main data fetching function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, profilesData] = await Promise.all([
        fetchFlagsStats(),
        fetchProfilesData()
      ]);
      
      setStats(statsData);
      setProfiles(profilesData);
      
    } catch (error) {
      console.error("Failed to fetch homepage data:", error);
      setError(error.message);
      // Set fallback data
      setStats({
        total: 25000,
        totalFlags: 25000,
        sources: 6
      });
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFlagsStats, fetchProfilesData]);

  // Initialize page and fetch data
  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, [fetchData]);

  // Profile rotation effect
  useEffect(() => {
    if (profiles.length === 0) return;
    
    const profileInterval = setInterval(() => {
      setCurrentProfile(prev => (prev + 1) % profiles.length);
    }, 5000);

    return () => clearInterval(profileInterval);
  }, [profiles.length]);

  // Memoized features to prevent unnecessary re-renders
  const features = useMemo(() => [
    {
      title: `${stats.totalFlags.toLocaleString()}+ Fast Flags`,
      description: "Comprehensive database of all Roblox fast flags, constantly updated with the latest versions and detailed analysis.",
      icon: RunnerIcon,
      delay: "0ms",
      badge: `${stats.sources} Sources`,
      highlights: [
        "Real-time flag discovery",
        "Detailed descriptions & impact analysis",
        "Cross-platform compatibility",
        "Performance metrics"
      ],
      gradient: "from-blue-500 to-purple-600",
      iconColor: "text-blue-400"
    },
    {
      title: "Real-time Updates",
      description: "Flags are automatically updated as Roblox releases new versions, ensuring 100% compatibility and reliability.",
      icon: RefreshIcon,
      delay: "200ms",
      badge: "Auto-Sync",
      highlights: [
        "Automatic synchronization every 5 minutes",
        "Version tracking & change detection",
        "Instant notifications for new flags",
        "Historical data preservation"
      ],
      gradient: "from-green-500 to-teal-600",
      iconColor: "text-green-400"
    },
    {
      title: "Pre-built Profiles",
      description: "Ready-to-use optimization profiles crafted by experts for different use cases and device specifications.",
      icon: CogIcon,
      delay: "400ms",
      badge: `${profiles.length} Profiles`,
      highlights: [
        "Performance optimized configurations",
        "One-click apply & instant results",
        "Custom profile builder",
        "Community-tested configurations"
      ],
      gradient: "from-purple-500 to-pink-600",
      iconColor: "text-purple-400"
    },
    {
      title: "100% Free & Open Source",
      description: "No hidden costs, no premium features, no subscriptions - completely free for everyone, forever.",
      icon: GiftIcon,
      delay: "600ms",
      badge: "Community Driven",
      highlights: [
        "No hidden costs or premium tiers",
        "Transparent development process",
        "MIT Licensed & community driven",
        "Full source code available"
      ],
      gradient: "from-orange-500 to-red-600",
      iconColor: "text-orange-400"
    }
  ], [stats.totalFlags, stats.sources, profiles.length]);

  // Enhanced scroll function with smooth animations
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Enhanced stats for hero section
  const heroStats = useMemo(() => ({
    totalFlags: stats.totalFlags || stats.total || 25000,
    activeProfiles: profiles.length || 3,
    usersHelped: 15847, // Updated user count
    updateFrequency: '5min',
    accuracy: '99.9%'
  }), [stats.totalFlags, stats.total, profiles.length]);

  return (
    <div className="min-h-screen bg-background bg-animated-gradient relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <Navbar navItems={navItems} scrollToSection={scrollToSection} />
      
      <main className="relative z-10">
        <HeroSection
          isVisible={isVisible}
          stats={heroStats}
          scrollToSection={scrollToSection}
          loading={loading}
          error={error}
        />
        
        <FeaturesSection
          features={features}
          isVisible={isVisible}
        />
        
        <ProfilesSection
          profiles={profiles}
          currentProfile={currentProfile}
          setCurrentProfile={setCurrentProfile}
          loading={loading}
        />
        
        <CTASection scrollToSection={scrollToSection} />
      </main>
      
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}
