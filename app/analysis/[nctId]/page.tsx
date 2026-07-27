import { NctIdSchema } from "@/lib/schema/nctId";
import AnalysisView from "./components/AnalysisView";

// Deliberately thin: no data fetching here. AnalysisView (client
// component) fetches GET /api/analyze/[nctId] itself so the page can
// render immediately and show real staged progress while the reasoning
// pass is in flight — see AnalysisView.tsx for why this moved off the
// server-blocking pattern used earlier. `params` is a Promise as of
// Next.js 15+ (this app is on 16) — must be awaited before use.
export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ nctId: string }>;
}) {
  const { nctId: rawNctId } = await params;
  const parsedId = NctIdSchema.safeParse(rawNctId);
  const nctId = parsedId.success ? parsedId.data : rawNctId.toUpperCase();

  return <AnalysisView nctId={nctId} />;
}
