-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- to create the tables docs/engineering/engineering-doc.md Section 7
-- describes. There is no `users` table anywhere here — this app has no
-- accounts, by design (PRD.md Non-Goals).

create extension if not exists pgcrypto;

-- Ephemeral evidence-packet cache, replacing the Redis design in
-- engineering-doc.md with a Postgres table (the project's Supabase-only
-- decision). Caches the fetch/enrichment layer only, never the LLM
-- output — see lib/cache.ts.
create table if not exists evidence_cache (
  nct_id text primary key,
  packet jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- The ground-truth evaluation set (PRD.md "AI Quality Bar").
create table if not exists benchmark_trials (
  nct_id text primary key,
  documented_true_reason text not null,
  true_reason_category text not null,
  source_url text not null,
  sponsor_class text,
  added_at timestamptz not null default now(),
  notes text
);

-- One row per benchmark run per prompt version — the durable version of
-- the PRD's "eval spreadsheet."
create table if not exists eval_runs (
  id uuid primary key default gen_random_uuid(),
  nct_id text not null references benchmark_trials(nct_id),
  run_at timestamptz not null default now(),
  prompt_version text not null,
  top_hypothesis_category text not null,
  matched_true_reason boolean not null,
  reviewer_plausibility_score smallint check (reviewer_plausibility_score between 1 and 5),
  notes text
);
create index if not exists eval_runs_nct_id_run_at_idx on eval_runs (nct_id, run_at);

-- The maintainer's weekly review queue (engineering-doc.md Flow 4.7).
create table if not exists feedback_flags (
  id uuid primary key default gen_random_uuid(),
  nct_id text not null,
  note text,
  flagged_at timestamptz not null default now(),
  reviewed boolean not null default false,
  reviewed_at timestamptz
);
create index if not exists feedback_flags_reviewed_flagged_at_idx on feedback_flags (reviewed, flagged_at);

-- Backs lib/rateLimit.ts. Inert while RATE_LIMIT_ENABLED is unset/false
-- (the default) — see PRD.md Open Questions for why this ships disabled.
create table if not exists rate_limit_events (
  id bigint generated always as identity primary key,
  ip text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_limit_events_ip_created_at_idx on rate_limit_events (ip, created_at);

-- This app's API routes use the service role key server-side only and
-- never expose these tables to the browser, so RLS is enabled with no
-- public policies (default-deny) rather than left open.
alter table evidence_cache enable row level security;
alter table benchmark_trials enable row level security;
alter table eval_runs enable row level security;
alter table feedback_flags enable row level security;
alter table rate_limit_events enable row level security;
