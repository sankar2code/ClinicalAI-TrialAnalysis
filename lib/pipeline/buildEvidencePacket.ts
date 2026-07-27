import type { RawStudyRecord } from "../clients/ctgov";
import type { PubMedAbstract } from "../clients/pubmed";

const ABSTRACT_CHAR_CAP = 1200; // truncate abstracts, never structured trial fields (PRD.md cost/accuracy tradeoff)

export interface EvidencePacket {
  nctId: string;
  title: string;
  overallStatus: string;
  whyStopped: string | null;
  phases: string[];
  enrollment: { count: number | null; type: string | null };
  sponsor: { name: string | null; classType: string | null };
  startDate: string | null;
  completionDate: string | null;
  briefSummary: string | null;
  hasResults: boolean;
  outcomeMeasuresSummary: string | null;
  adverseEventsSummary: string | null;
  publications: { pmid: string; title: string; journal: string | null; year: string | null; abstractExcerpt: string | null; url: string }[];
  ctgovUrl: string;
}

export function buildEvidencePacket(
  study: RawStudyRecord,
  publications: PubMedAbstract[]
): EvidencePacket {
  return {
    nctId: study.nctId,
    title: study.title,
    overallStatus: study.overallStatus,
    whyStopped: study.whyStopped,
    phases: study.phases,
    enrollment: { count: study.enrollmentCount, type: study.enrollmentType },
    sponsor: { name: study.leadSponsorName, classType: study.leadSponsorClass },
    startDate: study.startDate,
    completionDate: study.completionDate,
    briefSummary: study.briefSummary,
    hasResults: study.hasResults,
    outcomeMeasuresSummary: study.outcomeMeasuresSummary,
    adverseEventsSummary: study.adverseEventsSummary,
    publications: publications.map((p) => ({
      pmid: p.pmid,
      title: p.title,
      journal: p.journal,
      year: p.year,
      abstractExcerpt: p.abstract ? p.abstract.slice(0, ABSTRACT_CHAR_CAP) : null,
      url: `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`,
    })),
    ctgovUrl: `https://clinicaltrials.gov/study/${study.nctId}`,
  };
}
