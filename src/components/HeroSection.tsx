import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

const typewriterWords = [
  "Fast Flags",
  "Performance",
  "FPS Boost",
  "Optimization",
  "Profiles",
];

const statusBadges = [
  { icon: "🟢", label: "Always Up-to-date" },
  { icon: "👥", label: "Community Driven" },
  { icon: "📖", label: "Open Source" },
  { icon: "💎", label: "100% Free" },
];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flagCount, setFlagCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/fflags")
      .then((r) => r.json())
      .then((d: { total: number }) => setFlagCount(d.total))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const currentWord = typewriterWords[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentWord.length) {
            setCharIndex(charIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 1800);
          }
        } else {
          if (charIndex > 0) {
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setWordIndex((wordIndex + 1) % typewriterWords.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  const displayedText = typewriterWords[wordIndex].slice(0, charIndex);
  const displayCount = flagCount ? `${(flagCount / 1000).toFixed(1).replace(/\.0$/, "")}K+` : "25,000+";

  return (
    <section className="relative flex items-center justify-center pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center relative z-10">
        {/* Status badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 fade-in-up">
          {statusBadges.map((badge) => (
            <span key={badge.label} className="status-badge">
              <span>{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </div>

        {/* Logo */}
        <div className="fade-in-up fade-in-up-delay-1 mb-4">
          <span className="text-7xl sm:text-8xl block mb-4 drop-shadow-2xl">🚀</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-3 fade-in-up fade-in-up-delay-2 tracking-tight">
          <span className="gradient-text">Robify</span>
        </h1>

        {/* Typewriter */}
        <div className="h-12 sm:h-14 flex items-center justify-center mb-4 fade-in-up fade-in-up-delay-3">
          <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground leading-none">
            Master Your{" "}
            <span className="gradient-text-accent typewriter inline align-middle min-w-[2ch]">
              {displayedText}
            </span>
          </span>
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed fade-in-up fade-in-up-delay-4">
          The ultimate Roblox Fast Flags library with{" "}
          <span className="text-foreground font-semibold">{displayCount}</span> flags,
          pre-built optimization profiles, and real-time updates.
          Unlock your full potential.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 fade-in-up fade-in-up-delay-5">
          <Link to="/profiles">
            <Button
              size="lg"
              className="text-base px-8 py-6 glow-primary glow-primary-hover rounded-xl font-semibold"
            >
              <span className="mr-2">⚡</span>
              Explore Profiles
            </Button>
          </Link>
          <Link to="/fflags">
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 rounded-xl font-semibold border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <span className="mr-2">🏴</span>
              Browse Flags
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
              className="text-base px-8 py-6 rounded-xl font-semibold border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <span className="mr-2">⭐</span>
              Star on GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
