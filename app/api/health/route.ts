import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  let supabaseStatus: "ok" | "not_configured" | "error" = "not_configured";

  if (supabase) {
    const { error } = await supabase.from("feedback_flags").select("id").limit(1);
    supabaseStatus = error ? "error" : "ok";
  }

  const anthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  const ok = anthropicConfigured && supabaseStatus !== "error";
  return NextResponse.json(
    { status: ok ? "ok" : "degraded", anthropic: anthropicConfigured ? "ok" : "not_configured", supabase: supabaseStatus },
    { status: ok ? 200 : 503 }
  );
}
