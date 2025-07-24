'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { validateFlags as apiValidateFlags } from '@/lib/fflagService';

export default function ValidatorPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('input'); // 'input', 'results', 'cleaned'
  const [copiedStates, setCopiedStates] = useState({});
  const [downloadReady, setDownloadReady] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Fast Flags', href: '/fflags' },
    { name: 'API', href: '/api' },
    { name: 'Profiles', href: '/profiles' }
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleValidate = async () => {
    if (!input.trim()) {
      setError('Please enter Fast Flags to validate.');
      return;
    }
    
    setIsValidating(true);
    setError(null);
    setResults(null);
    setAnimationKey(prev => prev + 1);

    try {
      // JSON formatında tek obje olarak parse et
      let parsedFlags;
      try {
        parsedFlags = JSON.parse(input.trim());
        
        if (typeof parsedFlags !== 'object' || parsedFlags === null || Array.isArray(parsedFlags)) {
          throw new Error('JSON must be an object');
        }
      } catch (parseError) {
        setError('Invalid JSON format. Please enter a valid JSON object.');
        return;
      }

      // Her flag'i ayrı string olarak hazırla (API'nin beklediği format)
      const flagsToValidate = Object.entries(parsedFlags).map(([key, value]) =>
        JSON.stringify({ [key]: value })
      );
      
      const validationResults = await apiValidateFlags(flagsToValidate);
      setResults(validationResults);
      setActiveTab('results');
      setDownloadReady(true);
    } catch (err) {
      console.error("Validation API error:", err);
      setError('Flag validation failed. Please try again later.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResults(null);
    setError(null);
    setActiveTab('input');
    setDownloadReady(false);
    setCopiedStates({});
  };

  const getCleanedFlags = () => {
    if (!results) return '';
    const combinedFlags = {};
    
    // Add valid flags
    if (results.valid) {
      results.valid.forEach(flag => {
        Object.assign(combinedFlags, flag.parsed);
      });
    }
    
    // Add auto-fixed flags
    if (results.autoFixed) {
      results.autoFixed.forEach(flag => {
        Object.assign(combinedFlags, flag.parsed);
      });
    }
    
    return JSON.stringify(combinedFlags, null, 2);
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCleanedFlags = () => {
    const cleanedFlags = getCleanedFlags();
    if (!cleanedFlags) return;

    const blob = new Blob([cleanedFlags], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_fast_flags.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExampleFlags = () => {
    const exampleFlags = `{
  "FFlagDebugMode": true,
  "FIntMaxFPS": "60",
  "FStringServerRegion": "US-East",
  "DFFlagEnableNewFeature": "false",
  "FFlagInvalidExample": "tRuE",
  "NotAValidFlag": 123,
  "FIntTextValue": "should be number",
  "FFlagTestBoolean": 1,
  "FStringTestNumber": 42
}`;
    setInput(exampleFlags);
    setActiveTab('input');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file.');
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setError('File size must be less than 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        // Validate JSON
        JSON.parse(content);
        setInput(content);
        setError(null);
        setActiveTab('input');
      } catch (error) {
        setError('Invalid JSON file. Please check the file format.');
      }
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getStatusIcon = (isValid) => {
    if (isValid) {
      return (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  const validCount = results ? results.valid.length : 0;
  const invalidCount = results ? results.invalid.length : 0;
  const autoFixedCount = results ? (results.autoFixed?.length || 0) : 0;
  const totalCount = validCount + invalidCount + autoFixedCount;
  const validationRate = totalCount > 0 ? Math.round(((validCount + autoFixedCount) / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background bg-animated-gradient">
      <Navbar navItems={navItems} />
      
      {/* Enhanced Hero Section */}
      <section className="relative py-20 bg-background-secondary bg-particles overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Advanced Validator
          </div>
          
          <h1 className="text-responsive-xl font-bold mb-4 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent animate-gradient">
            Fast Flag Validator Pro
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8 animate-fade-in-up">
            Validate, clean, and optimize your Fast Flags configuration with our advanced validation engine. 
            Get instant feedback, download cleaned configs, and ensure compatibility.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full animate-fade-in-up delay-100">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time Validation</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full animate-fade-in-up delay-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Smart Type Checking</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full animate-fade-in-up delay-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Export Clean Config</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full animate-fade-in-up delay-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Syntax Highlighting</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-background-secondary rounded-xl p-1 border border-border-light">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'input'
                  ? 'bg-accent text-white shadow-lg'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Input
              </div>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              disabled={!results}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'results'
                  ? 'bg-accent text-white shadow-lg'
                  : results
                  ? 'text-text-secondary hover:text-foreground'
                  : 'text-text-muted cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Results
                {results && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    validationRate >= 80 ? 'bg-green-500/20 text-green-400' :
                    validationRate >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {validationRate}%
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('cleaned')}
              disabled={!results || (validCount + autoFixedCount) === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'cleaned'
                  ? 'bg-accent text-white shadow-lg'
                  : results && (validCount + autoFixedCount) > 0
                  ? 'text-text-secondary hover:text-foreground'
                  : 'text-text-muted cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cleaned
                {results && (validCount + autoFixedCount) > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
                    {validCount + autoFixedCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {/* Input Tab */}
          {activeTab === 'input' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" key={`input-${animationKey}`}>
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-xl p-6 border border-border-light">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Input Fast Flags</h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={triggerFileUpload}
                        className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload JSON
                      </button>
                      <button
                        onClick={loadExampleFlags}
                        className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Load Example
                      </button>
                    </div>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='{
  "FFlagExampleFlag": true,
  "FIntExampleNumber": 100,
  "FStringExampleText": "value"
}'
                        className="w-full min-h-[300px] bg-background border border-border-light rounded-lg p-4 text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
                        style={{ minHeight: '300px' }}
                      />
                      {input && (
                        <div className="absolute top-2 right-2 text-xs text-text-muted">
                          {(() => {
                            try {
                              const parsed = JSON.parse(input.trim());
                              return `${Object.keys(parsed).length} flag${Object.keys(parsed).length !== 1 ? 's' : ''}`;
                            } catch {
                              return `${input.split('\n').filter(line => line.trim()).length} lines`;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleValidate}
                        disabled={!input.trim() || isValidating}
                        className="flex-1 bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent disabled:from-accent/50 disabled:to-accent-light/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        {isValidating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="animate-pulse">Validating...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Validate Flags
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleClear}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="glass-card rounded-xl p-6 border border-red-500/30 bg-red-500/10 text-red-300 animate-shake">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-red-200">Validation Error</h3>
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Format Guide */}
                <div className="glass-card rounded-xl p-6 border border-border-light">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Format Guide
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-background border border-border-light rounded-lg p-3">
                      <p className="text-xs text-text-muted mb-1">Single JSON Object Format</p>
                      <code className="text-sm text-accent block whitespace-pre-wrap">{`{
  "FFlagName": true,
  "FIntName": 100,
  "FStringName": "value"
}`}</code>
                    </div>
                    <div className="bg-background border border-border-light rounded-lg p-3">
                      <p className="text-xs text-text-muted mb-1">Boolean Flag</p>
                      <code className="text-sm text-green-400">"FFlagName": true</code>
                    </div>
                    <div className="bg-background border border-border-light rounded-lg p-3">
                      <p className="text-xs text-text-muted mb-1">Integer Flag</p>
                      <code className="text-sm text-blue-400">"FIntName": 100</code>
                    </div>
                    <div className="bg-background border border-border-light rounded-lg p-3">
                      <p className="text-xs text-text-muted mb-1">String Flag</p>
                      <code className="text-sm text-purple-400">"FStringName": "value"</code>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="glass-card rounded-xl p-6 border border-border-light">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Pro Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Enter all flags as a single JSON object</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Flag names must start with FFlag, FInt, FString, or DFFlag</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Values must match the flag type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Use the cleaned output for production</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && results && (
            <div className="space-y-6 animate-fade-in" key={`results-${animationKey}`}>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="glass-card rounded-xl p-6 border border-border-light text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{totalCount}</div>
                  <div className="text-sm text-text-muted">Total Flags</div>
                </div>
                <div className="glass-card rounded-xl p-6 border border-green-500/30 bg-green-500/5 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">{validCount}</div>
                  <div className="text-sm text-green-300">Valid Flags</div>
                </div>
                <div className="glass-card rounded-xl p-6 border border-yellow-500/30 bg-yellow-500/5 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{autoFixedCount}</div>
                  <div className="text-sm text-yellow-300">Auto-Fixed</div>
                </div>
                <div className="glass-card rounded-xl p-6 border border-red-500/30 bg-red-500/5 text-center">
                  <div className="text-3xl font-bold text-red-400 mb-1">{invalidCount}</div>
                  <div className="text-sm text-red-300">Invalid Flags</div>
                </div>
                <div className={`glass-card rounded-xl p-6 border text-center ${
                  validationRate >= 80 ? 'border-green-500/30 bg-green-500/5' :
                  validationRate >= 50 ? 'border-yellow-500/30 bg-yellow-500/5' :
                  'border-red-500/30 bg-red-500/5'
                }`}>
                  <div className={`text-3xl font-bold mb-1 ${
                    validationRate >= 80 ? 'text-green-400' :
                    validationRate >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>{validationRate}%</div>
                  <div className={`text-sm ${
                    validationRate >= 80 ? 'text-green-300' :
                    validationRate >= 50 ? 'text-yellow-300' :
                    'text-red-300'
                  }`}>Success Rate</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Validation Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(results, null, 2), 'results')}
                      className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1"
                    >
                      {copiedStates.results ? (
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
                          Copy JSON
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {/* Invalid Flags First */}
                  {results.invalid.map((result, index) => (
                    <div 
                      key={`invalid-${index}`} 
                      className="border rounded-lg p-4 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(false)}
                          <span className="text-sm text-text-muted">Line {result.line}</span>
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Invalid</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(result.content, `invalid-${index}`)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          {copiedStates[`invalid-${index}`] ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <code className="font-mono text-sm text-red-300 break-all block mb-3 bg-red-900/20 p-2 rounded">
                        {result.content}
                      </code>
                      <div className="space-y-1">
                        {result.issues.map((issue, issueIndex) => (
                          <div key={issueIndex} className="text-sm text-red-400 flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Auto-Fixed Flags */}
                  {results.autoFixed?.map((result, index) => (
                    <div
                      key={`autoFixed-${index}`}
                      className="border rounded-lg p-4 border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${(results.invalid.length + index) * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-sm text-text-muted">Line {result.line}</span>
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">Auto-Fixed</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(result.content, `autoFixed-${index}`)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          {copiedStates[`autoFixed-${index}`] ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div>
                          <div className="text-xs text-text-muted mb-1">Original:</div>
                          <code className="font-mono text-sm text-yellow-200 break-all block bg-yellow-900/20 p-2 rounded">
                            {result.originalContent}
                          </code>
                        </div>
                        <div>
                          <div className="text-xs text-text-muted mb-1">Fixed:</div>
                          <code className="font-mono text-sm text-yellow-300 break-all block bg-yellow-900/30 p-2 rounded">
                            {result.content}
                          </code>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {result.fixes.map((fix, fixIndex) => (
                          <div key={fixIndex} className="text-sm text-yellow-400 flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>{fix}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Valid Flags */}
                  {results.valid.map((result, index) => (
                    <div 
                      key={`valid-${index}`} 
                      className="border rounded-lg p-4 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${(results.invalid.length + index) * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(true)}
                          <span className="text-sm text-text-muted">Line {result.line}</span>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Valid</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(result.content, `valid-${index}`)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          {copiedStates[`valid-${index}`] ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <code className="font-mono text-sm text-green-300 break-all block bg-green-900/20 p-2 rounded">
                        {result.content}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cleaned Tab */}
          {activeTab === 'cleaned' && results && (validCount + autoFixedCount) > 0 && (
            <div className="space-y-6 animate-fade-in" key={`cleaned-${animationKey}`}>
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Cleaned Configuration</h2>
                    <p className="text-sm text-text-muted mt-1">
                      Only valid flags, ready for use in your Roblox client
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => copyToClipboard(getCleanedFlags(), 'cleaned')}
                      className="bg-accent hover:bg-accent-light text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      {copiedStates.cleaned ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy All
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadCleanedFlags}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>

                <div className="bg-background border border-border-light rounded-lg p-6">
                  <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap break-all">
                    {getCleanedFlags()}
                  </pre>
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-green-300">
                      <p className="font-semibold mb-1">Ready to Use!</p>
                      <p>This cleaned configuration contains only valid flags. You can safely paste this into your Roblox client settings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!results && !isValidating && !error && activeTab !== 'input' && (
            <div className="glass-card rounded-xl p-12 border border-border-light text-center">
              <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Results Yet</h3>
              <p className="text-text-muted">Validate some flags first to see results here.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
      
      <Footer />
    </div>
  );
}