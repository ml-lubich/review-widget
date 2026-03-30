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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const format = url.searchParams.get("format");

  const supabase = createAdminClient();

  const { data: widget, error: widgetError } = await supabase
    .from("widgets")
    .select("*")
    .eq("id", id)
    .single();

  if (widgetError || !widget) {
    if (format === "json") {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    return new Response(
      `<!DOCTYPE html><html><body style="margin:0;font-family:system-ui,sans-serif;color:#888;font-size:14px;display:flex;align-items:center;justify-content:center;min-height:100vh;background:transparent;"><p>Widget not found</p></body></html>`,
      { status: 404, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("widget_id", id)
    .order("created_at", { ascending: false });

  const safeReviews = (reviews || []).map((r) => ({
    id: r.id,
    author_name: r.author_name,
    rating: r.rating,
    body: r.body,
    created_at: r.created_at,
  }));

  const safeWidget = {
    id: widget.id,
    business_name: widget.business_name,
    style: widget.style,
    primary_color: widget.primary_color,
    background_color: widget.background_color,
    text_color: widget.text_color,
  };

  // JSON mode for embed.js script
  if (format === "json") {
    return NextResponse.json(
      { widget: safeWidget, reviews: safeReviews },
      { headers: corsHeaders }
    );
  }

  // Default: return self-contained HTML for iframe embed
  const html = renderWidgetHTML(safeWidget, safeReviews);
  return new Response(html, {
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
}

interface WidgetData {
  id: string;
  business_name: string;
  style: string;
  primary_color: string;
  background_color: string;
  text_color: string;
}

interface ReviewData {
  id: string;
  author_name: string;
  rating: number;
  body: string | null;
  created_at: string;
}

function escapeHtml(str: string | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function starsHtml(rating: number, color: string): string {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<svg width="16" height="16" viewBox="0 0 24 24" fill="${i <= rating ? color : "none"}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:${i <= rating ? "1" : "0.3"}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }
  return `<span style="display:inline-flex;gap:2px;">${html}</span>`;
}

function avatarHtml(name: string, primaryColor: string, bgColor: string): string {
  return `<span style="width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;background:${primaryColor};color:${bgColor}">${escapeHtml(name.charAt(0))}</span>`;
}

function renderCard(w: WidgetData, reviews: ReviewData[]): string {
  if (!reviews.length) return `<p style="color:${w.text_color};opacity:0.6;font-size:14px;">No reviews yet</p>`;
  const r = reviews[0];
  return `<div style="background:${w.background_color};color:${w.text_color};border-radius:12px;padding:24px;max-width:400px;font-family:system-ui,-apple-system,sans-serif;">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${w.primary_color}" stroke-width="2" style="opacity:0.3;margin-bottom:12px;"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
    ${starsHtml(r.rating, w.primary_color)}
    <p style="margin:12px 0 0;font-size:14px;line-height:1.6;opacity:0.9;">${escapeHtml(r.body)}</p>
    <div style="margin-top:16px;display:flex;align-items:center;gap:12px;">
      ${avatarHtml(r.author_name, w.primary_color, w.background_color)}
      <div><p style="font-size:14px;font-weight:600;margin:0;">${escapeHtml(r.author_name)}</p>
      <p style="font-size:12px;opacity:0.6;margin:2px 0 0;">Verified Review</p></div>
    </div></div>`;
}

function renderBadge(w: WidgetData, reviews: ReviewData[]): string {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);
  return `<div style="display:inline-flex;align-items:center;gap:16px;background:${w.background_color};color:${w.text_color};border:1px solid ${w.primary_color}33;border-radius:12px;padding:16px 24px;font-family:system-ui,-apple-system,sans-serif;">
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="display:flex;align-items:center;gap:6px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="${w.primary_color}" stroke="${w.primary_color}" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span style="font-size:28px;font-weight:700;">${avg.toFixed(1)}</span>
      </div>
      ${starsHtml(Math.round(avg), w.primary_color)}
    </div>
    <div style="border-left:1px solid ${w.text_color}20;padding-left:16px;height:48px;display:flex;flex-direction:column;justify-content:center;">
      <p style="font-size:14px;font-weight:600;margin:0;">${escapeHtml(w.business_name)}</p>
      <p style="font-size:12px;opacity:0.6;margin:2px 0 0;">Based on ${reviews.length} review${reviews.length !== 1 ? "s" : ""}</p>
    </div></div>`;
}

function renderCarousel(w: WidgetData, reviews: ReviewData[]): string {
  if (!reviews.length) return `<p style="color:${w.text_color};opacity:0.6;font-size:14px;">No reviews yet</p>`;
  const reviewsJson = JSON.stringify(reviews.map(r => ({
    author_name: r.author_name,
    rating: r.rating,
    body: r.body || "",
  })));

  return `<div style="background:${w.background_color};color:${w.text_color};border-radius:12px;padding:24px;max-width:480px;font-family:system-ui,-apple-system,sans-serif;">
    <div id="carousel-content"></div>
    <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:12px;">
      <button id="prev-btn" style="background:none;border:none;color:${w.text_color};cursor:pointer;padding:6px;border-radius:50%;opacity:0.7;">&#9664;</button>
      <span id="counter" style="font-size:12px;opacity:0.6;"></span>
      <button id="next-btn" style="background:none;border:none;color:${w.text_color};cursor:pointer;padding:6px;border-radius:50%;opacity:0.7;">&#9654;</button>
    </div>
  </div>
  <script>
  (function(){
    var reviews=${reviewsJson};
    var primary="${w.primary_color}",bg="${w.background_color}",txt="${w.text_color}";
    var current=0;
    function stars(r){var h="";for(var i=1;i<=5;i++)h+='<svg width="16" height="16" viewBox="0 0 24 24" fill="'+(i<=r?primary:"none")+'" stroke="'+primary+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:'+(i<=r?"1":"0.3")+'"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';return'<span style="display:inline-flex;gap:2px;">'+h+"</span>";}
    function avatar(n){return'<span style="width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;background:'+primary+';color:'+bg+'">'+n.charAt(0)+"</span>";}
    function show(i){var r=reviews[i];document.getElementById("carousel-content").innerHTML=stars(r.rating)+'<p style="margin:12px 0 0;font-size:14px;line-height:1.6;opacity:0.9;min-height:60px;">'+r.body+"</p>"+'<div style="margin-top:12px;display:flex;align-items:center;gap:10px;">'+avatar(r.author_name)+"<div>"+'<p style="font-size:14px;font-weight:600;margin:0;">'+r.author_name+"</p>"+'<p style="font-size:12px;opacity:0.6;margin:2px 0 0;">Verified Review</p></div></div>';document.getElementById("counter").textContent=(i+1)+"/"+reviews.length;}
    document.getElementById("prev-btn").onclick=function(){current=(current-1+reviews.length)%reviews.length;show(current);};
    document.getElementById("next-btn").onclick=function(){current=(current+1)%reviews.length;show(current);};
    show(0);
    setInterval(function(){current=(current+1)%reviews.length;show(current);},5000);
  })();
  </script>`;
}

function renderGrid(w: WidgetData, reviews: ReviewData[]): string {
  if (!reviews.length) return `<p style="color:${w.text_color};opacity:0.6;font-size:14px;">No reviews yet</p>`;
  let cards = "";
  for (const r of reviews) {
    cards += `<div style="background:${w.background_color};color:${w.text_color};border:1px solid ${w.primary_color}15;border-radius:12px;padding:20px;">
      ${starsHtml(r.rating, w.primary_color)}
      <p style="margin:10px 0 0;font-size:14px;line-height:1.6;opacity:0.9;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(r.body)}</p>
      <div style="margin-top:12px;display:flex;align-items:center;gap:8px;">
        ${avatarHtml(r.author_name, w.primary_color, w.background_color)}
        <span style="font-size:13px;font-weight:500;">${escapeHtml(r.author_name)}</span>
      </div></div>`;
  }
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;font-family:system-ui,-apple-system,sans-serif;">${cards}</div>`;
}

function renderWidgetBody(w: WidgetData, reviews: ReviewData[]): string {
  switch (w.style) {
    case "badge":
      return renderBadge(w, reviews);
    case "carousel":
      return renderCarousel(w, reviews);
    case "grid":
      return renderGrid(w, reviews);
    case "card":
    default:
      return renderCard(w, reviews);
  }
}

function renderWidgetHTML(widget: WidgetData, reviews: ReviewData[]): string {
  const body = renderWidgetBody(widget, reviews);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;box-sizing:border-box;}body{background:transparent;display:flex;align-items:flex-start;justify-content:center;padding:8px;font-family:system-ui,-apple-system,sans-serif;}</style>
</head>
<body>${body}</body>
</html>`;
}
