'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 bg-background-tertiary text-foreground border-t border-border-light">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Robify" width={40} height={40} className="rounded-lg" />
              <h3 className="text-xl font-bold">Robify</h3>
            </div>
            <p className="text-text-muted mb-4 leading-relaxed">
              Advanced fast flags library for Roblox optimization. 
              Built with ❤️ for the community, completely free and open source.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-text-muted">
              <li><Link href="/features" className="hover:text-accent transition-colors">Features</Link></li>
              <li><Link href="/fflags" className="hover:text-accent transition-colors">Fast Flags</Link></li>
              <li><Link href="/profiles" className="hover:text-accent transition-colors">Profiles</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-text-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Bug Reports</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Feature Requests</a></li>
              <li><a href="https://github.com/nixaut-codelabs/robify" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border-light mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-text-muted">
          <p>&copy; 2025 Robify. Made with ❤️ for the Roblox community. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="https://github.com/nixaut-codelabs/robify" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}