import { PricingTier, Review } from "./types";

export const WIDGET_STYLES = [
  { value: "card" as const, label: "Testimonial Cards", description: "Beautiful review cards with star ratings" },
  { value: "carousel" as const, label: "Review Carousel", description: "Auto-rotating review slider" },
  { value: "grid" as const, label: "Review Wall", description: "Grid layout showing multiple reviews" },
  { value: "badge" as const, label: "Star Badge", description: "Compact badge with average rating" },
  { value: "floating" as const, label: "Floating Badge", description: "Fixed-position floating review badge" },
] as const;

export const DEFAULT_COLORS = {
  primary: "#f59e0b",
  background: "#1a1a1a",
  text: "#ffffff",
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Basic",
    price: 9,
    description: "Perfect for a single location",
    maxWidgets: 1,
    features: [
      "1 review widget",
      "All 4 widget styles",
      "Up to 10 reviews",
      "Basic color customization",
      "Impression tracking",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 29,
    description: "For growing businesses",
    maxWidgets: 5,
    highlighted: true,
    features: [
      "5 review widgets",
      "All 4 widget styles",
      "Unlimited reviews",
      "Full color customization",
      "Advanced analytics",
      "Priority support",
      "Custom CSS injection",
      "Remove branding",
    ],
  },
  {
    name: "Agency",
    price: 59,
    description: "White-label for agencies",
    maxWidgets: 999,
    features: [
      "Unlimited widgets",
      "All 4 widget styles",
      "Unlimited reviews",
      "Full color customization",
      "Advanced analytics",
      "Dedicated support",
      "Custom CSS injection",
      "White-label branding",
      "API access",
      "Bulk management",
    ],
  },
];

export const SAMPLE_REVIEWS = [
  {
    id: "demo-1",
    widget_id: "demo",
    author_name: "Sarah M.",
    rating: 5,
    body: "Absolutely amazing service! The team went above and beyond to help us. Would highly recommend to anyone looking for quality work.",
    source: "manual",
    created_at: "2024-03-15",
  },
  {
    id: "demo-2",
    widget_id: "demo",
    author_name: "James K.",
    rating: 5,
    body: "Best experience I've ever had. Professional, timely, and the results exceeded my expectations.",
    source: "manual",
    created_at: "2024-03-10",
  },
  {
    id: "demo-3",
    widget_id: "demo",
    author_name: "Emily R.",
    rating: 4,
    body: "Great work overall. Very responsive and easy to work with. Will definitely be coming back.",
    source: "manual",
    created_at: "2024-03-05",
  },
  {
    id: "demo-4",
    widget_id: "demo",
    author_name: "Michael T.",
    rating: 5,
    body: "Outstanding quality and attention to detail. They truly care about their customers.",
    source: "manual",
    created_at: "2024-02-28",
  },
  {
    id: "demo-5",
    widget_id: "demo",
    author_name: "Lisa P.",
    rating: 5,
    body: "Five stars isn't enough! From start to finish, everything was perfect. Highly recommend!",
    source: "manual",
    created_at: "2024-02-20",
  },
  {
    id: "demo-6",
    widget_id: "demo",
    author_name: "David W.",
    rating: 4,
    body: "Very professional team. They delivered on time and the quality was excellent.",
    source: "manual",
    created_at: "2024-02-15",
  },
] satisfies Review[];
