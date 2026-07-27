import { fetchStudy } from "../clients/ctgov";
import { resolvePublications } from "../clients/pubmed";
import { runReasoningPass } from "../clients/anthropic";
import { buildEvidencePacket } from "./buildEvidencePacket";
import { buildTrialSnapshot } from "./buildTrialSnapshot";
import { getCachedTrialData, setCachedTrialData, type CachedTrialData } from "../cache";
import {
  FAILURE_STATUSES,
  type OverallStatus,
  type AnalysisResult,
  type TrialMeta,
  type TrialSnapshot,
} from "../schema/analysisResult";

export type AnalyzeResult =
  | ({ status: "analyzed"; trial: TrialMeta } & AnalysisResult)
  | { status: "snapshot"; trial: TrialMeta; snapshot: TrialSnapshot };

// Orchestrates the full pipeline documented in engineering-doc.md Section
// 6 and PRD.md Section 4: cache lookup -> CT.gov fetch -> PubMed
// enrichment -> cache write -> status branch. TERMINATED / WITHDRAWN /
// SUSPENDED trials get the LLM failure-reasoning pass; every other status
// gets a fact-only TrialSnapshot built with zero LLM calls (see
// buildTrialSnapshot.ts). Called directly by both the server component
// (app/analysis/[nctId]/page.tsx) and the API route
// (app/api/analyze/[nctId]/route.ts) so there's exactly one
// implementation of this logic, not an HTTP self-call.
export async function analyzeTrial(nctId: string): Promise<AnalyzeResult> {
  let trialData: CachedTrialData | null = await getCachedTrialData(nctId);

  if (!trialData) {
    const study = await fetchStudy(nctId); // throws TrialNotFoundError / CtGovUpstreamError
    const publications = await resolvePublications(study.references);
    trialData = { study, publications };
    await setCachedTrialData(nctId, trialData);
  }

  const { study, publications } = trialData;
  const overallStatus = study.overallStatus as OverallStatus;
  const trial: TrialMeta = {
    nctId: study.nctId,
    title: study.title,
    overallStatus,
  };

  if (!FAILURE_STATUSES.has(overallStatus)) {
    const snapshot = buildTrialSnapshot(study, publications);
    return { status: "snapshot", trial, snapshot };
  }

  const packet = buildEvidencePacket(study, publications);
  const result = await runReasoningPass(packet); // throws AnthropicUpstreamError / AnalysisSchemaError
  return { status: "analyzed", trial, ...result };
}
