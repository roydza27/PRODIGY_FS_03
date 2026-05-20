import { Star } from "lucide-react";

interface Props {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}

export default function ProductRating({ rating, reviewCount, size = "md" }: Props) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          return (
            <Star
              key={i}
              className={[
                starSize,
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-700 text-zinc-700",
              ].join(" ")}
            />
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-zinc-500">({reviewCount} Reviews)</span>
      )}
    </div>
  );
}