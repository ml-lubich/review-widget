"use client";

import { useState } from "react";
import { Review } from "@/lib/types";
import { Stars } from "./Stars";
import { Star, X, ChevronLeft, ChevronRight } from "lucide-react";

export function FloatingBadge({
  reviews,
  primaryColor = "#f59e0b",
  backgroundColor = "#1a1a1a",
  textColor = "#ffffff",
  businessName = "Our Business",
}: {
  reviews: Review[];
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  businessName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(0);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const review = reviews[current];

  return (
    <div className="relative">
      {/* Collapsed Badge */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-3 rounded-full px-5 py-3 shadow-lg cursor-pointer transition-transform hover:scale-105 border"
          style={{
            backgroundColor,
            color: textColor,
            borderColor: `${primaryColor}33`,
          }}
        >
          <Star
            className="w-5 h-5 fill-current"
            style={{ color: primaryColor }}
          />
          <span className="font-bold text-lg">{avgRating.toFixed(1)}</span>
          <span className="text-xs opacity-60">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
        </button>
      )}

      {/* Expanded Card */}
      {expanded && review && (
        <div
          className="rounded-xl shadow-2xl w-80 overflow-hidden border"
          style={{
            backgroundColor,
            color: textColor,
            borderColor: `${primaryColor}33`,
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${primaryColor}22` }}>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" style={{ color: primaryColor }} />
              <span className="font-bold text-sm">{businessName}</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={14} style={{ opacity: 0.6 }} />
            </button>
          </div>
          <div className="p-4">
            <Stars rating={review.rating} color={primaryColor} />
            <p className="mt-2 text-sm leading-relaxed opacity-90 min-h-[48px]">
              {review.body}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: primaryColor, color: backgroundColor }}
                >
                  {review.author_name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{review.author_name}</span>
              </div>
              {reviews.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrent((c) => (c - 1 + reviews.length) % reviews.length)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs opacity-50 tabular-nums">
                    {current + 1}/{reviews.length}
                  </span>
                  <button
                    onClick={() => setCurrent((c) => (c + 1) % reviews.length)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            className="px-4 py-2 text-center border-t"
            style={{ borderColor: `${primaryColor}22` }}
          >
            <span className="text-xs opacity-40">
              {avgRating.toFixed(1)} avg from {reviews.length} reviews
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
