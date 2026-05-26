import { useMemo, useState } from "react";
import { Star } from "lucide-react";

type Review = {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
};

type Props = {
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
  canReview?: boolean;
  onSubmitReview?: (payload: { rating: number; comment: string }) => Promise<void>;
};

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={[
            "h-4 w-4",
            i < Math.round(value)
              ? "fill-[#FFAD33] text-[#FFAD33]"
              : "fill-zinc-700 text-transparent",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({
  averageRating = 0,
  reviewCount = 0,
  reviews = [],
  canReview = false,
  onSubmitReview,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formattedAverage = useMemo(() => {
    return Number.isFinite(averageRating) ? averageRating.toFixed(1) : "0.0";
  }, [averageRating]);

  const hasReviews = reviews.length > 0;

  const handleSubmit = async () => {
    if (!onSubmitReview || !canReview) return;

    const trimmed = comment.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);
      await onSubmitReview({ rating, comment: trimmed });
      setRating(5);
      setComment("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Reviews</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Verified buyer feedback and rating breakdown.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
          <div>
            <div className="text-3xl font-semibold tracking-tight text-white">
              {formattedAverage}
            </div>
            <div className="text-xs text-zinc-500">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="space-y-1">
            <RatingStars value={averageRating} />
            <div className="text-xs text-zinc-500">
              {reviewCount > 0 ? "Overall rating" : "No ratings yet"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          {hasReviews ? (
            reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-white/8 bg-black/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {review.user?.name || "Anonymous"}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <RatingStars value={review.rating} />
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {review.comment}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-zinc-400">
              No reviews yet. Be the first to share feedback after purchase.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-white">Write a review</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Add your feedback after purchase.
          </p>

          {canReview ? (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Rating
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    const active = value <= rating;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-label={`Set rating to ${value}`}
                        aria-pressed={rating === value}
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition",
                          active
                            ? "border-[#FFAD33]/40 bg-[#FFAD33]/10 text-[#FFAD33]"
                            : "border-white/10 bg-white/5 text-zinc-500 hover:border-white/20 hover:text-white",
                        ].join(" ")}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Comment
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="min-h-28 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !onSubmitReview || !comment.trim()}
                className="h-11 w-full rounded-xl bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
              Only customers who purchased this product can review it.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}