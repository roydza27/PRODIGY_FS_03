import AccountOrdersStatCard from "./AccountOrdersStatCard";

type Props = {
  totalOrders: number;
  delivered: number;
  inTransit: number;
  totalSpent: string;
};

export default function AccountOrdersStatsGrid({
  totalOrders,
  delivered,
  inTransit,
  totalSpent,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <AccountOrdersStatCard label="Total Orders" value={totalOrders} />
      <AccountOrdersStatCard label="Delivered" value={delivered} />
      <AccountOrdersStatCard label="In Transit" value={inTransit} />
      <AccountOrdersStatCard label="Total Spent" value={totalSpent} />
    </div>
  );
}