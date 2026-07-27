import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { NCT_ID_PATTERN } from "@/lib/schema/nctId";
import { getSupabase } from "@/lib/supabase";

const FeedbackPayloadSchema = z.object({
  nctId: z.string().regex(NCT_ID_PATTERN),
  note: z.string().max(1000).optional(),
});

// POST /api/feedback — engineering-doc.md Flow 4.7. Gracefully no-ops
// (still returns 201) if Supabase isn't configured yet, so the frontend
// control never breaks even before storage is wired up.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = FeedbackPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Feedback received but Supabase is not configured:", parsed.data);
    return NextResponse.json({ id: null, flagged_at: new Date().toISOString(), stored: false });
  }

  const { data, error } = await supabase
    .from("feedback_flags")
    .insert({ nct_id: parsed.data.nctId, note: parsed.data.note ?? null })
    .select("id, flagged_at")
    .single();

  if (error) {
    console.error("Failed to write feedback_flags:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, flagged_at: data.flagged_at, stored: true }, { status: 201 });
}
