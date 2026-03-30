"use client";

import { Review } from "@/lib/types";
import { Stars } from "./Stars";
import { Star } from "lucide-react";

export function StarBadge({
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
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div
      className="inline-flex items-center gap-4 rounded-xl px-6 py-4 border"
      style={{
        backgroundColor,
        color: textColor,
        borderColor: `${primaryColor}33`,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <Star
            className="w-8 h-8 fill-current"
            style={{ color: primaryColor }}
          />
          <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
        </div>
        <Stars rating={Math.round(avgRating)} color={primaryColor} size={14} />
      </div>
      <div className="border-l pl-4 h-12 flex flex-col justify-center" style={{ borderColor: `${textColor}20` }}>
        <p className="font-semibold text-sm">{businessName}</p>
        <p className="text-xs opacity-60">
          Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
