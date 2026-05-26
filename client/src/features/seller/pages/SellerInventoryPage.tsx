import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertTriangle, Edit2, CheckCircle2 } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export default function SellerInventoryPage() {
  const [items] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      currentStock: 15,
      reorderLevel: 10,
      status: "in-stock",
    },
    {
      id: "2",
      name: "USB-C Cable",
      sku: "USB-001",
      category: "Accessories",
      currentStock: 3,
      reorderLevel: 20,
      status: "low-stock",
    },
  ]);

  const getStatusColor = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return "bg-green-600/20 text-green-200 border-green-600";
      case "low-stock":
        return "bg-yellow-600/20 text-yellow-200 border-yellow-600";
      case "out-of-stock":
        return "bg-red-600/20 text-red-200 border-red-600";
    }
  };

  const lowStockItems = items.filter((i) => i.status !== "in-stock");

  return (
    <div className="min-h-screen bg-[#111113] text-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Inventory</h1>
          <p className="mt-2 text-lg text-zinc-400">Track and manage stock levels</p>
        </div>

        {/* Alerts */}
        {lowStockItems.length > 0 && (
          <Alert className="border-yellow-800 bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-200" />
            <AlertDescription className="text-yellow-100">
              {lowStockItems.length} item(s) have low stock levels. Please reorder soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-white">{items.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">In Stock</p>
              <p className="text-3xl font-bold text-green-400">{items.filter((i) => i.status === "in-stock").length}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-1">Low Stock Alert</p>
              <p className="text-3xl font-bold text-yellow-400">{lowStockItems.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Inventory List</CardTitle>
            <CardDescription>Manage your product stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-zinc-300">Product</th>
                    <th className="px-6 py-3 text-left font-semibold text-zinc-300">SKU</th>
                    <th className="px-6 py-3 text-left font-semibold text-zinc-300">Category</th>
                    <th className="px-6 py-3 text-right font-semibold text-zinc-300">Current Stock</th>
                    <th className="px-6 py-3 text-right font-semibold text-zinc-300">Reorder Level</th>
                    <th className="px-6 py-3 text-center font-semibold text-zinc-300">Status</th>
                    <th className="px-6 py-3 text-center font-semibold text-zinc-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/50 transition">
                      <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                      <td className="px-6 py-4 text-zinc-400">{item.sku}</td>
                      <td className="px-6 py-4 text-zinc-400">{item.category}</td>
                      <td className="px-6 py-4 text-right font-semibold text-white">{item.currentStock}</td>
                      <td className="px-6 py-4 text-right text-zinc-400">{item.reorderLevel}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status === "in-stock" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {item.status === "low-stock" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
