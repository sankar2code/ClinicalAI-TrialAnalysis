### PRD Evaluation Report: Clinical Trial Failure Investigator

**Format detected:** Full AI PRD *(matched on: roadmap with phases, pricing section, market sizing, and explicit week labels)*
**Author:** Product Team
**21 passing · 21 blockers · 9 improvements**

| Section | Status |
|---|---|
| 1. Problem Definition & Core Metrics | ● 3 blockers · ● 3 improvements |
| 2. Solution Definition | ● 1 blocker · ● 1 improvement |
| 3. Prioritization | ● 1 improvement |
| 4. Roadmap | ● 3 improvements |
| 5. Implementation Plan | ● 2 blockers |
| 6. Evaluation Plan | ● 5 blockers · ● 1 improvement |
| 7. Data Requirements & Prompt Strategy | ● 2 blockers |
| 8. Responsible AI | ● 3 blockers |
| 9. Pricing & Cost Structure | ● 5 blockers |

---

#### Strengths

1. **The core credibility mechanism is genuinely well designed.** The fact/inference/hypothesis labeling contract, the mandatory counter-argument per hypothesis, and the strict JSON schema (FR6–FR7) go well beyond "we'll prompt it to be careful" — this is the strongest part of the document and directly addresses hallucination and explainability (2.2).
2. **Scope discipline is real, not aspirational.** Section 3.3 (Out of Scope) explicitly excludes accounts, batch analysis, and extra data sources, and Section 3.4 states a genuine learning goal rather than just a feature list — this is a legitimately narrow, testable MVP.
3. **Edge-case thinking in the user stories is above average.** US-4 (handling completed/ongoing trials without forcing a failure narrative) is the kind of requirement many PRDs miss entirely, and it's backed by a concrete functional requirement (FR10).

---

#### Blockers

| Item | Gap |
|---|---|
| 1.3 Problem validated with real data | No survey, interview, or cited research on the actual target users — the only stat given (450K+ studies) doesn't validate the specific pain point. |
| 1.5 Defensible MOAT | The doc names a feature gap ("no competitor does this"), not a MOAT — Section 6's own Risk of Inaction line admits a competitor or GlobalData could replicate this. |
| 1.9 North Star metric | Five metrics are listed in Section 1 with no single one declared primary. |
| 2.1 Visual user flow | Section 3.1 is a prose paragraph; there's no diagram or numbered input→processing→output flow distinguishing user actions from system actions. |
| 5.1 Model selection criteria | Open Question 1 poses Anthropic API vs. Bedrock with no stated criteria (latency, cost, context window, accuracy) to decide between them. |
| 5.2 Chosen model justified vs. alternatives | No model has actually been selected — it's left as an open question, not a decision with rationale. |
| 6.1 AI performance evaluation over time | No mention of an ongoing evaluation methodology for the reasoning output itself (as opposed to system uptime/error rate). |
| 6.2 Ground truth datasets | No labeled dataset, benchmark, or reference set of trials-with-known-causes to test hypothesis quality against. |
| 6.3 Accuracy thresholds / HHH scores | The only quantified targets (Section 1, Timeline) cover system reliability, not reasoning quality — no target like "≥X% of hypotheses rated plausible by a domain reviewer." |
| 6.4 Evaluation spreadsheet | No eval spreadsheet, tracker, or plan for one is mentioned anywhere. |
| 6.6 Experimentation / A-B testing | No experiment (prompt variant test, holdback, phased rollout) is described. |
| 7.3 Prompting techniques | No mention of which prompting technique (few-shot, chain-of-thought, structured extraction) the reasoning engine will use or why. |
| 7.5 Prompt improvement plan | No process for revising the prompt/taxonomy based on user feedback or observed errors post-launch. |
| 8.1 Risks across all 4 Responsible AI pillars | Transparency and Reliability are strongly covered; Accountability (who owns a wrong hypothesis) and Fairness (systematic bias by sponsor type, phase, or indication) are absent. |
| 8.2 Human-in-the-loop and fallback paths | The only fallback described is a technical retry-then-error-state (Reliability NFR) — there's no human review step for content correctness anywhere in the pipeline. |
| 8.4 Bias, hallucination, and safe failure modes | Hallucination and safe failure are both well covered; bias (e.g., skewed reasoning by sponsor reputation or disease area) is never mentioned. |
| 9.1 Cost/accuracy tradeoffs | No infrastructure or model choice is explained in terms of its cost-vs-accuracy tradeoff. |
| 9.2 Development costs (infra + manpower) | Budget section gives "$0 (solo build)" with no manpower time estimate and only a vague infra range ("low tens of dollars/month"). |
| 9.4 Market size (TAM, SAM) | Section 2.2 gives a rough, unsourced "tens of thousands of users" estimate — no TAM/SAM figures or calculation basis. |
| 9.5 Revenue scenarios | None provided — monetization is explicitly deferred with zero scenario modeling. |
| 9.7 Directional pricing | No price point is named anywhere, including for the hypothetical future paid tier mentioned in Section 2.3. |

---

#### Improvements

| Item | Gap |
|---|---|
| 1.2 Customer personas | Five personas are named at once (analyst, investor, CI researcher, regulatory researcher, journalist, advocacy group) with no single one prioritized or explored in depth. |
| 1.6 Agentic AI justified over rule-based | Implied ("LLM reasoning quality has reached the point where...") but never explicitly argued why rules/heuristics can't do this classification. |
| 1.7 Unstructured data types listed | Free-text `whyStopped` and PubMed abstracts are used but never explicitly called out as unstructured inputs with a stated reason rules-based parsing would fail on them. |
| 2.4 Agent capabilities and system behavior | Error/edge-case handling is well covered (FR10, Reliability NFR), but there's no explicit statement of what the system does fully autonomously vs. anything requiring review. |
| 3.3 ML feasibility / data availability / accuracy / explainability per component | Explainability and data-sparsity risk are addressed; there's no stated accuracy or quality expectation for the reasoning component specifically. |
| 4.1 Clear phases (MVP, MVP1, Launch, Iteration) | Only one phase (the 8-week MVP build) is roadmapped — no defined next phase beyond the open questions. |
| 4.3 Roadmap items linked to priorities/risks | Timeline milestones loosely track the P0 feature list but aren't explicitly cross-referenced to the Section 6 risk table. |
| 4.5 Phasing realistic and distinct | P0 vs. P1/P2 exists in the scope table, but the roadmap itself treats the whole build as one undifferentiated push to "Public MVP launch" rather than a smaller validation step before full build-out. |
| 6.7 Post-launch monitoring | API-deprecation and cost monitoring are mentioned in Risks, but there's no defined cadence, alerting threshold, or drift-detection plan for reasoning quality specifically. |

---

#### Section Detail

**Section 1: Problem Definition & Core Metrics**

| Status | Item | Notes |
|---|---|---|
| Pass | 1.1 Problem & JTBD | Clearly states what breaks (uninformative `whyStopped`, scattered evidence) and what users currently have to do manually. |
| Improvement | 1.2 Customer personas | Five roles named with industry, but no single persona is prioritized or given individual depth. |
| Blocker | 1.3 Problem validated with data | No interview, survey, or user-specific research cited; the only stat is a general registry-size figure. |
| Pass | 1.4 Why worth solving | Impact bullet in Section 2.1 ties the problem to real decision cost (investment/licensing decisions, duplicated failed research). |
| Blocker | 1.5 Defensible MOAT | No data advantage, lock-in, or fine-tuning moat is named; the doc itself flags replicability as a risk. |
| Improvement | 1.6 Agentic AI justified | Implied by "LLM reasoning quality has reached the point where..." but never argued against a rules-based alternative directly. |
| Improvement | 1.7 Unstructured data types listed | Free-text stop reasons and abstracts are used throughout but never explicitly framed as "unstructured data requiring LLM judgment." |
| Pass | 1.8 Differentiated from generic AI tools | Section 2.2 explicitly contrasts against "generic LLM chat" on structure, sourcing, and labeling discipline. |
| Blocker | 1.9 North Star metric | Five Section 1 metrics, none declared primary. |
| Pass | 1.10 Primary metrics with units | Time-to-result (seconds), error rate (%), analyses completed (count) are all quantified. |
| Pass | 1.11 Secondary metrics | Return-user rate and % of analyses on terminated trials both qualify. |
| Pass | 1.12 Metrics measurable/trackable | Success Metrics table includes baseline ("Current") and target columns for every metric. |

**1.3 Problem validated with real data**
**What's missing:** The closest thing to validation is "ClinicalTrials.gov now lists 450,000+ studies" — a market-size fact, not evidence that the *specific* target personas experience this pain or would use this tool.
**What to write:** Even lightweight validation helps — e.g., "In a review of 50 randomly sampled TERMINATED trials, 71% had a `whyStopped` value of 'business decision' or blank" (this is checkable against the live API and would be a strong, specific validation data point), or cite a few analyst/investor comments on the difficulty of pipeline diligence.

**1.5 Defensible MOAT**
**What's missing:** "No competitor combines source-backed retrieval with explicit epistemic labeling" describes a current feature gap, not a moat — nothing stops Citeline, GlobalData, or a well-resourced entrant from shipping the same labeling pattern.
**What to write:** Name something that compounds over time or is hard to copy — e.g., a growing proprietary dataset of validated hypothesis outcomes used to improve the taxonomy, a curated cross-reference layer (SEC filings, press releases) competitors' raw-data tools don't have, or a specific workflow integration that creates switching cost. If none exists yet, say so honestly and flag it as a strategic risk rather than asserting differentiation as if it were a moat.

**1.9 North Star metric**
**What's missing:** The Success Metrics table lists five metrics with equal visual weight.
**What to write:** Pick one and label it explicitly, e.g., "**North Star: Analyses completed with zero unlabeled causal claims** — this is the metric that best captures both usage and the product's core credibility promise." The other four become supporting metrics underneath it.

**Section 2: Solution Definition**

| Status | Item | Notes |
|---|---|---|
| Blocker | 2.1 Visual user flow | Section 3.1 is a single prose paragraph describing the pipeline; no diagram or numbered step sequence. |
| Pass | 2.2 AI drawbacks addressed | Hallucination and explainability are extensively handled via the labeling contract, schema validation, and Guardrail block. |
| Pass | 2.3 User story format | Section 4.1 has four well-formed "As a / I want / So that" stories with acceptance criteria. |
| Improvement | 2.4 Agent capabilities/behavior | Error handling and status-based branching (FR10) are described, but there's no explicit statement of autonomous vs. reviewed behavior. |

**2.1 Visual user flow**
**What's missing:** Section 3.1 explains the pipeline in prose ("the backend fetches and normalizes... resolves linked PubMed publications... assembles an evidence packet... sends it to an LLM...") but never as a distinct, scannable flow.
**What to write:** Add a simple numbered or diagrammed flow that separates user actions from system actions, e.g.:
`User pastes NCT ID → [System] validates format → [System] fetches ClinicalTrials.gov record → [System] resolves PubMed links → [System] runs labeled reasoning pass → User sees Bottom Line / Hypotheses / Evidence / Guardrail`
Even an ASCII arrow chain satisfies this if a real diagram isn't available yet.

**2.4 Agent capabilities and system behavior**
**What's missing:** FR10 and the Reliability NFR cover *technical* error handling (retry once, then error state) well, but nothing states which decisions the system makes fully on its own versus what would trigger a human check.
**What to write:** Since this product has no human-in-the-loop step at all (see 8.2), state that explicitly as a design choice: "The system operates fully autonomously with no human review step before an analysis is shown to the user; correctness is enforced entirely through schema validation and the labeling contract, not human review." That's a legitimate answer, but it needs to be a stated decision, not a silent gap.

**Section 3: Prioritization**

| Status | Item | Notes |
|---|---|---|
| Pass | 3.1 Workflow broken into components | Fetch → normalize → enrich → reason → render is clearly named across Section 3.1 and the FR list. |
| Pass | 3.2 Risk assessment per component | Section 6 risks map reasonably to specific components (PubMed rate limits → enrichment, API downtime → data fetch, overclaiming → reasoning). |
| Improvement | 3.3 ML feasibility / accuracy / explainability per component | Explainability and data-sparsity are addressed; no accuracy/quality bar is set for the reasoning component itself. |
| Pass | 3.4 Features prioritized by risk/cost/value | Section 3.2's In Scope table uses P0/P1/P2 consistently. |
| Pass | 3.5 Scope narrowed to MVP with rationale | Section 3.3 (Out of Scope) and 3.4 (Learning Goals) draw a clear, reasoned boundary. |

**3.3 ML feasibility, data availability, accuracy, explainability per component**
**What's missing:** Data sparsity risk (Section 6) and the labeling contract (explainability) are both addressed, but there's no stated expectation for how *good* the hypotheses need to be to be useful — no quality bar for the reasoning component itself.
**What to write:** Add something like: "Target: ≥80% of hypotheses for well-documented trials (has `whyStopped` + results section) are rated 'plausible' by a domain-knowledgeable reviewer in manual QA; trials with sparse data are expected to produce lower-confidence output, not false precision."

**Section 4: Roadmap**

| Status | Item | Notes |
|---|---|---|
| Improvement | 4.1 Clear phases (MVP, MVP1, Launch, Iteration) | Only the MVP build phase is roadmapped; no post-MVP phase is defined beyond open questions. |
| Pass | 4.2 Feature sets and durations per phase | Section 7's Timeline table gives each milestone a week target and deliverables. |
| Improvement | 4.3 Roadmap linked to priorities/risks | Milestones track P0 features loosely but aren't cross-referenced to the risk table. |
| Pass | 4.4 Dependencies named | ClinicalTrials.gov API, NCBI E-utilities, and the LLM provider choice are all named as dependencies across FRs, risks, and open questions. |
| Improvement | 4.5 Phasing realistic and distinct | P0 vs. P1/P2 exists in scope, but the roadmap doesn't structure a smaller validation checkpoint before the full 8-week build. |

**4.1 Clear phases**
**What's missing:** The roadmap (Section 7) only covers the path to "Public MVP launch" — there's no MVP1/iteration phase defined for what happens after.
**What to write:** Add a lightweight Phase 2 sketch even if directional: "Post-launch iteration (Weeks 9–12): incorporate beta feedback on hypothesis quality, evaluate P1 items (caching, shareable links) for promotion, and decide on the batch-analysis paid tier based on usage data."

**4.3 Roadmap linked to priorities/risks**
**What's missing:** The Timeline table's milestones aren't explicitly tied back to which risks they retire or which P0 items they satisfy.
**What to write:** A short note per milestone, e.g., "Reasoning engine complete (Week 5) — retires the 'unlabeled overconfident claim' risk (Section 6) by enforcing schema validation before this milestone is considered done."

**4.5 Phasing realistic and distinct**
**What's missing:** The plan builds all P0 features in one continuous 8-week push to public launch, with beta mentioned in GTM (Section 5) but not reflected as a gating milestone in the roadmap itself.
**What to write:** Tie the GTM beta step into the roadmap explicitly, e.g., "Week 7: private beta with ~10 target users to validate hypothesis-quality perception before Week 8 public launch" — this turns the beta from a GTM mention into an actual phased checkpoint.

**Section 5: Implementation Plan**

| Status | Item | Notes |
|---|---|---|
| Blocker | 5.1 Model selection criteria | No criteria (cost, latency, context window, accuracy) are named anywhere. |
| Blocker | 5.2 Model justified vs. alternatives | Open Question 1 poses the choice but doesn't resolve or justify it. |

**5.1 Model selection criteria**
**What's missing:** Open Question 1 asks "Anthropic API directly... or AWS Bedrock" but gives no criteria for deciding.
**What to write:** State the criteria that matter for this use case, e.g., "Model selection criteria: (1) reliable structured/JSON output support for the strict evidence schema, (2) sufcient context window to hold a full trial record + multiple PubMed abstracts in one call, (3) cost per analysis low enough to sustain a free public tool, (4) low latency to hit the <20s P95 target."

**5.2 Model justified against alternatives**
**What's missing:** No model has actually been chosen — this is left fully open.
**What to write:** Make the call and justify it, e.g., "Chosen: Claude via the Anthropic API directly for MVP. Rejected for now: AWS Bedrock — adds IAM/provisioning overhead with no MVP-stage benefit given the solo build; revisit if AWS integration becomes a requirement for a future enterprise tier."

**Section 6: Evaluation Plan**

| Status | Item | Notes |
|---|---|---|
| Blocker | 6.1 AI performance evaluation over time | No methodology for evaluating reasoning quality over time is described. |
| Blocker | 6.2 Ground truth datasets | No benchmark or labeled reference set is named. |
| Blocker | 6.3 Accuracy thresholds / HHH | No quantified quality target for the hypotheses themselves. |
| Blocker | 6.4 Evaluation spreadsheet | Not mentioned. |
| Pass | 6.5 Launch criteria / go-no-go | The Timeline table's "Success Criteria" column functions as a measurable go/no-go gate per milestone (e.g., "100% of test analyses pass schema validation with zero unlabeled claims"). |
| Blocker | 6.6 Experimentation / A-B testing | Not mentioned anywhere. |
| Improvement | 6.7 Post-launch monitoring | API/cost monitoring is mentioned in Risks; no cadence or threshold defined for reasoning-quality monitoring specifically. |

**6.1 AI performance evaluation over time**
**What's missing:** The Success Metrics track usage and system error rate, not whether hypotheses stay accurate/useful as the taxonomy and prompt evolve.
**What to write:** "Weekly, run a fixed set of 20 benchmark NCT IDs (see 6.2) through the current prompt and manually score hypothesis plausibility; track score trend across prompt revisions to catch regressions."

**6.2 Ground truth datasets**
**What's missing:** No reference set exists to test hypothesis quality against.
**What to write:** "Build a 30–50 trial benchmark set of terminated trials with well-documented, high-confidence stop reasons (explicit `whyStopped` + published post-mortem or news coverage), used to check whether the model's top-ranked hypothesis matches the known real reason."

**6.3 Accuracy thresholds / HHH**
**What's missing:** No quantified bar for reasoning quality — only system-level error rate (<3%) is targeted.
**What to write:** "Target: top-ranked hypothesis matches the documented real reason in ≥70% of benchmark-set trials (6.2); 100% of claims carry a Fact/Inference/Hypothesis label (already a hard schema requirement, restate here as the Honest/Helpful bar)."

**6.4 Evaluation spreadsheet**
**What's missing:** No plan for tracking eval results over time.
**What to write:** State even a lightweight plan: "Maintain a spreadsheet with columns: NCT ID, run date, prompt version, top hypothesis, documented true reason (if known), reviewer plausibility score (1–5), notes."

**6.6 Experimentation / A-B testing**
**What's missing:** No experimentation plan for the prompt or taxonomy.
**What to write:** "Before promoting a revised prompt/taxonomy to production, run it against the full benchmark set (6.2) and compare plausibility scores against the current production prompt; only ship if scores are equal or better."

**6.7 Post-launch monitoring**
**What's missing:** Risk table mentions monitoring for API deprecation and cost, but nothing about watching reasoning quality after launch.
**What to write:** "Monthly, re-run the benchmark set against production and flag any drop in plausibility score >10% for prompt review."

**Section 7: Data Requirements & Prompt Strategy**

| Status | Item | Notes |
|---|---|---|
| Pass | 7.1 Data strategy | FR2–FR4 name specific sources (ClinicalTrials.gov v2 JSON API, NCBI E-utilities) and the pipeline steps between them. |
| Pass | 7.2 Data quality/availability/compliance | Compliance NFR addresses the PII-free nature of the data; Section 6 risk table addresses data sparsity. |
| Blocker | 7.3 Prompting techniques | No technique (few-shot, chain-of-thought, structured extraction) is named or justified. |
| Pass | 7.4 Prompt constraints/output formats | FR6 defines a strict JSON schema for the reasoning task's output. |
| Blocker | 7.5 Prompt improvement plan | No process exists for revising the prompt based on feedback or observed errors. |

**7.3 Prompting techniques**
**What's missing:** FR5–FR7 define *what* the model must output (taxonomy classification, labeled claims, schema) but never *how* the prompt gets it there.
**What to write:** "The reasoning prompt uses structured extraction with an explicit taxonomy definition and few-shot examples of correctly labeled Fact/Inference/Hypothesis output, plus a chain-of-thought scratchpad (not shown to the user) to reason through the evidence before committing to the final ranked JSON."

**7.5 Prompt improvement plan**
**What's missing:** No mechanism exists to improve the prompt/taxonomy after launch based on real usage.
**What to write:** "Maintain the reasoning prompt as a versioned file; any trial flagged by a user as low-quality (via a lightweight feedback control) is logged with its NCT ID and added to a review queue checked weekly against the benchmark set (6.2) before prompt revisions ship."

**Section 8: Responsible AI Risks & Mitigation**

| Status | Item | Notes |
|---|---|---|
| Blocker | 8.1 Risks across all 4 pillars | Transparency and Reliability are strong; Accountability and Fairness are absent. |
| Blocker | 8.2 Human-in-the-loop / fallback | Only a technical retry-then-error fallback exists; no human review step for content correctness. |
| Pass | 8.3 Sensitive use cases + mitigation | The investment/medical-advice disclaimer requirement names a real sensitive use case with a concrete mitigation. |
| Blocker | 8.4 Bias, hallucination, safe failure | Hallucination and safe failure modes are both well covered; bias is never mentioned. |

**8.1 Risks across all 4 pillars**
**What's missing:** No statement of who is accountable if a hypothesis is wrong and misleads a decision (Accountability), and no consideration of whether the model's reasoning could systematically favor or disfavor certain sponsor types, phases, or disease areas due to uneven data coverage (Fairness).
**What to write:** Accountability: "The tool is explicitly advisory-only (enforced via the persistent disclaimer); there is no human sign-off per analysis, so users are the accountable party for any decision made using the output — this trade-off is accepted given the free, stateless nature of the product." Fairness: "Because reasoning quality depends on data completeness, trials from smaller/academic sponsors (which report less complete data) may receive systematically lower-confidence or thinner analyses than large industry sponsors — this should be monitored via the benchmark set stratified by sponsor class."

**8.2 Human-in-the-loop / fallback paths**
**What's missing:** The Reliability NFR's retry-then-error-state logic handles technical failures, not content-correctness failures — there's no human review anywhere in the pipeline.
**What to write:** State this as a deliberate, disclosed trade-off rather than an oversight: "No human-in-the-loop review occurs per analysis given the stateless, high-volume design; correctness relies entirely on the schema-enforced labeling contract. This is disclosed to users via the Guardrail block and persistent disclaimer, which serve as the fallback for cases where the model's confidence is misplaced."

**8.4 Bias, hallucination, safe failure modes**
**What's missing:** Bias specifically (as distinct from hallucination) is never addressed — e.g., could the model over-attribute failures to "business decision" for well-funded sponsors and to "recruitment" for smaller ones based on training-data patterns rather than the actual evidence?
**What to write:** "Bias risk: the model may pattern-match failure causes to sponsor size/reputation rather than the specific evidence provided. Mitigation: the prompt requires every hypothesis to cite specific evidence from *this* trial's record, and the benchmark set (6.2) should be checked periodically for systematic skew by sponsor class or phase."

**Section 9: Pricing & Cost Structure**

| Status | Item | Notes |
|---|---|---|
| Blocker | 9.1 Cost/accuracy tradeoffs | No infrastructure or model choice is discussed in terms of a cost-vs-accuracy tradeoff. |
| Blocker | 9.2 Development costs (infra + manpower) | "$0, solo build" with no manpower time estimate; infra given only as a vague range. |
| Pass | 9.3 Operational costs listed | Hosting (Vercel) and LLM API usage are both named as recurring costs. |
| Blocker | 9.4 Market size (TAM, SAM) | Only a rough, unsourced user-count estimate — no TAM/SAM figures. |
| Blocker | 9.5 Revenue scenarios | None provided; monetization fully deferred. |
| Pass | 9.6 Pricing model selected with rationale | "Free at launch" is a stated primary model with an explicit reason (portfolio/demo positioning, deferred monetization). |
| Blocker | 9.7 Directional pricing | No price point named, including for the hypothetical future paid tier. |

**9.1 Cost/accuracy tradeoffs**
**What's missing:** No discussion of, e.g., a cheaper/faster model reducing cost but risking lower hypothesis quality, or a larger context window costing more but enabling richer PubMed enrichment.
**What to write:** "Trade-off: using a single, larger-context model call per analysis costs more per run than a cheaper model but avoids the accuracy loss of truncating trial/publication data — accepted given the low expected volume (hundreds/day) at MVP scale."

**9.2 Development costs**
**What's missing:** Only infra is estimated ("low tens of dollars/month"); no manpower/time cost is given even directionally.
**What to write:** "Manpower: ~1 FTE-equivalent solo effort across 8 weeks (no cash cost, opportunity cost only). Infra: ~$20–50/month at MVP traffic (Vercel hobby tier + LLM API usage), scaling roughly linearly with analysis volume."

**9.4 Market size (TAM, SAM)**
**What's missing:** "Tens of thousands of biotech-focused analysts... globally" has no source or calculation shown.
**What to write:** Even a rough, sourced estimate is better than an assertion, e.g., "TAM: ~50,000 biotech equity analysts, CI professionals, and academic/regulatory researchers globally (estimate based on [BIO/industry association membership or LinkedIn role-title search]). SAM: ~5,000 English-language users actively tracking trial terminations for investment or competitive-intelligence purposes."

**9.5 Revenue scenarios**
**What's missing:** Section 2.3 mentions a "plausible future path" for a paid batch tier but models nothing.
**What to write:** Even directional scenarios help: "Conservative: 50 paying CI teams at $99/month = ~$59K ARR. Target: 200 paying teams at $99/month = ~$238K ARR. Both explicitly deferred pending MVP validation of hypothesis-quality demand."

**9.7 Directional pricing**
**What's missing:** No price point is named anywhere in the document.
**What to write:** "Directional: a future batch/pipeline-report tier priced around $99–199/month per seat, positioned well below enterprise platforms like Citeline (which run into five figures annually)."

---

#### Verdict

**Needs a conversation** — the document is a strong, well-reasoned *general* PRD (problem framing, scope discipline, and the fact/inference/hypothesis credibility mechanism are genuinely above-average), but as a **Full AI PRD** it's missing five structural areas that need real decisions before engineering should treat this as final: **model selection (5.1–5.2)**, **an evaluation plan for reasoning quality (6.1–6.4, 6.6)**, **a prompt strategy (7.3, 7.5)**, **Accountability/Fairness/bias coverage in Responsible AI (8.1, 8.2, 8.4)**, and **cost/market sizing (9.1, 9.2, 9.4, 9.5, 9.7)**.

These aren't polish items — without a chosen model and a way to measure whether hypotheses are actually *good* (not just schema-valid), "Week 5: Reasoning engine complete" has no real acceptance test beyond "didn't crash." Priority order to resolve before build:
1. **Pick and justify the model (5.1–5.2)** — this is a blocking input to everything else and was left as an open question.
2. **Define the evaluation plan (6.1–6.4)** — build the benchmark set of 30–50 trials with known outcomes *before* Week 5, so "reasoning engine complete" has a real bar.
3. **Close the Fairness/Accountability gap in Responsible AI (8.1)** — decide and disclose the accountability trade-off (no human review, disclaimer-only) explicitly rather than leaving it implicit.
4. **Name the moat (1.5)** — a one-paragraph honest answer here materially changes how defensible the "why now" story is.

Cost/market sizing (Section 9) matters less for an unfunded portfolio build and can reasonably wait, but should still get a paragraph before this is shared outside a personal portfolio context.
