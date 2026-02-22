import { useMemo } from "react";

export function ParticlesBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      color:
        i % 3 === 0
          ? "oklch(0.65 0.2 260 / 40%)"
          : i % 3 === 1
            ? "oklch(0.6 0.25 300 / 30%)"
            : "oklch(0.7 0.18 180 / 25%)",
    }));
  }, []);

  return (
    <div className="particles-bg">
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
