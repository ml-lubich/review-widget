import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Eye, Calendar, Palette } from "lucide-react";
import { Widget } from "@/lib/types";
import { DeleteWidgetButton } from "./DeleteWidgetButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: widgets } = await supabase
    .from("widgets")
    .select("*")
    .order("created_at", { ascending: false });

  // Get impression counts for each widget
  const widgetIds = (widgets || []).map((w: Widget) => w.id);
  const impressionCounts: Record<string, number> = {};

  if (widgetIds.length > 0) {
    for (const id of widgetIds) {
      const { count } = await supabase
        .from("impressions")
        .select("*", { count: "exact", head: true })
        .eq("widget_id", id);
      impressionCounts[id] = count || 0;
    }
  }

  const styleLabels: Record<string, string> = {
    card: "Testimonial Card",
    carousel: "Review Carousel",
    grid: "Review Wall",
    badge: "Star Badge",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Widgets</h1>
          <p className="text-muted text-sm mt-1">
            Manage your review widgets and track impressions
          </p>
        </div>
        <Link
          href="/dashboard/widgets/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Widget
        </Link>
      </div>

      {!widgets || widgets.length === 0 ? (
        <div className="bg-surface border border-surface-border rounded-xl p-12 text-center">
          <Palette className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No widgets yet</h2>
          <p className="text-muted text-sm mb-6">
            Create your first review widget to start showing reviews on your website
          </p>
          <Link
            href="/dashboard/widgets/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Widget
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {widgets.map((widget: Widget) => (
            <div
              key={widget.id}
              className="bg-surface border border-surface-border rounded-xl p-6 flex items-center justify-between hover:border-gold-500/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: widget.primary_color + "22" }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: widget.primary_color }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{widget.business_name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      {styleLabels[widget.style] || widget.style}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {impressionCounts[widget.id] || 0} impressions
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(widget.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/widgets/${widget.id}`}
                  className="px-3 py-1.5 text-sm bg-surface-light hover:bg-surface-border rounded-lg transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/dashboard/widgets/${widget.id}/reviews`}
                  className="px-3 py-1.5 text-sm bg-surface-light hover:bg-surface-border rounded-lg transition-colors"
                >
                  Reviews
                </Link>
                <DeleteWidgetButton widgetId={widget.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
