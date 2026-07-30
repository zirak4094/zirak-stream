import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const checkedAt = new Date().toISOString();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("languages").select("code").limit(1);

    if (error) {
      return NextResponse.json(
        { status: "degraded", database: "error", message: error.message, checkedAt },
        { status: 503 },
      );
    }

    return NextResponse.json({ status: "ok", database: "connected", checkedAt });
  } catch (err) {
    return NextResponse.json(
      {
        status: "down",
        database: "unreachable",
        message: err instanceof Error ? err.message : "unknown error",
        checkedAt,
      },
      { status: 503 },
    );
  }
}
