import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: widget, error: widgetError } = await supabase
    .from("widgets")
    .select("*")
    .eq("id", id)
    .single();

  if (widgetError || !widget) {
    return NextResponse.json(
      { error: "Widget not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("widget_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json(
    {
      widget: {
        id: widget.id,
        business_name: widget.business_name,
        style: widget.style,
        primary_color: widget.primary_color,
        background_color: widget.background_color,
        text_color: widget.text_color,
      },
      reviews: (reviews || []).map((r) => ({
        id: r.id,
        author_name: r.author_name,
        rating: r.rating,
        body: r.body,
        created_at: r.created_at,
      })),
    },
    { headers: corsHeaders }
  );
}
