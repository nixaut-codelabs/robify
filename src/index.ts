import { serve } from "bun";
import index from "./index.html";

// --- Types ---
interface FlagEntry {
  name: string;
  description: string;
  category: string;
  impact: string;
  status: string;
  value?: string;
  valueType?: string;
  risk?: string;
}

interface ProfileEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  flags: { name: string; value: string; description: string }[];
  benefits: string[];
  compatibility: string[];
  impact: string;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
}

// --- Data loading ---
const flagsJsonRaw: { name: string; description: string; category: string; impact: string; status: string }[] = await Bun.file("data/flags.json").json();
const profilesData: ProfileEntry[] = await Bun.file("data/profiles.json").json();

const flagDescriptions = new Map<string, typeof flagsJsonRaw[0]>();
for (const f of flagsJsonRaw) {
  flagDescriptions.set(f.name, f);
}

// --- Roblox API Cache ---
let cachedFlags: FlagEntry[] = [];
let flagsCacheTime = 0;
const FLAGS_CACHE_TTL = 5 * 60 * 1000; // 5 min

function detectValueType(value: string): string {
  if (value === "True" || value === "False") return "boolean";
  if (/^-?\d+$/.test(value)) return "integer";
  if (/^-?\d+\.\d+$/.test(value)) return "float";
  return "string";
}

function detectCategory(name: string, existing?: string): string {
  if (existing) return existing;
  const lower = name.toLowerCase();
  if (lower.includes("render") || lower.includes("graphics") || lower.includes("shadow") || lower.includes("light") || lower.includes("texture")) return "Rendering";
  if (lower.includes("network") || lower.includes("packet") || lower.includes("http") || lower.includes("raknet") || lower.includes("latency")) return "Network";
  if (lower.includes("physics") || lower.includes("collision") || lower.includes("broadphase")) return "Physics";
  if (lower.includes("audio") || lower.includes("sound")) return "Audio";
  if (lower.includes("debug") || lower.includes("log") || lower.includes("telemetry") || lower.includes("diag")) return "Debug";
  if (lower.includes("gui") || lower.includes("ui") || lower.includes("menu") || lower.includes("topbar")) return "UI";
  if (lower.includes("perf") || lower.includes("fps") || lower.includes("memory") || lower.includes("cache") || lower.includes("optim")) return "Performance";
  if (lower.includes("anim") || lower.includes("ik")) return "Animation";
  if (lower.includes("camera")) return "Camera";
  if (lower.includes("chat")) return "Chat";
  return "Other";
}

async function fetchAndMergeFlags(): Promise<FlagEntry[]> {
  const now = Date.now();
  if (cachedFlags.length > 0 && now - flagsCacheTime < FLAGS_CACHE_TTL) {
    return cachedFlags;
  }

  try {
    const res = await fetch("https://clientsettingscdn.roblox.com/v2/settings/application/PCDesktopClient", {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Roblox API ${res.status}`);

    const data = await res.json() as { applicationSettings: Record<string, string> };
    const robloxFlags = data.applicationSettings;

    const merged: FlagEntry[] = [];

    for (const [name, rawValue] of Object.entries(robloxFlags)) {
      const value = String(rawValue);
      const desc = flagDescriptions.get(name);
      merged.push({
        name,
        description: desc?.description || "",
        category: detectCategory(name, desc?.category),
        impact: desc?.impact || "Low",
        status: desc?.status || "Stable",
        value,
        valueType: detectValueType(value),
        risk: "Unknown",
      });
    }

    merged.sort((a, b) => a.name.localeCompare(b.name));
    cachedFlags = merged;
    flagsCacheTime = now;
    console.log(`✅ Fetched ${merged.length} flags from Roblox API`);
    return merged;
  } catch (err) {
    console.error("❌ Roblox API error, using cached/fallback:", err);
    if (cachedFlags.length > 0) return cachedFlags;

    // Fallback to local flags.json
    const fallback: FlagEntry[] = flagsJsonRaw.map((f) => ({
      ...f,
      value: "",
      valueType: "unknown",
      risk: "Unknown",
    }));
    cachedFlags = fallback;
    flagsCacheTime = now;
    return fallback;
  }
}

// Pre-fetch on startup
fetchAndMergeFlags();

// --- GitHub Stars Cache ---
let cachedStars: number | null = null;
let starsCacheTime = 0;
const STARS_CACHE_TTL = 15 * 60 * 1000; // 15 min

async function fetchGitHubStars(): Promise<number> {
  const now = Date.now();
  if (cachedStars !== null && now - starsCacheTime < STARS_CACHE_TTL) {
    return cachedStars;
  }

  try {
    const res = await fetch("https://api.github.com/repos/nixaut-codelabs/robify", {
      headers: { "Accept": "application/vnd.github.v3+json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json() as { stargazers_count: number };
    cachedStars = data.stargazers_count ?? 0;
    starsCacheTime = now;
    return cachedStars;
  } catch {
    return cachedStars ?? 0;
  }
}

// --- CORS helper ---
function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

// --- Server ---
const server = serve({
  routes: {
    "/*": index,

    "/api/fflags": {
      async GET() {
        const flags = await fetchAndMergeFlags();
        const categories: Record<string, number> = {};
        const impacts: Record<string, number> = {};
        const statuses: Record<string, number> = {};

        for (const f of flags) {
          categories[f.category] = (categories[f.category] || 0) + 1;
          impacts[f.impact] = (impacts[f.impact] || 0) + 1;
          statuses[f.status] = (statuses[f.status] || 0) + 1;
        }

        return jsonResponse({
          total: flags.length,
          categories,
          impacts,
          statuses,
          lastUpdated: new Date(flagsCacheTime).toISOString(),
        });
      },
    },

    "/api/fflags/list": {
      async GET(req) {
        const url = new URL(req.url);
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50")));
        const search = (url.searchParams.get("search") || "").toLowerCase().trim();
        const category = url.searchParams.get("category") || "";
        const impact = url.searchParams.get("impact") || "";
        const status = url.searchParams.get("status") || "";

        let flags = await fetchAndMergeFlags();

        if (search) {
          flags = flags.filter(
            (f) =>
              f.name.toLowerCase().includes(search) ||
              f.description.toLowerCase().includes(search)
          );
        }
        if (category) {
          flags = flags.filter((f) => f.category === category);
        }
        if (impact) {
          flags = flags.filter((f) => f.impact === impact);
        }
        if (status) {
          flags = flags.filter((f) => f.status === status);
        }

        const total = flags.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const items = flags.slice(start, start + limit);

        return jsonResponse({
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        });
      },
    },

    "/api/fflags/:name": async (req) => {
      const name = req.params.name;
      const flags = await fetchAndMergeFlags();
      const flag = flags.find((f) => f.name === name);

      if (!flag) {
        return jsonResponse({ error: "Flag not found" }, 404);
      }

      return jsonResponse(flag);
    },

    "/api/profiles": {
      async GET() {
        return jsonResponse(profilesData);
      },
    },

    "/api/profiles/:id": async (req) => {
      const id = req.params.id;
      const profile = profilesData.find((p) => p.id === id);

      if (!profile) {
        return jsonResponse({ error: "Profile not found" }, 404);
      }

      return jsonResponse(profile);
    },

    "/api/github/stars": {
      async GET() {
        const stars = await fetchGitHubStars();
        return jsonResponse({ stars });
      },
    },

    "/api/stats": {
      async GET() {
        const flags = await fetchAndMergeFlags();
        const stars = await fetchGitHubStars();

        return jsonResponse({
          totalFlags: flags.length,
          totalProfiles: profilesData.length,
          githubStars: stars,
          categories: [...new Set(flags.map((f) => f.category))].length,
        });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
