"use client";

import { useState, useEffect, useCallback } from "react";
import { Review } from "@/lib/types";
import { Stars } from "./Stars";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export function ReviewCarousel({
  reviews,
  primaryColor = "#f59e0b",
  backgroundColor = "#1a1a1a",
  textColor = "#ffffff",
}: {
  reviews: Review[];
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
}) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % reviews.length);
  }, [reviews.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, reviews.length]);

  if (reviews.length === 0) return null;
  const review = reviews[current];

  return (
    <div
      className="rounded-xl p-6 max-w-lg w-full relative"
      style={{ backgroundColor, color: textColor }}
    >
      <Quote className="w-6 h-6 mb-2 opacity-20" style={{ color: primaryColor }} />
      <Stars rating={review.rating} color={primaryColor} />
      <p className="mt-3 text-sm leading-relaxed opacity-90 min-h-[60px]">
        {review.body}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: primaryColor, color: backgroundColor }}
          >
            {review.author_name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm">{review.author_name}</p>
            <p className="text-xs opacity-60">Verified Review</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs opacity-60 tabular-nums">
            {current + 1}/{reviews.length}
          </span>
          <button
            onClick={next}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
