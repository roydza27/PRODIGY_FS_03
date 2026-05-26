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