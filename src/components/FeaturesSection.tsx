import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Feature {
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  badge: string;
  badgeColor: string;
  gradient: string;
}

export function FeaturesSection() {
  const [flagCount, setFlagCount] = useState<string>("25,000+");

  useEffect(() => {
    fetch("/api/fflags")
      .then((r) => r.json())
      .then((d: { total: number }) => {
        const count = d.total;
        if (count >= 1000) {
          setFlagCount(`${(count / 1000).toFixed(1).replace(/\.0$/, "")}K+`);
        } else {
          setFlagCount(`${count}+`);
        }
      })
      .catch(() => {});
  }, []);

  const features: Feature[] = [
    {
      icon: "⚡",
      title: `${flagCount} Fast Flags`,
      description:
        "Access the most comprehensive collection of Roblox Fast Flags. Search, filter, and apply flags instantly.",
      bullets: [
        "Categorized flag database",
        "Instant search & filter",
        "Detailed descriptions",
        "Copy-paste ready JSON",
      ],
      badge: "Core Feature",
      badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      gradient: "from-yellow-500/10 via-orange-500/5 to-transparent",
    },
    {
      icon: "🔄",
      title: "Real-time Updates",
      description:
        "Stay ahead with automatic flag updates. Our system tracks Roblox changes and updates the database continuously.",
      bullets: [
        "Automatic flag detection",
        "Version tracking",
        "Change notifications",
        "Historical data access",
      ],
      badge: "Live",
      badgeColor: "bg-green-500/10 text-green-400 border-green-500/20",
      gradient: "from-green-500/10 via-emerald-500/5 to-transparent",
    },
    {
      icon: "🎯",
      title: "Pre-built Profiles",
      description:
        "Apply curated optimization profiles with one click. From FPS boost to rendering tweaks, we have it all.",
      bullets: [
        "FPS boost profiles",
        "Quality optimization",
        "Network tweaks",
        "Custom profile builder",
      ],
      badge: "Popular",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    },
    {
      icon: "💎",
      title: "100% Free & Open Source",
      description:
        "Robify is completely free and open source. No hidden fees, no premium tiers, no BS. Community powered.",
      bullets: [
        "MIT licensed",
        "Community contributions",
        "Transparent development",
        "No data collection",
      ],
      badge: "Open Source",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    },
  ];

  return (
    <section id="features" className="relative py-8">
      <div className="section-divider mb-8" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="status-badge mb-4 inline-flex">
            <span>✨</span> Why Robify?
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-3">
            Everything You Need,{" "}
            <span className="gradient-text">Nothing You Don't</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built by the community, for the community. Robify gives you complete control
            over your Roblox experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="glass-card border-white/5 overflow-hidden group fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-2.5">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <svg className="size-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
