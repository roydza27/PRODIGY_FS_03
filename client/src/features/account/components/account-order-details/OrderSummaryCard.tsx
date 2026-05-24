import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { formatPrice } from "@/features/products/utils/product.helpers";
import type { Order } from "../../types/order.types";

type Props = {
  order: Order;
};

export default function OrderSummaryCard({ order }: Props) {
  return (
    <Card className="h-fit border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>Payment Method</span>
          <span className="uppercase">{order.paymentMethod}</span>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        <Separator className="bg-white/10" />

        <Button asChild className="w-full rounded-xl bg-red-500 hover:bg-red-600">
          <Link to="/account/orders">Back to orders</Link>
        </Button>
      </CardContent>
    </Card>
  );
}