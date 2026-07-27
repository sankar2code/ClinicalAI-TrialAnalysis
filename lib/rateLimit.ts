import { getSupabase } from "./supabase";

// Sliding-window per-IP limiter, per engineering-doc.md Section 6 and
// PRD.md Open Questions. Ships inactive (RATE_LIMIT_ENABLED unset/false)
// — flip the env var on to activate with zero code changes. Backed by
// evidence_cache's Supabase connection rather than Redis (this project's
// Supabase-only decision); a coarse table-based counter is fine at the
// low request volumes this limiter is meant for.
const WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 30;

export async function isRateLimited(ip: string): Promise<boolean> {
  if (process.env.RATE_LIMIT_ENABLED !== "true") return false;

  const supabase = getSupabase();
  if (!supabase) return false; // no store configured — fail open, not closed

  const windowStart = new Date(Date.now() - WINDOW_SECONDS * 1000).toISOString();
  const { count, error } = await supabase
    .from("rate_limit_events")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", windowStart);

  if (error) return false; // never block a request over a limiter failure

  if ((count ?? 0) >= MAX_REQUESTS_PER_WINDOW) return true;

  await supabase.from("rate_limit_events").insert({ ip });
  return false;
}
