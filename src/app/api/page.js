'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function APIPage() {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Fast Flags', href: '/fflags' },
    { name: 'API', href: '/api' },
    { name: 'Profiles', href: '/profiles' }
  ];

  const endpoints = [
    {
      method: 'GET',
      endpoint: '/api/fflags/stats',
      description: 'Retrieve statistics about all available Fast Flags, including counts by category, type, status, and impact.',
      parameters: [],
      response: {
        total: 15247,
        lastUpdated: "2024-07-24T10:00:00.000Z",
        categories: { "Debug": 50, "Rendering": 300, "...": "..." },
        types: { "Bool": 10000, "Int": 4000, "String": 1247 },
        statuses: { "Stable": 12000, "Beta": 2000, "...": "..." },
        impacts: { "Low": 8000, "Medium": 4000, "...": "..." },
        sources: 18
      }
    },
    {
      method: 'GET',
      endpoint: '/api/fflags/list',
      description: 'Retrieve a paginated list of all Fast Flags.',
      parameters: [
        { name: 'page', type: 'number', description: 'The page number to retrieve (default: 1, 20 flags per page).' }
      ],
      response: {
        flags: [ { "name": "FFlagDebugStart", "type": "Bool", "..." : "..." } ],
        total: 15247,
        limit: 20,
        offset: 0,
        hasMore: true
      }
    },
    {
      method: 'GET',
      endpoint: '/api/fflags/search',
      description: 'Search for Fast Flags with advanced filtering and pagination.',
      parameters: [
        { name: 'flag', type: 'string', description: 'Search term for flag name or description.' },
        { name: 'category', type: 'string', description: 'Filter by a specific category.' },
        { name: 'type', type: 'string', description: 'Filter by type (e.g., Bool, Int, String).' },
        { name: 'status', type: 'string', description: 'Filter by status (e.g., Stable, Beta).' },
        { name: 'impact', type: 'string', description: 'Filter by impact (e.g., Low, High).' },
        { name: 'limit', type: 'number', description: 'Number of results per page (default: 25, max: 100).' },
        { name: 'offset', type: 'number', description: 'Offset for pagination (default: 0).' }
      ],
      response: {
        flags: [ { "name": "FFlagDebugStart", "type": "Bool", "..." : "..." } ],
        total: 1,
        limit: 25,
        offset: 0,
        hasMore: false
      }
    },
    {
      method: 'GET',
      endpoint: '/api/fflags/get?flag={name}',
      description: 'Retrieve a single Fast Flag by its exact name.',
      parameters: [
        { name: 'flag', type: 'string', description: 'The exact name of the Fast Flag (URL-encoded).' }
      ],
      response: {
        name: "FFlagDebugStart",
        value: false,
        type: "Bool",
        defaultValue: false,
        description: "Enables debug mode...",
        category: "Debug",
        impact: "Low",
        status: "Stable",
        sources: ["PCClientBootstrapper"]
      }
    },
    {
      method: 'POST',
      endpoint: '/api/fflags/get',
      description: 'Retrieve multiple Fast Flags by their names.',
      parameters: [
        { name: 'body', type: 'json', description: 'A JSON object with a "flags" property containing an array of flag names, e.g., {"flags": ["FFlagDebugStart", "FIntMaxFPS"]}' }
      ],
      response: [
        { "name": "FFlagDebugStart", "..." : "..." },
        { "name": "FIntMaxFPS", "..." : "..." }
      ]
    },
    {
      method: 'POST',
      endpoint: '/api/fflags/validator',
      description: 'Validates a list of flag configurations.',
       parameters: [
        { name: 'body', type: 'json', description: 'A JSON object with a "flags" property containing an array of flag strings, e.g., {"flags": ["{\\"FFlagDebugStart\\":true}", "{\\"FIntMaxFPS\\":60}"]}' }
      ],
      response: {
        valid: [ { line: 1, content: '{"FFlagDebugStart":true}' } ],
        invalid: [ { line: 2, content: '{"InvalidFlag":123}', issues: ["Invalid flag name format"] } ]
      }
    },
    {
      method: 'GET',
      endpoint: '/api/profiles',
      description: 'Retrieve a list of all available optimization profiles.',
      parameters: [],
      response: [
        { id: "ultra-fps", name: "Ultra FPS Profile", description: "...", flagCount: 127 }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/profiles/get?name={id}',
      description: 'Retrieve a single optimization profile by its ID or name.',
      parameters: [
        { name: 'name', type: 'string', description: 'The ID or name of the profile.' }
      ],
      response: {
        id: "ultra-fps",
        name: "Ultra FPS Profile",
        description: "...",
        category: "Performance",
        flags: [ "FFlagRenderOptimized", "..." ]
      }
    }
  ];

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'POST': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'DELETE': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background bg-animated-gradient">
      <Navbar navItems={navItems} />
      
      {/* Hero Section */}
      <section className="py-20 bg-background-secondary bg-particles">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-responsive-xl font-bold mb-4 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
            Robify API Documentation
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            Access our comprehensive Fast Flags database programmatically. Build your own tools and integrations with our RESTful API.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>REST API</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>JSON Response</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Rate Limited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Free Access</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Getting Started */}
        <section className="mb-16">
          <div className="glass-card rounded-xl p-8 border border-border-light">
            <h2 className="text-2xl font-bold text-foreground mb-6">Getting Started</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Base URL</h3>
                <div className="bg-background border border-border-light rounded-lg p-4 font-mono text-sm">
                  <code className="text-accent">https://robify.vercel.app/api</code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Authentication</h3>
                <p className="text-text-muted text-sm">
                  Currently, no authentication is required. Rate limiting is applied per IP address.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Rate Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background/50 rounded-lg p-4 border border-border-light/50">
                  <div className="text-2xl font-bold text-accent">1000</div>
                  <div className="text-sm text-text-muted">Requests per hour</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border-light/50">
                  <div className="text-2xl font-bold text-accent">100</div>
                  <div className="text-sm text-text-muted">Requests per minute</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border-light/50">
                  <div className="text-2xl font-bold text-accent">5</div>
                  <div className="text-sm text-text-muted">Requests per second</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">API Endpoints</h2>
          
          <div className="space-y-8">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="glass-card rounded-xl p-8 border border-border-light">
                {/* Method and Endpoint */}
                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-3 py-1 text-sm font-mono rounded-md border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="font-mono text-lg text-foreground bg-background/50 px-4 py-2 rounded-lg border border-border-light/50 flex-1">
                    {endpoint.endpoint}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`https://robify.vercel.app${endpoint.endpoint}`)}
                    className="bg-accent/10 hover:bg-accent/20 text-accent p-2 rounded-lg transition-all duration-200"
                    title="Copy endpoint URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="text-text-muted mb-6">{endpoint.description}</p>

                {/* Parameters */}
                {endpoint.parameters.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border-light">
                            <th className="text-left py-2 text-sm font-semibold text-foreground">Name</th>
                            <th className="text-left py-2 text-sm font-semibold text-foreground">Type</th>
                            <th className="text-left py-2 text-sm font-semibold text-foreground">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, paramIndex) => (
                            <tr key={paramIndex} className="border-b border-border-light/30">
                              <td className="py-2 text-sm font-mono text-accent">{param.name}</td>
                              <td className="py-2 text-sm text-text-muted">{param.type}</td>
                              <td className="py-2 text-sm text-text-muted">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Response Example */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Response Example</h4>
                  <div className="bg-background border border-border-light rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-text-muted">
                      <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}