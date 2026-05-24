import { Star } from "lucide-react";

type Review = {
  id: string;
  name: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
};

type Props = {
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
};

const defaultReviews: Review[] = [
  {
    id: "1",
    name: "Aarav",
    date: "2 days ago",
    rating: 5,
    title: "Great quality",
    comment:
      "Feels premium and works exactly as expected. Delivery was also quick.",
  },
  {
    id: "2",
    name: "Meera",
    date: "1 week ago",
    rating: 4,
    title: "Worth the price",
    comment:
      "Nice finish and good overall experience. Packaging could be slightly better.",
  },
  {
    id: "3",
    name: "Rohan",
    date: "2 weeks ago",
    rating: 5,
    title: "Very satisfied",
    comment:
      "Smooth purchase and the product matches the photos. Happy with it.",
  },
];

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
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
  averageRating = 4.5,
  reviewCount = 128,
  reviews = defaultReviews,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Reviews</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Real buyer feedback and rating breakdown.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
          <div>
            <div className="text-3xl font-semibold tracking-tight text-white">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-zinc-500">{reviewCount} reviews</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="space-y-1">
            <RatingStars value={averageRating} />
            <div className="text-xs text-zinc-500">Overall rating</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-white/8 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {review.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{review.date}</p>
                </div>
                <RatingStars value={review.rating} />
              </div>

              <h4 className="mt-3 text-sm font-medium text-zinc-100">
                {review.title}
              </h4>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {review.comment}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-white">Write a review</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Add your feedback after purchase.
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/8 bg-white/5 p-3 text-sm text-zinc-500">
              Rating input placeholder
            </div>
            <div className="rounded-xl border border-white/8 bg-white/5 p-3 text-sm text-zinc-500">
              Name input placeholder
            </div>
            <div className="rounded-xl border border-white/8 bg-white/5 p-3 text-sm text-zinc-500">
              Comment textarea placeholder
            </div>

            <button
              type="button"
              className="h-11 w-full rounded-xl bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Submit review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}