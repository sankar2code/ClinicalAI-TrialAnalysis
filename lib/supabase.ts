import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side only — uses the service role key, which bypasses Row Level
// Security. Never import this file from a client component. Deliberately
// lazy and nullable: the app must keep working (cache misses, feedback
// no-ops) if Supabase isn't configured yet, per the "optional for now"
// scope decision — see supabase/schema.sql for the tables this expects.
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    cached = null;
    return cached;
  }

  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
