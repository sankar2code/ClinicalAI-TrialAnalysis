import { NextRequest, NextResponse } from "next/server";
import { NctIdSchema } from "@/lib/schema/nctId";
import { analyzeTrial } from "@/lib/pipeline/analyzeTrial";
import { toErrorResponse } from "@/lib/errors";
import { isRateLimited } from "@/lib/rateLimit";

// GET /api/analyze/[nctId] — see docs/engineering/engineering-doc.md
// Section 9 for the full response contract. `params` is a Promise as of
// Next.js 15+ (this app is on 16) — must be awaited before use.
export async function GET(req: NextRequest, { params }: { params: Promise<{ nctId: string }> }) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { nctId } = await params;
  const parsed = NctIdSchema.safeParse(nctId);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }

  try {
    const result = await analyzeTrial(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
