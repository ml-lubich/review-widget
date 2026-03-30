"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { WIDGET_STYLES, DEFAULT_COLORS, SAMPLE_REVIEWS } from "@/lib/constants";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { Widget, WidgetStyle, Review } from "@/lib/types";
import { ArrowLeft, Check, Copy, Code } from "lucide-react";
import Link from "next/link";

export default function EditWidgetPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const widgetId = params.id as string;

  const [widget, setWidget] = useState<Widget | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [style, setStyle] = useState<WidgetStyle>("card");
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_COLORS.primary);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_COLORS.background);
  const [textColor, setTextColor] = useState(DEFAULT_COLORS.text);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: w } = await supabase
        .from("widgets")
        .select("*")
        .eq("id", widgetId)
        .single();

      if (w) {
        setWidget(w);
        setBusinessName(w.business_name);
        setStyle(w.style as WidgetStyle);
        setPrimaryColor(w.primary_color);
        setBackgroundColor(w.background_color);
        setTextColor(w.text_color);
      }

      const { data: r } = await supabase
        .from("reviews")
        .select("*")
        .eq("widget_id", widgetId)
        .order("created_at", { ascending: false });

      setReviews((r as Review[]) || []);
      setLoading(false);
    }
    load();
  }, [widgetId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("widgets")
      .update({
        business_name: businessName,
        style,
        primary_color: primaryColor,
        background_color: backgroundColor,
        text_color: textColor,
        updated_at: new Date().toISOString(),
      })
      .eq("id", widgetId);

    if (updateError) {
      setError(updateError.message);
    }
    setSaving(false);
  }

  function getEmbedCode() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
    return `<iframe src="${origin}/api/widget/${widgetId}" style="border:none;width:100%;min-height:300px;" loading="lazy"></iframe>`;
  }

  function copyEmbed() {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!widget) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Widget not found</p>
        <Link href="/dashboard" className="text-gold-500 text-sm mt-2 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const previewReviews = reviews.length > 0 ? reviews : SAMPLE_REVIEWS;

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Edit Widget</h1>
          <p className="text-muted text-sm mt-1">{widget.business_name}</p>
        </div>
        <Link
          href={`/dashboard/widgets/${widgetId}/reviews`}
          className="px-4 py-2 text-sm bg-surface-light hover:bg-surface-border rounded-lg transition-colors"
        >
          Manage Reviews
        </Link>
      </div>

      {/* Embed Code */}
      <div className="bg-surface border border-gold-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-5 h-5 text-gold-500" />
          <h2 className="font-semibold">Embed Code</h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Copy this code and paste it into your website where you want the widget to appear.
        </p>
        <div className="relative">
          <pre className="bg-background rounded-lg p-4 text-sm font-mono text-gold-400 overflow-x-auto">
            {getEmbedCode()}
          </pre>
          <button
            onClick={copyEmbed}
            className="absolute top-3 right-3 px-3 py-1.5 bg-surface-light hover:bg-surface-border rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Widget Style</label>
            <div className="grid grid-cols-2 gap-3">
              {WIDGET_STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStyle(s.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    style === s.value
                      ? "border-gold-500 bg-gold-500/10"
                      : "border-surface-border bg-surface hover:border-surface-light"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{s.label}</span>
                    {style === s.value && (
                      <Check className="w-4 h-4 text-gold-500" />
                    )}
                  </div>
                  <span className="text-xs text-muted">{s.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Colors</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-surface-border cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-surface border border-surface-border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-surface-border cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-surface border border-surface-border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Text</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-surface-border cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-surface border border-surface-border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Live Preview */}
        <div>
          <label className="block text-sm font-medium mb-3">Live Preview</label>
          <div className="bg-surface-light border border-surface-border rounded-xl p-6 flex items-center justify-center min-h-[300px]">
            <WidgetRenderer
              style={style}
              reviews={previewReviews}
              primaryColor={primaryColor}
              backgroundColor={backgroundColor}
              textColor={textColor}
              businessName={businessName || "Your Business"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
