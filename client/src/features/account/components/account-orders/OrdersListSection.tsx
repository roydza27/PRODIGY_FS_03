import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ErrorState, EmptyState, TableSkeleton } from "@/shared/components/page-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Order } from "../../types/order.types";
import OrderListItem from "./OrderListItem";

type Props = {
  orders: Order[];
  loading: boolean;
  error: string | null;
};

export default function OrdersListSection({ orders, loading, error }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : error ? (
          <ErrorState
            error={error}
            onAction={() => window.location.reload()}
            actionLabel="Retry"
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Your placed orders will appear here."
            actionLabel="Browse products"
            onAction={() => navigate("/products")}
            icon={<ShoppingBag className="h-5 w-5" />}
          />
        ) : (
          orders.map((order, index) => (
            <OrderListItem
              key={order._id}
              order={order}
              showDivider={index < orders.length - 1}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}