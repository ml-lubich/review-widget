"use client";

import { Review } from "@/lib/types";
import { Stars } from "./Stars";
import { Quote } from "lucide-react";

export function TestimonialCard({
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
  if (reviews.length === 0) return null;
  const review = reviews[0];

  return (
    <div
      className="rounded-xl p-6 max-w-md w-full"
      style={{ backgroundColor, color: textColor }}
    >
      <Quote className="w-8 h-8 mb-3 opacity-30" style={{ color: primaryColor }} />
      <Stars rating={review.rating} color={primaryColor} />
      <p className="mt-3 text-sm leading-relaxed opacity-90">{review.body}</p>
      <div className="mt-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: primaryColor, color: backgroundColor }}
        >
          {review.author_name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{review.author_name}</p>
          <p className="text-xs opacity-60">Verified Review</p>
        </div>
      </div>
    </div>
  );
}
