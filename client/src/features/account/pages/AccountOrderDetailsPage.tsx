import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { formatPrice } from "@/features/products/utils/product.helpers";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order.types";

function getStatusClass(status: Order["status"]) {
  switch (status) {
    case "delivered":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    case "shipped":
      return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    case "processing":
      return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    case "paid":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20";
    case "cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/20";
  }
}

export default function AccountOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getById(id);
        setOrder(res.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">
            {error || "Order not found"}
          </div>
          <Button asChild className="rounded-xl bg-red-500 hover:bg-red-600">
            <Link to="/account/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <Link to="/account" className="hover:text-zinc-200">
            My Account
          </Link>
          <span>/</span>
          <Link to="/account/orders" className="hover:text-zinc-200">
            Orders
          </Link>
          <span>/</span>
          <span className="text-zinc-200">#{order._id.slice(-8).toUpperCase()}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Order Details</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <Badge className={["border", getStatusClass(order.status)].join(" ")}>
            {order.status}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
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
                    {index < order.items.length - 1 ? (
                      <Separator className="my-4 bg-white/10" />
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                <div>
                  <p className="text-zinc-500">Full Name</p>
                  <p>{order.shippingAddress.fullName}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Email</p>
                  <p>{order.shippingAddress.email}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Phone</p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Country</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-zinc-500">Address</p>
                  <p>{order.shippingAddress.address}</p>
                </div>
                <div>
                  <p className="text-zinc-500">City</p>
                  <p>{order.shippingAddress.city}</p>
                </div>
                <div>
                  <p className="text-zinc-500">State</p>
                  <p>{order.shippingAddress.state}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Postal Code</p>
                  <p>{order.shippingAddress.postalCode}</p>
                </div>
              </CardContent>
            </Card>
          </div>

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
        </div>
      </div>
    </div>
  );
}