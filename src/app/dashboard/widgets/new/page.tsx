"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { WIDGET_STYLES, DEFAULT_COLORS, SAMPLE_REVIEWS } from "@/lib/constants";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetStyle } from "@/lib/types";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function NewWidgetPage() {
  const [businessName, setBusinessName] = useState("");
  const [style, setStyle] = useState<WidgetStyle>("card");
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_COLORS.primary);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_COLORS.background);
  const [textColor, setTextColor] = useState(DEFAULT_COLORS.text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("widgets")
      .insert({
        user_id: user.id,
        business_name: businessName,
        style,
        primary_color: primaryColor,
        background_color: backgroundColor,
        text_color: textColor,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push(`/dashboard/widgets/${data.id}`);
    }
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-1">Create Widget</h1>
      <p className="text-muted text-sm mb-8">
        Configure your review widget and preview it in real-time
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Builder Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Your Business Name"
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
                <label className="block text-xs text-muted mb-1.5">
                  Accent Color
                </label>
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
                <label className="block text-xs text-muted mb-1.5">
                  Background
                </label>
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
                <label className="block text-xs text-muted mb-1.5">
                  Text Color
                </label>
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
            disabled={loading || !businessName}
            className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Widget"}
          </button>
        </form>

        {/* Live Preview */}
        <div>
          <label className="block text-sm font-medium mb-3">Live Preview</label>
          <div className="bg-surface-light border border-surface-border rounded-xl p-6 flex items-center justify-center min-h-[300px]">
            <WidgetRenderer
              style={style}
              reviews={SAMPLE_REVIEWS}
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
