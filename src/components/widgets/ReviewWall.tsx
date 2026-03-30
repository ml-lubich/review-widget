"use client";

import { Review } from "@/lib/types";
import { Stars } from "./Stars";

export function ReviewWall({
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl p-5 border transition-transform hover:scale-[1.02]"
          style={{
            backgroundColor,
            color: textColor,
            borderColor: `${primaryColor}22`,
          }}
        >
          <Stars rating={review.rating} color={primaryColor} size={14} />
          <p className="mt-2.5 text-sm leading-relaxed opacity-90 line-clamp-4">
            {review.body}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: primaryColor, color: backgroundColor }}
            >
              {review.author_name.charAt(0)}
            </div>
            <span className="text-sm font-medium">{review.author_name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
