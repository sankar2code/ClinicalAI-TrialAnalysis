import { getSupabase } from "./supabase";
import type { RawStudyRecord } from "./clients/ctgov";
import type { PubMedAbstract } from "./clients/pubmed";

// engineering-doc.md originally specified Redis for this; the project
// swapped to Supabase Postgres (see supabase/schema.sql, table
// `evidence_cache`) to keep a single external dependency. Caches the raw
// fetch/enrichment layer only, never derived output (not the LLM
// reasoning, not the trial snapshot) — both the failure-analysis path
// and the non-failure snapshot path derive their own narrower view from
// this same cached pair, so a cache hit serves either without re-fetching
// ClinicalTrials.gov or PubMed. 24h TTL. Always a graceful no-op (cache
// miss) if Supabase isn't configured — caching is a cost optimization,
// not a correctness requirement.
export interface CachedTrialData {
  study: RawStudyRecord;
  publications: PubMedAbstract[];
}

const TTL_HOURS = 24;

export async function getCachedTrialData(nctId: string): Promise<CachedTrialData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("evidence_cache")
      .select("packet, expires_at")
      .eq("nct_id", nctId)
      .maybeSingle();

    if (error || !data) return null;
    if (new Date(data.expires_at).getTime() < Date.now()) return null;

    return data.packet as CachedTrialData;
  } catch {
    return null; // cache is a cost optimization, never a hard dependency
  }
}

export async function setCachedTrialData(nctId: string, trialData: CachedTrialData): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000).toISOString();
    await supabase
      .from("evidence_cache")
      .upsert({ nct_id: nctId, packet: trialData, expires_at: expiresAt }, { onConflict: "nct_id" });
  } catch {
    // A failed cache write should never fail the analysis request itself.
  }
}
