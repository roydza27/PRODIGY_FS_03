import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

type Props = {
  status: string;
  memberSince: string;
  ordersPlaced: number;
};

export default function AccountOverviewCard({
  status,
  memberSince,
  ordersPlaced,
}: Props) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm text-zinc-400">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <span className="text-emerald-400">{status}</span>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex items-center justify-between">
          <span>Member since</span>
          <span>{memberSince}</span>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex items-center justify-between">
          <span>Orders placed</span>
          <span>{ordersPlaced}</span>
        </div>
      </CardContent>
    </Card>
  );
}