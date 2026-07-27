import type { CtGovReference } from "./ctgov";

// NCBI E-utilities client. ClinicalTrials.gov records already embed the
// linked PMIDs (referencesModule) — this client's job is only to resolve
// those PMIDs to actual abstract text via efetch. Registering NCBI_API_KEY
// raises the rate limit from 3 req/s to 10 req/s (PRD.md Section 8).

const EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const MAX_PUBLICATIONS = 3; // token-budget cap, per engineering-doc.md Section 8

export interface PubMedAbstract {
  pmid: string;
  title: string;
  journal: string | null;
  year: string | null;
  abstract: string | null;
}

export class PubMedUpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PubMedUpstreamError";
  }
}

function apiKeyParam(): string {
  return process.env.NCBI_API_KEY ? `&api_key=${process.env.NCBI_API_KEY}` : "";
}

// referencesModule mixes DERIVED (auto-linked by PubMed to this NCT ID —
// most reliable), RESULT, and BACKGROUND (author-submitted, often just
// methodology citations, not about this trial's own outcome) reference
// types. Prefer DERIVED/RESULT; only fall back to BACKGROUND if nothing
// else is linked.
function selectRelevantReferences(references: CtGovReference[]): CtGovReference[] {
  const preferred = references.filter((r) => r.type === "DERIVED" || r.type === "RESULT");
  const pool = preferred.length > 0 ? preferred : references;
  return pool.slice(0, MAX_PUBLICATIONS);
}

function extractTag(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].replace(/<[^>]+>/g, "").trim() : null;
}

function stripHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseArticle(articleXml: string): PubMedAbstract | null {
  const pmid = extractTag(articleXml, "PMID");
  if (!pmid) return null;

  const title = extractTag(articleXml, "ArticleTitle");
  const journal = extractTag(articleXml, "ISOAbbreviation") ?? extractTag(articleXml, "Title");
  const year = articleXml.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/)?.[1] ?? null;

  const abstractParts = [...articleXml.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)].map((m) =>
    stripHtml(m[1].replace(/<[^>]+>/g, "").trim())
  );
  const abstract = abstractParts.length > 0 ? abstractParts.join(" ") : null;

  return {
    pmid,
    title: title ? stripHtml(title) : "Untitled",
    journal,
    year,
    abstract,
  };
}

async function efetch(pmids: string[]): Promise<PubMedAbstract[]> {
  const url = `${EUTILS_BASE}/efetch.fcgi?db=pubmed&id=${pmids.join(",")}&rettype=abstract&retmode=xml${apiKeyParam()}`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    // PubMed enrichment degrades gracefully rather than failing the whole
    // analysis, per engineering-doc.md Flow 4.5.
    return [];
  }
  if (!res.ok) return [];

  const xml = await res.text();
  const articles = [...xml.matchAll(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g)].map((m) => m[0]);
  return articles.map(parseArticle).filter((a): a is PubMedAbstract => a !== null);
}

export async function resolvePublications(
  references: CtGovReference[]
): Promise<PubMedAbstract[]> {
  const selected = selectRelevantReferences(references);
  if (selected.length === 0) return [];

  try {
    return await efetch(selected.map((r) => r.pmid));
  } catch {
    return []; // graceful degradation — never fail the analysis over PubMed
  }
}
