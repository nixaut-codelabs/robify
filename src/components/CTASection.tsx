import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

export function CTASection() {
  return (
    <section id="api" className="relative py-8">
      <div className="section-divider mb-8" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="relative glass-card rounded-3xl p-8 sm:p-10 md:p-12 text-center overflow-hidden glow-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-5xl mb-6 block">🎮</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="gradient-text">Optimize</span> Your Experience?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of players who already use Robify to get the most out of Roblox.
              It's free, open source, and always will be.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/fflags">
                <Button
                  size="lg"
                  className="text-base px-10 py-6 glow-primary glow-primary-hover rounded-xl font-semibold"
                >
                  <span className="mr-2">⚡</span>
                  Explore Fast Flags
                </Button>
              </Link>
              <a
                href="https://github.com/nixaut-codelabs/robify"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-10 py-6 rounded-xl font-semibold border-white/10 hover:border-white/20 hover:bg-white/5"
                >
                  <svg className="size-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Star on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-8 text-center glow-border">
            <div className="text-4xl font-black gradient-text-accent mb-2">300%</div>
            <div className="text-sm text-muted-foreground">Performance Boost</div>
          </div>
          <div className="glass-card rounded-2xl p-8 text-center glow-border">
            <div className="text-4xl font-black gradient-text mb-2">0ms</div>
            <div className="text-sm text-muted-foreground">Setup Time</div>
          </div>
          <div className="glass-card rounded-2xl p-8 text-center glow-border">
            <div className="text-4xl font-black gradient-text-accent mb-2">∞</div>
            <div className="text-sm text-muted-foreground">Customization Options</div>
          </div>
        </div>
      </div>
    </section>
  );
}
