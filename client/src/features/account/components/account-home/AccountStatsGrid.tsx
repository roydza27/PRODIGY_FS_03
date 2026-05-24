import type { AccountHomeStat } from "../../types/account-home.types";
import AccountStatCard from "./AccountStatCard";

type Props = {
  stats: AccountHomeStat[];
};

export default function AccountStatsGrid({ stats }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <AccountStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}