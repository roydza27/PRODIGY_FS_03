import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { Product } from "@/features/products/types/product.types";

type Props = {
  products: Product[];
  onEdit?: (product: Product) => void;
};

function getStockLabel(stock?: number) {
  if (!stock || stock <= 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return "Healthy";
}

function getStockBadgeClass(stock?: number) {
  if (!stock || stock <= 0) {
    return "border-red-500/20 bg-red-500/15 text-red-400";
  }

  if (stock <= 5) {
    return "border-amber-500/20 bg-amber-500/15 text-amber-400";
  }

  return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
}

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case "active":
      return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
    case "draft":
      return "border-amber-500/20 bg-amber-500/15 text-amber-400";
    case "archived":
      return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
    default:
      return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
  }
}

export default function InventoryTable({ products, onEdit }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/20 text-left text-sm text-zinc-400">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Health</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-zinc-400">
                  No inventory records found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/20">
                        <img
                          src={product.images?.[0] || "/placeholder-product.png"}
                          alt={product.name}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-zinc-500 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {product.category || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {product.stock ?? 0}
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      className={`border ${getStockBadgeClass(product.stock)}`}
                    >
                      {getStockLabel(product.stock)}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      className={`border ${getStatusBadgeClass(product.status)} capitalize`}
                    >
                      {product.status || "unknown"}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => onEdit?.(product)}
                        variant="outline"
                        className="rounded-xl border-white/10 bg-transparent hover:bg-white/5"
                      >
                        Edit
                      </Button>
                    </div>
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