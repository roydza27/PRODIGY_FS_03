import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatPrice } from "@/features/products/utils/product.helpers";
import type { AdminCustomer } from "../services/customer.service";

type Props = {
  customers: AdminCustomer[];
  onView?: (customer: AdminCustomer) => void;
};

function getStatusClass(status: AdminCustomer["status"]) {
  switch (status) {
    case "vip":
      return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
    case "active":
      return "border-blue-500/20 bg-blue-500/15 text-blue-400";
    default:
      return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
  }
}

export default function CustomerTable({ customers, onView }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/20 text-left text-sm text-zinc-400">
            <tr>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Orders</th>
              <th className="px-5 py-4 font-medium">Total Spent</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-zinc-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-white">{customer.name}</p>
                      <p className="text-xs text-zinc-500">{customer.email}</p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {customer.orders}
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {formatPrice(customer.totalSpent)}
                  </td>

                  <td className="px-5 py-4">
                    <Badge className={`border ${getStatusClass(customer.status)} capitalize`}>
                      {customer.status}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Button
                      type="button"
                      onClick={() => onView?.(customer)}
                      variant="outline"
                      className="rounded-xl border-white/10 bg-transparent hover:bg-white/5"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}