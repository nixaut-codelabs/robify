import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/lib/useDebounce";

interface FlagItem {
  name: string;
  description: string;
  category: string;
  impact: string;
  status: string;
  value?: string;
  valueType?: string;
  risk?: string;
}

interface FlagListResponse {
  items: FlagItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface StatsResponse {
  total: number;
  categories: Record<string, number>;
  impacts: Record<string, number>;
  statuses: Record<string, number>;
  lastUpdated: string;
}

const CATEGORIES = [
  "All",
  "Rendering",
  "Network",
  "Physics",
  "Debug",
  "UI",
  "Performance",
  "Audio",
  "Animation",
  "Camera",
  "Chat",
  "Other",
];

const IMPACTS = ["All", "Low", "Medium", "High"];
const STATUSES = ["All", "Stable", "Experimental"];

const categoryColors: Record<string, string> = {
  Rendering: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Network: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Physics: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  Debug: "bg-gray-500/15 text-gray-400 border-gray-500/25",
  UI: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  Performance: "bg-green-500/15 text-green-400 border-green-500/25",
  Audio: "bg-pink-500/15 text-pink-400 border-pink-500/25",
  Animation: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  Camera: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  Chat: "bg-teal-500/15 text-teal-400 border-teal-500/25",
  Other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
};

const impactColors: Record<string, string> = {
  Low: "bg-green-500/15 text-green-400 border-green-500/25",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  High: "bg-red-500/15 text-red-400 border-red-500/25",
};

const riskColors: Record<string, string> = {
  Low: "bg-green-500/15 text-green-400 border-green-500/25",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  High: "bg-red-500/15 text-red-400 border-red-500/25",
  Unknown: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
};

const statusColors: Record<string, string> = {
  Stable: "bg-green-500/15 text-green-400 border-green-500/25",
  Experimental: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${colorClass}`}
    >
      {label}
    </span>
  );
}

export function FastFlagsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [impact, setImpact] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<FlagListResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<FlagItem | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetch("/api/fflags")
      .then((r) => r.json())
      .then((d: StatsResponse) => setStats(d))
      .catch(() => {});
  }, []);

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "50",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category !== "All") params.set("category", category);
      if (impact !== "All") params.set("impact", impact);
      if (status !== "All") params.set("status", status);

      const res = await fetch(`/api/fflags/list?${params}`);
      const json: FlagListResponse = await res.json();
      setData(json);
    } catch {
      console.error("Failed to fetch flags");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, impact, status]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, impact, status]);

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            <span className="gradient-text">Fast Flags</span> Explorer
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse, search and explore{" "}
            <span className="text-foreground font-semibold">
              {stats ? stats.total.toLocaleString() : "..."}
            </span>{" "}
            Roblox Fast Flags fetched directly from Roblox CDN.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 fade-in-up fade-in-up-delay-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search flags by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 bg-white/5 border-white/10"
              />
            </div>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 bg-white/5 border-white/10 w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Impact */}
            <Select value={impact} onValueChange={setImpact}>
              <SelectTrigger className="h-10 bg-white/5 border-white/10 w-full">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                {IMPACTS.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i === "All" ? "All Impacts" : i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 bg-white/5 border-white/10 w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results info */}
          {data && (
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {data.items.length} of {data.pagination.total.toLocaleString()} flags
                {data.pagination.totalPages > 1 &&
                  ` • Page ${data.pagination.page} of ${data.pagination.totalPages}`}
              </span>
              {stats && (
                <span>
                  Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Flag List */}
        <div className="space-y-2 mb-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4 animate-spin inline-block">⚙️</div>
              <p className="text-muted-foreground">Loading flags...</p>
            </div>
          ) : data && data.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-muted-foreground">No flags found matching your criteria.</p>
            </div>
          ) : (
            <AnimatePresence>
              {data?.items.map((flag, i) => {
                const isExpanded = selectedFlag?.name === flag.name;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.2) }}
                    key={flag.name}
                    className="glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/[0.06]"
                    onClick={() => setSelectedFlag(isExpanded ? null : flag)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <code className="text-sm font-mono text-foreground truncate max-w-full">
                            {flag.name}
                          </code>
                        </div>
                        {flag.description && !isExpanded && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {flag.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                        <Badge
                          label={flag.category}
                          colorClass={categoryColors[flag.category] || categoryColors.Other}
                        />
                        <Badge
                          label={flag.impact}
                          colorClass={impactColors[flag.impact] || impactColors.Low}
                        />
                        <Badge
                          label={flag.risk || "Unknown"}
                          colorClass={riskColors[flag.risk || "Unknown"]}
                        />
                        <Badge
                          label={flag.status}
                          colorClass={statusColors[flag.status] || statusColors.Stable}
                        />
                      </div>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                              <div>
                                <span className="text-xs text-muted-foreground block mb-1">
                                  Default Value
                                </span>
                                <code className="text-sm text-foreground bg-white/5 px-2 py-1 rounded block break-all">
                                  {flag.value !== undefined && flag.value !== ""
                                    ? `"${flag.value}"`
                                    : "N/A"}
                                </code>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block mb-1">
                                  Data Type
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                  {flag.valueType || "unknown"}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block mb-1">
                                  Category
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                  {flag.category}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground block mb-1">
                                  Risk Level
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                  {flag.risk || "Unknown"} <span className="text-[10px] text-muted-foreground ml-1">(AI Pending)</span>
                                </span>
                              </div>
                            </div>

                            {flag.description && (
                              <div className="mt-4 bg-primary/5 border border-primary/10 rounded-xl p-4">
                                <span className="text-xs font-semibold text-primary block mb-1">
                                  Documentation
                                </span>
                                <p className="text-sm text-foreground leading-relaxed">
                                  {flag.description}
                                </p>
                              </div>
                            )}

                            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
                              <div className="flex-1">
                                <span className="text-xs text-muted-foreground block mb-1">
                                  JSON Format
                                </span>
                                <pre className="text-xs bg-black/40 border border-white/5 rounded-xl p-3 overflow-x-auto text-primary-foreground/80 font-mono">
                                  {JSON.stringify(
                                    { [flag.name]: flag.value ?? "" },
                                    null,
                                    2
                                  )}
                                </pre>
                              </div>
                              <div className="flex sm:flex-col justify-end gap-2 pt-5">
                                <Button
                                  size="sm"
                                  className="w-full sm:w-auto glow-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(
                                      JSON.stringify(
                                        { [flag.name]: flag.value ?? "" },
                                        null,
                                        2
                                      )
                                    );
                                  }}
                                >
                                  <svg className="size-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                  Copy JSON
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasPrev}
              onClick={() => setPage(page - 1)}
              className="border-white/10 hover:bg-white/5"
            >
              ← Prev
            </Button>

            {Array.from(
              { length: Math.min(7, data.pagination.totalPages) },
              (_, i) => {
                let pageNum: number;
                const total = data.pagination.totalPages;
                if (total <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= total - 3) {
                  pageNum = total - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={
                      pageNum === page
                        ? "glow-primary"
                        : "border-white/10 hover:bg-white/5"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasNext}
              onClick={() => setPage(page + 1)}
              className="border-white/10 hover:bg-white/5"
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
