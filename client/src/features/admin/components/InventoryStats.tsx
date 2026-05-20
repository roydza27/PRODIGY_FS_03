import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type InventoryStatsProps = {
  totalProducts: number;
  healthyStock: number;
  lowStock: number;
  outOfStock: number;
};

export default function InventoryStats({
  totalProducts,
  healthyStock,
  lowStock,
  outOfStock,
}: InventoryStatsProps) {
  const stats = [
    { label: "Total Products", value: totalProducts },
    { label: "Healthy Stock", value: healthyStock },
    { label: "Low Stock", value: lowStock },
    { label: "Out of Stock", value: outOfStock },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stat.value}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}