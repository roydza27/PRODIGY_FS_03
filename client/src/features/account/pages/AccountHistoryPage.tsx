import { useEffect, useState } from "react";
import { Search, Filter, Package, ChevronRight, CheckCircle2 } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order.types";

export default function AccountHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await orderService.getAll();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Your Orders</h1>
        </div>

        {/* Toolbar: Search, Filters, and Tabs */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-6 overflow-x-auto border-b border-white/10 pb-[1px] text-sm font-medium text-zinc-400">
              <button className="border-b-2 border-[#DB4444] pb-2 text-[#DB4444]">Orders</button>
              <button className="border-b-2 border-transparent pb-2 transition hover:text-white">Buy Again</button>
              <button className="border-b-2 border-transparent pb-2 transition hover:text-white">Cancelled Orders</button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search all orders"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#DB4444]/50 focus:ring-1 focus:ring-[#DB4444]/20"
                />
              </div>
              <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-300">
            <span className="font-semibold text-white">{orders.length} orders</span> placed in 
            <select className="ml-2 cursor-pointer rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-sm outline-none hover:bg-white/5">
              <option>past 3 months</option>
              <option>2026</option>
              <option>2025</option>
            </select>
          </p>
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-zinc-400">Loading orders...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-zinc-400">No orders found.</p>
          ) : (
            orders.map((order) => {
              const isDelivered = order.status === "delivered";
              return (
                <Card key={order._id} className="overflow-hidden border-white/10 bg-white/[0.02] text-white transition-all hover:border-white/20">
                  
                  {/* Order Card Header (Amazon style metadata) */}
                  <div className="flex flex-col gap-4 border-b border-white/10 bg-black/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="grid grid-cols-2 gap-6 sm:flex sm:gap-8">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Order Placed</p>
                        <p className="mt-1 text-sm font-medium text-zinc-200">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total</p>
                        <p className="mt-1 text-sm font-medium text-zinc-200">₹{order.total}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Ship To</p>
                        <p className="mt-1 text-sm font-medium text-[#A0BCE0] hover:underline cursor-pointer">{order.shippingAddress?.fullName || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end">
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Order # {order._id.slice(-8).toUpperCase()}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm font-medium text-[#A0BCE0]">
                        <span className="cursor-pointer hover:underline">View order details</span>
                        <span className="text-zinc-600">|</span>
                        <span className="cursor-pointer hover:underline">Invoice</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Card Body */}
                  <div className="px-4 py-5 sm:px-6">
                    <div className="mb-4 flex items-center gap-2">
                      {isDelivered ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Package className="h-5 w-5 text-amber-500" />
                      )}
                      <h3 className="text-lg font-semibold text-white capitalize">{order.status}</h3>
                    </div>

                    <div className="space-y-6">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                            {/* Product Info */}
                            <div className="flex gap-4 sm:w-2/3">
                              <div className={`h-20 w-20 shrink-0 rounded-xl border border-white/10 sm:h-24 sm:w-24 flex items-center justify-center bg-zinc-800`}>
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-xl" />
                                ) : (
                                  <Package className="h-8 w-8 text-white/20" />
                                )}
                              </div>
                              <div className="flex flex-col justify-start">
                                <h4 className="text-sm font-medium text-[#A0BCE0] hover:underline cursor-pointer sm:text-base leading-snug">
                                  {item.name}
                                </h4>
                                <p className="mt-1 text-xs text-zinc-400">Qty: {item.quantity}</p>
                                <p className="mt-2 text-xs text-zinc-500">₹{item.price}</p>
                                
                                <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
                                  <Button size="sm" className="h-8 rounded-lg bg-[#DB4444] text-xs font-medium hover:bg-[#c53a3a]">
                                    Buy it again
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 rounded-lg border-white/10 bg-transparent text-xs hover:bg-white/5">
                                    View item
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Actions (Desktop) */}
                            <div className="hidden shrink-0 flex-col gap-2 sm:flex sm:w-[200px]">
                              <Button className="w-full justify-center rounded-xl bg-[#DB4444] hover:bg-[#c53a3a]">
                                Buy it again
                              </Button>
                              <Button variant="outline" className="w-full justify-center rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white">
                                View item
                              </Button>
                            </div>
                          </div>
                          {index < order.items.length - 1 && <Separator className="my-6 bg-white/5" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Order Card Footer */}
                  <div className="border-t border-white/5 bg-white/[0.01] px-4 py-3 sm:px-6">
                    <Button variant="ghost" className="h-8 w-full justify-between px-0 font-medium text-zinc-300 hover:bg-transparent hover:text-white sm:w-auto sm:justify-start">
                      <span>Archive order</span>
                      <ChevronRight className="h-4 w-4 sm:hidden" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
        
      </div>
    </div>
  );
}
