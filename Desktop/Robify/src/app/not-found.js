'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background bg-animated-gradient flex items-center justify-center px-6">
      <div className="text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-accent to-accent-light bg-clip-text animate-pulse">
              404
            </h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="glass-card rounded-xl p-8 border border-border-light max-w-md mx-auto mb-8">
          <div className="mb-6">
            <svg className="w-16 h-16 text-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-2.5 5.291m0 0L18 20.5m-2.5-3.209L18 20.5M6 12a8 8 0 012.5-5.291m0 0L6 3.5m2.5 3.209L6 3.5" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-text-muted mb-6">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Quick Links */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-accent hover:bg-accent-light text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              Go Home
            </Link>
            
            <div className="flex gap-2">
              <Link
                href="/features"
                className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Features
              </Link>
              <Link
                href="/fflags"
                className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Fast Flags
              </Link>
              <Link
                href="/api"
                className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                API
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="glass-card rounded-xl p-6 border border-border-light max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">Did you know?</h3>
          <div className="space-y-3 text-sm text-text-muted">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Robify has over 15,000 Fast Flags in its database</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Our API serves millions of requests per month</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Fast Flags can improve your Roblox performance by up to 300%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-text-muted text-sm">
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@robify.dev" className="text-accent hover:text-accent-light transition-colors">
              support@robify.dev
            </a>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-light/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}