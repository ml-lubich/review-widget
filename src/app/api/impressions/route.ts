import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { widgetId } = await request.json();

    if (!widgetId || typeof widgetId !== "string") {
      return NextResponse.json(
        { error: "widgetId is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createAdminClient();
    await supabase.from("impressions").insert({ widget_id: widgetId });

    return NextResponse.json({ ok: true }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400, headers: corsHeaders }
    );
  }
}
