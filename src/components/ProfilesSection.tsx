import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

interface ProfileFlag {
  name: string;
  value: string;
  description: string;
}

interface Profile {
  id: string;
  name: string;
  description: string;
  category: string;
  flags: ProfileFlag[];
  benefits: string[];
  compatibility: string[];
  impact: string;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
}

const categoryIcons: Record<string, string> = {
  Performance: "🚀",
  Network: "🌐",
  Graphics: "🎨",
  Debug: "🔧",
};

const categoryColors: Record<string, string> = {
  Performance: "from-red-500/20 to-orange-500/20",
  Network: "from-green-500/20 to-emerald-500/20",
  Graphics: "from-purple-500/20 to-pink-500/20",
  Debug: "from-indigo-500/20 to-violet-500/20",
};

const impactStyles: Record<string, string> = {
  High: "bg-green-500/10 text-green-400 border-green-500/20",
  Medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Low: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export function ProfilesSection() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data: Profile[]) => setProfiles(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section id="profiles" className="relative py-8">
      <div className="section-divider mb-8" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="status-badge mb-4 inline-flex">
            <span>🎯</span> Ready to Use
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-4">
            Pre-built <span className="gradient-text">Profiles</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated flag combinations for specific use cases. Apply with one click
            and feel the difference.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full"
            >
            <Card className="glass-card border-white/5 overflow-hidden group flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[profile.category] || "from-blue-500/20 to-cyan-500/20"} flex items-center justify-center text-2xl`}>
                    {categoryIcons[profile.category] || "📦"}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${impactStyles[profile.impact] || impactStyles.Medium}`}>
                    🔥 {profile.impact}
                  </span>
                </div>
                <CardTitle className="text-lg">{profile.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {profile.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground">{profile.flags.length} flags</span>
                  <span className="text-muted-foreground/30">•</span>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground">
                      {profile.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground">
                      {profile.difficulty}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link to="/profiles" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/10 hover:border-white/20 hover:bg-white/5"
                  >
                    View Profile →
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </div>

        {profiles.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/profiles">
              <Button variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/5">
                View All Profiles →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
