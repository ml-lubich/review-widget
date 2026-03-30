"use client";

import { Review, WidgetStyle } from "@/lib/types";
import { TestimonialCard } from "./TestimonialCard";
import { StarBadge } from "./StarBadge";
import { ReviewCarousel } from "./ReviewCarousel";
import { ReviewWall } from "./ReviewWall";
import { FloatingBadge } from "./FloatingBadge";

interface WidgetRendererProps {
  style: WidgetStyle;
  reviews: Review[];
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  businessName?: string;
}

export function WidgetRenderer({
  style,
  reviews,
  primaryColor,
  backgroundColor,
  textColor,
  businessName,
}: WidgetRendererProps) {
  const props = { reviews, primaryColor, backgroundColor, textColor };

  switch (style) {
    case "card":
      return <TestimonialCard {...props} />;
    case "carousel":
      return <ReviewCarousel {...props} />;
    case "grid":
      return <ReviewWall {...props} />;
    case "badge":
      return <StarBadge {...props} businessName={businessName} />;
    case "floating":
      return <FloatingBadge {...props} businessName={businessName} />;
  }
}
