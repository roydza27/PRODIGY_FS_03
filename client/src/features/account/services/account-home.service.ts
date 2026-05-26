import { orderService } from "@/features/checkout/services/order.service";
import { accountBecomeSellerService } from "@/features/account/services/account-become-seller.service";
import { accountHomeData } from "../constants/account-home.constants";
import type { AccountHomeData } from "../types/account-home.types";

export async function getAccountHomeData(): Promise<AccountHomeData> {
  try {
    const [ordersRes, sellerApplication] = await Promise.all([
      orderService.getAll(),
      accountBecomeSellerService.getApplicationStatus(),
    ]);

    const orders = ordersRes.orders || [];

    const recentOrders = orders
      .slice()
      .sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0))
      .slice(0, 5)
      .map((order) => ({
        id: order._id,
        title: `Order #${order._id.slice(-8).toUpperCase()}`,
        date: new Date(order.createdAt).toLocaleDateString(),
        amount: `₹${order.total}`,
        status: order.status,
        href: `/account/orders/${order._id}`,
      }));

    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    return {
      hero: {
        badge: sellerApplication ? "Seller application on file" : "Customer account",
        title: "Welcome back",
        description: "Track your orders, saved items, and account activity from one place.",
        primaryAction: { label: "Browse Products", href: "/products" },
        secondaryAction: { label: "View Orders", href: "/account/orders" },
      },
      stats: [
        { label: "Orders", value: String(orders.length), icon: undefined as never },
        { label: "Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: undefined as never },
        { label: "Recent Orders", value: String(recentOrders.length), icon: undefined as never },
        {
          label: "Seller Status",
          value: sellerApplication ? sellerApplication.sellerStatus : "Not applied",
          icon: undefined as never,
        },
      ],
      recentOrders,
      wishlistPreview: [],
      quickActions: [
        { label: "Browse Products", href: "/products" },
        { label: "View Orders", href: "/account/orders" },
        { label: "Wishlist", href: "/account/wishlist" },
      ],
    };
  } catch {
    return accountHomeData;
  }
}