import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    product: "Smart Watch",
    rating: 5,
    status: "Published",
    text: "Great battery life and the build feels premium.",
  },
  {
    id: 2,
    product: "Headphones",
    rating: 4,
    status: "Pending",
    text: "Excellent sound, just waiting on the seller reply.",
  },
];

export default function AccountReviewsPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Reviews</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Track your submitted reviews and ratings.
            </p>
          </div>
          <Button className="w-fit rounded-xl bg-red-500 hover:bg-red-600">
            Write a review
          </Button>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="border-white/10 bg-white/5 text-white">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-lg">{review.product}</CardTitle>
                  <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                    {review.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 pt-1">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="text-sm text-zinc-300">
                {review.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}