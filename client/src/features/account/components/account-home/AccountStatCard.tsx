import type { AccountHomeStat } from "../../types/account-home.types";
import { Card, CardContent } from "@/shared/components/ui/card";

type Props = {
  stat: AccountHomeStat;
};

export default function AccountStatCard({ stat }: Props) {
  const Icon = stat.icon;

  return (
    <Card className="border-white/10 bg-[#111113] text-white shadow-xl shadow-black/20">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-[#DB4444]" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
            {stat.value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}