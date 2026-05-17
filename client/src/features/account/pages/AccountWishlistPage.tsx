import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const wishlistItems = [
  {
    id: 1,
    name: "Smart Watch",
    price: "₹7,999",
    tag: "Trending",
  },
  {
    id: 2,
    name: "Noise Cancelling Headphones",
    price: "₹5,499",
    tag: "Best Seller",
  },
  {
    id: 3,
    name: "Wireless Keyboard",
    price: "₹1,899",
    tag: "Low Stock",
  },
];

export default function AccountWishlistPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Products you saved for later.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="border-white/10 bg-white/5 text-white">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                    {item.tag}
                  </Badge>
                  <Heart className="h-4 w-4 text-red-400" />
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-400">Saved item ready to move into cart.</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.price}</span>
                  <Button asChild className="rounded-xl bg-red-500 hover:bg-red-600">
                    <Link to="/cart">Add to cart</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}