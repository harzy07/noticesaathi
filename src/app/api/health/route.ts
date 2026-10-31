import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/db/client";

export async function GET() {
  let dbConnected = false;

  try {
    const supabase = getSupabaseAdminClient();
    // Trivial query against notices or kb_docs table to verify DB connectivity
    const { error } = await supabase.from("notices").select("id").limit(1);
    if (!error) {
      dbConnected = true;
    } else {
      console.warn("Database health check query returned error:", error.message);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Database health check encountered exception:", message);
    dbConnected = false;
  }

  return NextResponse.json({
    ok: true,
    db: dbConnected,
  });
}
