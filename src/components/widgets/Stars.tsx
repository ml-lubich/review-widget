import { Star } from "lucide-react";

export function Stars({
  rating,
  color = "#f59e0b",
  size = 16,
}: {
  rating: number;
  color?: string;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={i <= rating ? "fill-current" : "opacity-30"}
          style={{ color: i <= rating ? color : undefined }}
          size={size}
        />
      ))}
    </div>
  );
}
