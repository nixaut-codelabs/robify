import { useState, useEffect, useRef } from "react";

interface StatItem {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, isVisible, duration]);

  return count;
}

function StatCard({ stat, index, isVisible }: { stat: StatItem; index: number; isVisible: boolean }) {
  const count = useCountUp(stat.value, isVisible);

  return (
    <div
      className="glass-card rounded-2xl p-6 text-center glow-border fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl">{stat.icon}</span>
      </div>
      <div className="text-3xl sm:text-4xl font-black mb-1 counter-value">
        {stat.value >= 10000
          ? `${Math.floor(count / 1000)}K`
          : count}
        <span className="text-muted-foreground text-xl">{stat.suffix}</span>
      </div>
      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<StatItem[]>([
    { icon: "⚡", value: 0, suffix: "+", label: "Fast Flags", color: "from-yellow-500/20 to-orange-500/20" },
    { icon: "🎯", value: 0, suffix: "", label: "Profiles", color: "from-blue-500/20 to-cyan-500/20" },
    { icon: "⭐", value: 0, suffix: "", label: "GitHub Stars", color: "from-purple-500/20 to-pink-500/20" },
    { icon: "🔄", value: 24, suffix: "/7", label: "Real-time Updates", color: "from-green-500/20 to-emerald-500/20" },
    { icon: "✅", value: 99, suffix: "%", label: "Accuracy Rate", color: "from-red-500/20 to-rose-500/20" },
  ]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: { totalFlags: number; totalProfiles: number; githubStars: number }) => {
        setStats((prev) => [
          { ...prev[0]!, value: data.totalFlags },
          { ...prev[1]!, value: data.totalProfiles },
          { ...prev[2]!, value: data.githubStars },
          prev[3]!,
          prev[4]!,
        ]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className="relative py-8" ref={ref}>
      <div className="section-divider mb-8" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powered by <span className="gradient-text">Numbers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join thousands of players who trust Robify for their Roblox optimization needs.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
