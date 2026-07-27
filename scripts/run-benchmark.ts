// Maintainer eval script — engineering-doc.md Flow 4.6. Run with
// `npm run benchmark` after any prompt/taxonomy revision. Requires
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (populated benchmark_trials
// table) and ANTHROPIC_API_KEY in .env.local.
import { config } from "dotenv";
config({ path: ".env.local" });

import { getSupabase } from "../lib/supabase";
import { analyzeTrial } from "../lib/pipeline/analyzeTrial";

const PROMPT_VERSION = "v1";

async function main() {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const { data: trials, error } = await supabase
    .from("benchmark_trials")
    .select("nct_id, true_reason_category");

  if (error || !trials || trials.length === 0) {
    console.error("No benchmark trials found. Add rows to benchmark_trials first (see supabase/schema.sql).");
    process.exit(1);
  }

  let matched = 0;
  for (const trial of trials) {
    console.log(`Running ${trial.nct_id}...`);
    try {
      const result = await analyzeTrial(trial.nct_id);
      if (result.status !== "analyzed") {
        console.warn(`  Skipped — status is ${result.status}, not a failure trial.`);
        continue;
      }

      const top = result.hypotheses[0];
      const isMatch = top.category === trial.true_reason_category;
      if (isMatch) matched += 1;

      await supabase.from("eval_runs").insert({
        nct_id: trial.nct_id,
        prompt_version: PROMPT_VERSION,
        top_hypothesis_category: top.category,
        matched_true_reason: isMatch,
      });

      console.log(`  Top hypothesis: ${top.category} — ${isMatch ? "MATCH" : "no match"}`);
    } catch (err) {
      console.error(`  Failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  const accuracy = (matched / trials.length) * 100;
  console.log(`\nAccuracy: ${matched}/${trials.length} (${accuracy.toFixed(1)}%) — threshold is 70% per PRD.md Section 6.`);
  process.exit(accuracy >= 70 ? 0 : 1);
}

main();
