export type WidgetStyle = "card" | "carousel" | "grid" | "badge" | "floating";

export interface Widget {
  id: string;
  user_id: string;
  business_name: string;
  google_place_url: string | null;
  style: WidgetStyle;
  primary_color: string;
  background_color: string;
  text_color: string;
  created_at: string;
  updated_at: string;
}

export interface WidgetConfig {
  id: string;
  widget_id: string;
  show_branding: boolean;
  auto_rotate: boolean;
  rotate_interval: number;
  max_reviews: number;
  custom_css: string | null;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  created_at: string;
}

export interface Review {
  id: string;
  widget_id: string;
  author_name: string;
  rating: number;
  body: string | null;
  source: string;
  created_at: string;
}

export interface Impression {
  id: number;
  widget_id: string;
  recorded_at: string;
}

export interface WidgetWithReviews extends Widget {
  reviews: Review[];
}

export interface DailyImpressions {
  date: string;
  count: number;
}

export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  maxWidgets: number;
  highlighted?: boolean;
}
