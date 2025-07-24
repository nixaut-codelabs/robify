'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
    RunnerIcon, RefreshIcon, CogIcon, GiftIcon, 
    PerformanceChartIcon, NetworkGlobeIcon, GraphicsCardIcon 
} from '@/components/icons';

export default function FeaturesPage() {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Fast Flags', href: '/fflags' },
    { name: 'API', href: '/api' },
    { name: 'Profiles', href: '/profiles' }
  ];

  const coreFeatures = [
    {
      title: "Comprehensive FFlag Database",
      description: "Access over 15,000 Fast Flags, covering every aspect of the Roblox engine. Our database is the largest and most up-to-date available, giving you unparalleled control.",
      icon: RunnerIcon,
    },
    {
      title: "Real-Time Updates",
      description: "As Roblox updates, so do we. Our system automatically syncs with new Roblox versions to ensure our FFlag database is always current, providing you with the latest optimizations.",
      icon: RefreshIcon,
    },
    {
      title: "Pre-Configured Profiles",
      description: "Get started instantly with professionally configured profiles. Whether you need max FPS, low latency, or enhanced graphics, we have a profile for you.",
      icon: CogIcon,
    },
    {
      title: "Completely Free & Open Source",
      description: "Robify is a passion project for the community. It's 100% free, with no ads, no premium tiers, and is fully open source on GitHub.",
      icon: GiftIcon,
    }
  ];

  const detailedFeatures = [
    {
        category: "Performance Optimization",
        icon: PerformanceChartIcon,
        title: "Unleash Your FPS",
        description: "Robify's performance profiles are meticulously crafted to squeeze every possible frame out of your hardware. By fine-tuning rendering pipelines, thread schedulers, and physics calculations, we help you achieve a smoother, more responsive gameplay experience.",
        points: [
            "Dynamic render distance scaling.",
            "Optimized texture and mesh loading.",
            "Reduced input lag through engine tweaks.",
            "Prioritized game-critical processing threads."
        ]
    },
    {
        category: "Network & Latency",
        icon: NetworkGlobeIcon,
        title: "Achieve Near-Zero Latency",
        description: "Our network profiles reconfigure Roblox's data transmission protocols to minimize ping and reduce packet loss. This is essential for competitive players where every millisecond counts.",
        points: [
            "Aggressive packet bundling.",
            "Optimized data replication frequency.",
            "Prioritization of character and physics data.",
            "Reduced network buffering for faster updates."
        ]
    },
    {
        category: "Graphical Enhancements",
        icon: GraphicsCardIcon,
        title: "Redefine Visual Fidelity",
        description: "Go beyond Roblox's default graphics settings. Enable experimental lighting features, unlock higher-resolution textures, and activate advanced post-processing effects for a truly next-gen visual experience.",
        points: [
            "Enable hidden shadow and lighting effects.",
            "Force higher resolution texture maps.",
            "Unlock advanced anti-aliasing methods.",
            "Customize post-processing effects like bloom and color grading."
        ]
    }
  ];

  return (
    <div className="min-h-screen bg-background bg-animated-gradient">
      <Navbar navItems={navItems} />
      <main className="pt-16">
        {/* Hero Section for Features Page */}
        <section className="py-20 text-center bg-background-secondary bg-particles">
          <div className="container mx-auto px-6">
            <h1 className="text-responsive-xl font-bold mb-4 bg-gradient-to-r from-foreground via-accent to-accent-light bg-clip-text text-transparent">
              Robify Features
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Discover the powerful features that make Robify the ultimate tool for Roblox optimization and customization.
            </p>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={index}
                    className="glass-card rounded-xl p-8 text-center hover-scale transition-all duration-300 border border-border-light hover:border-accent/30"
                  >
                    <div className="mb-6 flex justify-center">
                      <div className="w-16 h-16 bg-primary/50 rounded-full flex items-center justify-center">
                        <FeatureIcon className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-20 bg-background-secondary relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 space-y-32 relative">
                {detailedFeatures.map((feature, index) => {
                    const FeatureIcon = feature.icon;
                    return (
                        <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
                            {/* Enhanced SVG Illustration */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                    <div className="relative aspect-square rounded-2xl flex items-center justify-center glass-card p-12 border border-border-light hover:border-accent/30 transition-all duration-300">
                                        <FeatureIcon className="w-full h-full text-accent opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                                        
                                        {/* Floating elements */}
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                                        <div className="absolute bottom-6 left-6 w-2 h-2 bg-primary rounded-full animate-pulse delay-1000"></div>
                                        <div className="absolute top-1/3 left-4 w-1.5 h-1.5 bg-accent-light rounded-full animate-pulse delay-500"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enhanced Text Content */}
                            <div className="w-full lg:w-1/2">
                                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                                    <FeatureIcon className="w-4 h-4" />
                                    <span>{feature.category}</span>
                                </div>
                                
                                <h3 className="text-4xl font-bold text-foreground mb-6 leading-tight">{feature.title}</h3>
                                <p className="text-xl text-text-muted mb-8 leading-relaxed">{feature.description}</p>
                                
                                <div className="space-y-4 mb-8">
                                    {feature.points.map((point, pIndex) => (
                                        <div key={pIndex} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors duration-200">
                                            <div className="w-6 h-6 mt-1 flex-shrink-0 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                                                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                            <span className="text-text-secondary group-hover:text-foreground transition-colors text-lg">{point}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="/fflags"
                                        className="bg-accent hover:bg-accent-light text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center gap-2"
                                    >
                                        <span>Try Now</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a
                                        href="/api"
                                        className="bg-transparent border border-accent/30 hover:border-accent text-accent font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-accent/5"
                                    >
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* New Advanced Features Section */}
        <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Advanced Features
                    </div>
                    <h2 className="text-4xl font-bold text-foreground mb-6">
                        Professional Tools for Power Users
                    </h2>
                    <p className="text-xl text-text-muted max-w-3xl mx-auto">
                        Take your Roblox optimization to the next level with our advanced features designed for developers and power users.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Fast Flag Validator",
                            description: "Validate your flag configurations before applying them with our comprehensive syntax checker.",
                            icon: "🔍",
                            features: ["Syntax validation", "Error detection", "Best practices"],
                            link: "/fflags/validator"
                        },
                        {
                            title: "API Integration",
                            description: "Access our complete database programmatically with our RESTful API.",
                            icon: "🔌",
                            features: ["RESTful endpoints", "JSON responses", "Rate limiting"],
                            link: "/api"
                        },
                        {
                            title: "Profile Customization",
                            description: "Create and share your own optimization profiles with the community.",
                            icon: "⚙️",
                            features: ["Custom profiles", "Community sharing", "Version control"],
                            link: "/fflags"
                        },
                        {
                            title: "Performance Analytics",
                            description: "Track the impact of your optimizations with detailed performance metrics.",
                            icon: "📊",
                            features: ["FPS monitoring", "Latency tracking", "Stability reports"],
                            link: "/features"
                        },
                        {
                            title: "Auto-Updates",
                            description: "Stay current with automatic flag database updates as Roblox releases new versions.",
                            icon: "🔄",
                            features: ["Real-time sync", "Version tracking", "Change notifications"],
                            link: "/features"
                        },
                        {
                            title: "Community Support",
                            description: "Get help from our active community of optimization experts and developers.",
                            icon: "👥",
                            features: ["Expert guidance", "Troubleshooting", "Best practices"],
                            link: "/features"
                        }
                    ].map((feature, index) => (
                        <div key={index} className="group glass-card rounded-xl p-8 border border-border-light hover:border-accent/30 transition-all duration-300 hover:shadow-xl">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-text-muted mb-6 leading-relaxed">
                                {feature.description}
                            </p>
                            <div className="space-y-2 mb-6">
                                {feature.features.map((feat, featIndex) => (
                                    <div key={featIndex} className="flex items-center gap-2 text-sm text-text-secondary">
                                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <a
                                href={feature.link}
                                className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-semibold transition-colors"
                            >
                                <span>Explore</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
