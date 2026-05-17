import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";

const products = [
  { name: "Smart Watch", stock: 12, price: "₹7,999", status: "Active" },
  { name: "Headphones", stock: 18, price: "₹5,499", status: "Active" },
  { name: "Keyboard", stock: 6, price: "₹1,899", status: "Low Stock" },
];

export default function AdminProductsPage() {
  return (
    <AdminPageShell
      title="Products"
      description="Manage catalog items, pricing, visibility, and stock levels."
      actions={
        <>
          <Button variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
            Import
          </Button>
          <Button className="rounded-xl bg-red-500 hover:bg-red-600">Add Product</Button>
        </>
      }
    >
      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Search Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search products..."
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.name} className="border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{product.name}</p>
                  <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                    {product.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-400">
                  Stock: {product.stock}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-zinc-100">{product.price}</p>
                <Button variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                  Edit
                </Button>
                <Button variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminPageShell>
  );
}