import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { formatPrice } from "@/features/products/utils/product.helpers";
import type { OrderItem } from "../../types/order.types";

type Props = {
  items: OrderItem[];
};

export default function OrderItemsSection({ items }: Props) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={item.productId}>
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/5">
                <img
                  src={item.image || "/placeholder-product.png"}
                  alt={item.name}
                  className="h-full w-full object-contain p-2"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-medium">{item.name}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-zinc-400">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
                <p className="text-base font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>

            {index < items.length - 1 ? (
              <Separator className="my-4 bg-white/10" />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}