import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";
import CustomerTable from "../components/CustomerTable";
import type { AdminCustomer } from "../services/customer.service";
import { getCustomers } from "../services/customer.service";
import { formatPrice } from "@/features/products/utils/product.helpers";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return customers;

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const vip = customers.filter((c) => c.status === "vip").length;
    const active = customers.filter((c) => c.status === "active").length;
    const revenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

    return { totalCustomers, vip, active, revenue };
  }, [customers]);

  return (
    <AdminPageShell
      title="Customers"
      description="View customer activity, order counts, and lifetime value."
      actions={
        <Button
          onClick={loadCustomers}
          className="rounded-xl bg-red-500 hover:bg-red-600"
        >
          Refresh
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : stats.totalCustomers}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : stats.active}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              VIP
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : stats.vip}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : formatPrice(stats.revenue)}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Search Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </CardContent>
      </Card>

      {selectedCustomer ? (
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
            <div>
              <p className="text-zinc-500">Name</p>
              <p>{selectedCustomer.name}</p>
            </div>
            <div>
              <p className="text-zinc-500">Email</p>
              <p>{selectedCustomer.email}</p>
            </div>
            <div>
              <p className="text-zinc-500">Orders</p>
              <p>{selectedCustomer.orders}</p>
            </div>
            <div>
              <p className="text-zinc-500">Total Spent</p>
              <p>{formatPrice(selectedCustomer.totalSpent)}</p>
            </div>
            <div>
              <p className="text-zinc-500">Status</p>
              <p className="capitalize">{selectedCustomer.status}</p>
            </div>
            <div>
              <p className="text-zinc-500">Last Order</p>
              <p>
                {selectedCustomer.lastOrderAt
                  ? new Date(selectedCustomer.lastOrderAt).toLocaleString()
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Loading customers...
        </div>
      ) : (
        <CustomerTable customers={filteredCustomers} onView={setSelectedCustomer} />
      )}
    </AdminPageShell>
  );
}