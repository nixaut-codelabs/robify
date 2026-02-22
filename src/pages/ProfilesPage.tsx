import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const impactColors: Record<string, string> = {
  Low: "bg-green-500/15 text-green-400 border-green-500/25",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  High: "bg-red-500/15 text-red-400 border-red-500/25",
};

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-500/15 text-green-400 border-green-500/25",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  Hard: "bg-red-500/15 text-red-400 border-red-500/25",
};

const categoryIcons: Record<string, string> = {
  Performance: "🚀",
  Network: "🌐",
  Graphics: "🎨",
  Debug: "🔧",
};

export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data: Profile[]) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyProfileJson = (profile: Profile) => {
    const flagsObj: Record<string, string> = {};
    for (const f of profile.flags) {
      flagsObj[f.name] = f.value;
    }
    navigator.clipboard.writeText(JSON.stringify(flagsObj, null, 2));
    setCopied(profile.id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin inline-block">⚙️</div>
          <p className="text-muted-foreground">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            Optimization <span className="gradient-text">Profiles</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pre-built flag combinations for specific use cases. Apply with one click and
            feel the difference. Currently{" "}
            <span className="text-foreground font-semibold">
              {profiles.length}
            </span>{" "}
            profiles available.
          </p>
        </motion.div>

        {/* Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full"
            >
            <Card className="glass-card border-white/5 overflow-hidden group flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-3xl">
                    {categoryIcons[profile.category] || "📦"}
                  </div>
                  <div className="flex gap-1.5">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${impactColors[profile.impact] || impactColors.Low}`}
                    >
                      {profile.impact} Impact
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${difficultyColors[profile.difficulty] || difficultyColors.Easy}`}
                    >
                      {profile.difficulty}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {profile.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground">
                    {profile.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {profile.flags.length} flags
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-xs text-muted-foreground">
                    {profile.compatibility.join(", ")}
                  </span>
                </div>

                {/* Benefits */}
                <div className="space-y-1.5 mb-4">
                  {profile.benefits.map((b) => (
                    <div
                      key={b}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <svg
                        className="size-3.5 text-primary shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {b}
                    </div>
                  ))}
                </div>

                {/* Expanded: Flag list */}
                <AnimatePresence>
                  {expandedId === profile.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 pt-4 mt-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Flags ({profile.flags.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                          {profile.flags.map((flag) => (
                            <div
                              key={flag.name}
                              className="bg-black/20 rounded-lg p-3 border border-white/5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <code className="text-xs font-mono text-foreground truncate">
                                  {flag.name}
                                </code>
                                <code className="text-xs text-primary shrink-0 font-medium">
                                  "{flag.value}"
                                </code>
                              </div>
                              {flag.description && (
                                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                                  {flag.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* JSON Preview */}
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            ClientAppSettings.json
                          </h4>
                          <pre className="text-[10px] bg-black/40 border border-white/5 rounded-lg p-3 overflow-x-auto max-h-40 font-mono text-primary-foreground/80">
                            {JSON.stringify(
                              Object.fromEntries(
                                profile.flags.map((f) => [f.name, f.value])
                              ),
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 hover:border-white/20 hover:bg-white/5"
                  onClick={() =>
                    setExpandedId(
                      expandedId === profile.id ? null : profile.id
                    )
                  }
                >
                  {expandedId === profile.id ? "Hide Flags ↑" : "View Flags →"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 hover:border-white/20 hover:bg-white/5"
                  onClick={() => copyProfileJson(profile)}
                >
                  {copied === profile.id ? "✅ Copied!" : "📋 Copy JSON"}
                </Button>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
