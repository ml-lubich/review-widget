"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { Review } from "@/lib/types";
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react";
import Link from "next/link";

export default function ReviewsPage() {
  const params = useParams();
  const widgetId = params.id as string;
  const supabase = createClient();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: w } = await supabase
        .from("widgets")
        .select("business_name")
        .eq("id", widgetId)
        .single();

      if (w) setBusinessName(w.business_name);

      const { data: r } = await supabase
        .from("reviews")
        .select("*")
        .eq("widget_id", widgetId)
        .order("created_at", { ascending: false });

      setReviews(r || []);
      setLoading(false);
    }
    load();
  }, [widgetId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        widget_id: widgetId,
        author_name: authorName,
        rating,
        body: body || null,
      })
      .select()
      .single();

    if (!error && data) {
      setReviews([data, ...reviews]);
      setAuthorName("");
      setRating(5);
      setBody("");
      setShowForm(false);
    }
    setSaving(false);
  }

  async function handleDelete(reviewId: string) {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", reviewId);
    setReviews(reviews.filter((r) => r.id !== reviewId));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/dashboard/widgets/${widgetId}`}
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to widget
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-muted text-sm mt-1">
            {businessName} &middot; {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {/* Add Review Form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-surface border border-surface-border rounded-xl p-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                placeholder="John D."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Rating</label>
              <div className="flex gap-1 py-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i <= rating
                          ? "text-gold-500 fill-gold-500"
                          : "text-surface-border"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Review Text
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors resize-none"
              rows={3}
              placeholder="Write the review text..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 bg-surface-light hover:bg-surface-border rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-surface border border-surface-border rounded-xl p-12 text-center">
          <Star className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No reviews yet</h2>
          <p className="text-muted text-sm">
            Add reviews that will be displayed in your widget
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface border border-surface-border rounded-xl p-5 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-sm">
                    {review.author_name}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= review.rating
                            ? "text-gold-500 fill-gold-500"
                            : "text-surface-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.body && (
                  <p className="text-sm text-muted">{review.body}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="p-1.5 text-muted hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors ml-4"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
