import { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  ArrowUpRight,
  DollarSign,
  Download,
  Package,
  ShoppingCart,
  Sparkles,
  Users,
  Wallet,
  Activity,
  BadgePercent,
  Truck,
  Star,
} from "lucide-react";
import { sellerService } from "../services/seller.service";
import type { SellerDashboard } from "../types/seller.types";

// TODO: Replace these fallback arrays with real data when backend endpoints for charts/insights are available
const salesData = [
  { name: "Jan", sales: 2400, revenue: 24000, orders: 12 },
  { name: "Feb", sales: 3210, revenue: 32100, orders: 15 },
  { name: "Mar", sales: 2290, revenue: 22900, orders: 10 },
  { name: "Apr", sales: 2000, revenue: 20000, orders: 9 },
  { name: "May", sales: 2181, revenue: 21810, orders: 11 },
  { name: "Jun", sales: 2500, revenue: 25000, orders: 14 },
];

const productData = [
  { name: "Electronics", value: 35, fill: "#DB4444" },
  { name: "Fashion", value: 25, fill: "#f97316" },
  { name: "Home", value: 20, fill: "#f59e0b" },
  { name: "Books", value: 20, fill: "#fb7185" },
];

const topProducts = [
  { name: "Wireless Headphones", revenue: "₹24,500", orders: 42, trend: "+12%" },
  { name: "USB-C Cable", revenue: "₹18,200", orders: 86, trend: "+8%" },
  { name: "Phone Case", revenue: "₹14,900", orders: 64, trend: "+5%" },
  { name: "Bluetooth Speaker", revenue: "₹12,400", orders: 19, trend: "+18%" },
];

const insights = [
  "Revenue is strongest in Electronics and Accessories.",
  "Conversion improved after recent price adjustments.",
  "Orders peaked mid-month, suggesting strong campaign performance.",
  "Low-return categories are performing better on repeat purchases.",
];

const timeRanges = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"];

const COLORS = ["#DB4444", "#f97316", "#f59e0b", "#fb7185"];

function tooltipStyle() {
  return {
    backgroundColor: "#18181B",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    color: "#fff",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  };
}

export default function SellerAnalyticsPage() {
  const [range, setRange] = useState(timeRanges[1]);
  const [dashboard, setDashboard] = useState<SellerDashboard | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await sellerService.getSellerDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Failed to fetch seller dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const dStats = dashboard?.stats || {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      averageRating: 0,
      totalReviews: 0,
    };

    return [
      {
        label: "Total Revenue",
        value: `₹${dStats.totalRevenue.toLocaleString()}`,
        change: "+12.5%",
        icon: DollarSign,
        accent: "text-emerald-300",
        ring: "border-emerald-500/20 bg-emerald-500/10",
      },
      {
        label: "Total Orders",
        value: dStats.totalOrders.toString(),
        change: "+8.2%",
        icon: ShoppingCart,
        accent: "text-blue-300",
        ring: "border-blue-500/20 bg-blue-500/10",
      },
      {
        label: "Total Products",
        value: dStats.totalProducts.toString(),
        change: "+15.3%",
        icon: Package,
        accent: "text-violet-300",
        ring: "border-violet-500/20 bg-violet-500/10",
      },
      {
        label: "Avg Rating",
        value: `${dStats.averageRating} (${dStats.totalReviews})`,
        change: "+4.1%",
        icon: Star,
        accent: "text-amber-300",
        ring: "border-amber-500/20 bg-amber-500/10",
      },
    ];
  }, [dashboard]);

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles className="h-4 w-4 text-[#DB4444]" />
              Seller performance dashboard
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Analytics</h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              View your sales, customer growth, category mix, and product performance in one clean ecommerce dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="h-12 w-full border-white/10 bg-[#18181B] text-white sm:w-[180px] focus:ring-[#DB4444]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#18181B] text-white">
                {timeRanges.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="h-12 bg-[#DB4444] text-white hover:bg-[#c53a3a]">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-white/10 bg-[#18181B] shadow-xl transition hover:border-white/15 hover:bg-[#1b1b1f]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.change}
                      </div>
                    </div>
                    <div className={`rounded-2xl border p-3 ${stat.ring}`}>
                      <Icon className={`h-5 w-5 ${stat.accent}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardContent className="grid gap-4 p-5 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Wallet className="h-4 w-4 text-[#DB4444]" />
                Average order value
              </div>
              <p className="mt-2 text-2xl font-bold">₹2,054</p>
              <p className="mt-1 text-sm text-zinc-400">Up 9.4% from last period</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Package className="h-4 w-4 text-[#DB4444]" />
                Conversion rate
              </div>
              <p className="mt-2 text-2xl font-bold">4.7%</p>
              <p className="mt-1 text-sm text-zinc-400">Healthy for your category mix</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Truck className="h-4 w-4 text-[#DB4444]" />
                Fulfillment rate
              </div>
              <p className="mt-2 text-2xl font-bold">96%</p>
              <p className="mt-1 text-sm text-zinc-400">Orders dispatched on time</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Star className="h-4 w-4 text-[#DB4444]" />
                Seller rating
              </div>
              <p className="mt-2 text-2xl font-bold">4.8/5</p>
              <p className="mt-1 text-sm text-zinc-400">Strong customer satisfaction</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-white/10 bg-[#18181B] shadow-xl lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Sales Trend</CardTitle>
                <CardDescription className="text-zinc-400">Revenue and order trend for {range.toLowerCase()}</CardDescription>
              </div>
              <Badge className="border-[#DB4444]/20 bg-[#DB4444]/10 text-[#ffd7d7] hover:bg-[#DB4444]/10">
                Active growth
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle()} labelStyle={{ color: "#fff" }} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#DB4444"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#DB4444" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#f97316" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Category Mix</CardTitle>
              <CardDescription className="text-zinc-400">Revenue share by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={92}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {productData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {item.name}
                    </div>
                    <span className="text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-white/10 bg-[#18181B] shadow-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Orders Over Time</CardTitle>
              <CardDescription className="text-zinc-400">Daily order volume across recent months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} barSize={34}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle()} labelStyle={{ color: "#fff" }} />
                    <Legend />
                    <Bar dataKey="orders" fill="#DB4444" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Key Insights</CardTitle>
              <CardDescription className="text-zinc-400">Actionable ecommerce signals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mt-0.5 rounded-full border border-[#DB4444]/20 bg-[#DB4444]/10 p-2 text-[#DB4444]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-zinc-300">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="border-white/10 bg-[#18181B] shadow-xl xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Top Selling Products</CardTitle>
              <CardDescription className="text-zinc-400">Best performers by revenue and order volume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DB4444]/10 text-[#DB4444]">
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{product.orders} orders · {product.trend} growth</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{product.revenue}</p>
                    <p className="text-xs text-emerald-300">Best seller</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Performance Snapshot</CardTitle>
              <CardDescription className="text-zinc-400">Fast-read store health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <BadgePercent className="h-4 w-4 text-[#DB4444]" />
                  Promotion impact
                </div>
                <p className="mt-2 text-2xl font-bold text-white">+18%</p>
                <p className="mt-1 text-sm text-zinc-400">Sales from active campaigns</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Package className="h-4 w-4 text-[#DB4444]" />
                  Conversion health
                </div>
                <p className="mt-2 text-2xl font-bold text-white">Strong</p>
                <p className="mt-1 text-sm text-zinc-400">Optimized product pages and pricing</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Users className="h-4 w-4 text-[#DB4444]" />
                  Returning customers
                </div>
                <p className="mt-2 text-2xl font-bold text-white">31%</p>
                <p className="mt-1 text-sm text-zinc-400">Repeat buyers this period</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
