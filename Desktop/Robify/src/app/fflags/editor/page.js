'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModernDropdown from '@/components/ModernDropdown';
import editorConfig from '@/editor.json';

export default function FFlagsEditorPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [parameterValues, setParameterValues] = useState({});
  const [generatedFlags, setGeneratedFlags] = useState('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Fast Flags', href: '/fflags' },
    { name: 'Editor', href: '/fflags/editor' },
    { name: 'API', href: '/api' },
    { name: 'Profiles', href: '/profiles' }
  ];

  // Initialize with default values
  useEffect(() => {
    const initialValues = {};
    editorConfig.categories.forEach(category => {
      category.parameters.forEach(param => {
        initialValues[param.id] = param.defaultValue;
      });
    });
    setParameterValues(initialValues);
    setSelectedCategory(editorConfig.categories[0]?.id || null);
  }, []);

  // Generate flags JSON
  const generateFlagsJSON = useCallback(() => {
    const flags = {};
    
    editorConfig.categories.forEach(category => {
      category.parameters.forEach(param => {
        const value = parameterValues[param.id];
        const defaultValue = param.defaultValue;
        
        // Check if value is defined and different from default
        if (value !== undefined && value !== defaultValue) {
          if (param.type === 'boolean') {
            const flagOutputs = param.flagOutput[value.toString()];
            if (flagOutputs && Array.isArray(flagOutputs)) {
              flagOutputs.forEach(flagString => {
                if (flagString) {
                  const [key, val] = flagString.split(':');
                  // Parse the value based on its type
                  if (val === 'true') {
                    flags[key] = true;
                  } else if (val === 'false') {
                    flags[key] = false;
                  } else if (!isNaN(val)) {
                    flags[key] = parseInt(val);
                  } else {
                    flags[key] = val;
                  }
                }
              });
            }
          } else if (param.type === 'string') {
            const flagOutputs = param.flagOutput[value];
            if (flagOutputs && Array.isArray(flagOutputs)) {
              flagOutputs.forEach(flagString => {
                if (flagString) {
                  const [key, val] = flagString.split(':');
                  // Parse the value based on its type
                  if (val === 'true') {
                    flags[key] = true;
                  } else if (val === 'false') {
                    flags[key] = false;
                  } else if (!isNaN(val)) {
                    flags[key] = parseInt(val);
                  } else {
                    flags[key] = val;
                  }
                }
              });
            }
          } else if (param.type === 'integer') {
            if (param.flagOutput.condition) {
              // Evaluate condition safely
              try {
                if (eval(param.flagOutput.condition.replace('value', `'${value}'`))) {
                  const flag = param.flagOutput.template.replace('{value}', value);
                  const [key, val] = flag.split(':');
                  flags[key] = param.type === 'integer' ? parseInt(val) : val;
                }
              } catch (error) {
                console.warn('Error evaluating condition for parameter:', param.id, error);
              }
            } else {
              const flag = param.flagOutput.template.replace('{value}', value);
              const [key, val] = flag.split(':');
              flags[key] = param.type === 'integer' ? parseInt(val) : val;
            }
          }
        }
      });
    });

    return JSON.stringify(flags, null, 2);
  }, [parameterValues]);

  // Update generated flags whenever values change
  useEffect(() => {
    setGeneratedFlags(generateFlagsJSON());
  }, [parameterValues, generateFlagsJSON]);

  // Handle parameter value change
  const handleParameterChange = (paramId, value) => {
    setParameterValues(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  // Apply preset
  const applyPreset = (presetId) => {
    const preset = editorConfig.presets.find(p => p.id === presetId);
    if (preset) {
      setParameterValues(prev => ({
        ...prev,
        ...preset.flags
      }));
      setSelectedPreset(presetId);
    }
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedFlags);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  // Reset all values
  const resetAllValues = () => {
    const initialValues = {};
    editorConfig.categories.forEach(category => {
      category.parameters.forEach(param => {
        initialValues[param.id] = param.defaultValue;
      });
    });
    setParameterValues(initialValues);
    setSelectedPreset(null);
  };

  // Get current category
  const currentCategory = editorConfig.categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background bg-animated-gradient">
      <Navbar navItems={navItems} />
      
      {/* Hero Section */}
      <section className="py-20 bg-background-secondary bg-particles">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-responsive-xl font-bold mb-4 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
            Fast Flags Editor
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
            Create custom Fast Flags configurations with our visual editor. Adjust parameters, preview changes, and export your configuration.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Categories Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Categories
                </h3>
                <div className="space-y-2">
                  {editorConfig.categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/30'
                          : 'text-text-secondary hover:bg-card-hover hover:text-accent'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-text-muted">{category.parameters.length} parameters</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="glass-card rounded-xl p-6 border border-border-light">
                <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={resetAllValues}
                    className="w-full bg-background hover:bg-card-hover text-text-secondary hover:text-accent font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-border-light"
                  >
                    Reset All Values
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    View JSON Output
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Parameters */}
          <main className="w-full lg:w-3/4">
            {currentCategory && (
              <div className="space-y-6">
                {/* Category Header */}
                <div className="glass-card rounded-xl p-6 border border-border-light">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentCategory.color} flex items-center justify-center text-3xl`}>
                      {currentCategory.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{currentCategory.name}</h2>
                      <p className="text-text-muted">{currentCategory.description}</p>
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                <div className="space-y-4">
                  {currentCategory.parameters.map(param => (
                    <div
                      key={param.id}
                      className="glass-card rounded-xl p-6 border border-border-light hover:border-accent/50 transition-all duration-300 overflow-visible"
                      style={{ position: 'relative' }}
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Parameter Info */}
                        <div className="flex-1">
                          <h3 className="font-mono text-lg text-foreground font-semibold mb-2">{param.name}</h3>
                          <p className="text-text-muted text-sm mb-3">{param.description}</p>
                          
                          {/* Metadata */}
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-md border ${
                              param.impact === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                              param.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                              'bg-green-500/20 text-green-300 border-green-500/30'
                            }`}>
                              Impact: {param.impact}
                            </span>
                            {param.platforms.map(platform => (
                              <span key={platform} className="px-2 py-1 rounded-md border bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {platform}
                              </span>
                            ))}
                          </div>

                          {param.warning && (
                            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <p className="text-red-400 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {param.warning}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Parameter Control */}
                        <div className="w-full lg:w-80" style={{ position: 'relative', zIndex: 1 }}>
                          {param.type === 'boolean' && (
                            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border-light">
                              <span className="text-text-secondary">Value:</span>
                              <button
                                onClick={() => handleParameterChange(param.id, !parameterValues[param.id])}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                                  parameterValues[param.id] ? 'bg-accent' : 'bg-gray-600'
                                }`}
                              >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                                  parameterValues[param.id] ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>
                          )}

                          {param.type === 'integer' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-text-secondary">Value:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-accent font-semibold">{parameterValues[param.id]}</span>
                                  {param.unit && <span className="text-text-muted text-sm">{param.unit}</span>}
                                </div>
                              </div>
                              <input
                                type="range"
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                value={parameterValues[param.id]}
                                onChange={(e) => handleParameterChange(param.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-xs text-text-muted">
                                <span>{param.min}</span>
                                <span>{param.max}</span>
                              </div>
                            </div>
                          )}

                          {param.type === 'string' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-text-secondary">Value:</span>
                              </div>
                              <ModernDropdown
                                value={parameterValues[param.id]}
                                onChange={(value) => handleParameterChange(param.id, value)}
                                options={param.options}
                                placeholder="Select option"
                              />
                            </div>
                          )}

                          {/* Current Flag Output */}
                          {parameterValues[param.id] !== param.defaultValue && (
                            <div className="mt-3 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                              <div className="text-accent text-xs font-mono">
                                {param.type === 'boolean' && (
                                  <div className="space-y-1">
                                    {Array.isArray(param.flagOutput[parameterValues[param.id]?.toString()])
                                      ? param.flagOutput[parameterValues[param.id].toString()].map((flag, index) => (
                                          <div key={index} className="break-all">{flag}</div>
                                        ))
                                      : <div className="break-all">{param.flagOutput[parameterValues[param.id]?.toString()]}</div>
                                    }
                                  </div>
                                )}
                                {param.type === 'string' && (
                                  <div className="space-y-1">
                                    {(() => {
                                      // Direct mapping (e.g., GraphicsMode)
                                      if (param.flagOutput[parameterValues[param.id]]) {
                                        const flags = param.flagOutput[parameterValues[param.id]];
                                        return Array.isArray(flags)
                                          ? flags.map((flag, index) => (
                                              <div key={index} className="break-all">{flag}</div>
                                            ))
                                          : <div className="break-all">{flags}</div>;
                                      }
                                      // Template-based (e.g., DFFlagDebugRenderForceTechnologyVoxel)
                                      else if (param.flagOutput.template) {
                                        if (param.flagOutput.condition) {
                                          try {
                                            if (eval(param.flagOutput.condition.replace('value', `'${parameterValues[param.id]}'`))) {
                                              return <div className="break-all">{param.flagOutput.template.replace('{value}', parameterValues[param.id])}</div>;
                                            }
                                          } catch (error) {
                                            console.warn('Error evaluating condition:', error);
                                          }
                                        } else {
                                          return <div className="break-all">{param.flagOutput.template.replace('{value}', parameterValues[param.id])}</div>;
                                        }
                                      }
                                      return null;
                                    })()}
                                  </div>
                                )}
                                {param.type === 'integer' && (
                                  <div className="break-all">
                                    {param.flagOutput.template?.replace('{value}', parameterValues[param.id])}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* JSON Output Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setIsModalOpen(false)}>
          <div className="bg-background-secondary rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden border border-border-light" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">Generated Fast Flags</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-background rounded-lg p-4 mb-4 max-h-[50vh] overflow-y-auto">
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">{generatedFlags}</pre>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {copiedToClipboard ? (
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
                    Copy to Clipboard
                  </>
                )}
              </button>
              <button
                onClick={() => router.push('/fflags/validator')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validate
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--accent);
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px var(--accent);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--accent);
          cursor: pointer;
          border-radius: 50%;
          border: none;
          transition: all 0.2s;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px var(--accent);
        }
      `}</style>
    </div>
  );
}