import { Badge } from "@/shared/components/ui/badge";

export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type Props = {
  status: AdminOrderStatus;
};

function getStatusClass(status: AdminOrderStatus) {
  switch (status) {
    case "delivered":
      return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
    case "shipped":
      return "border-blue-500/20 bg-blue-500/15 text-blue-400";
    case "processing":
      return "border-amber-500/20 bg-amber-500/15 text-amber-400";
    case "paid":
      return "border-cyan-500/20 bg-cyan-500/15 text-cyan-400";
    case "cancelled":
      return "border-red-500/20 bg-red-500/15 text-red-400";
    default:
      return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
  }
}

export default function OrderStatusBadge({ status }: Props) {
  return (
    <Badge className={`border ${getStatusClass(status)} capitalize`}>
      {status}
    </Badge>
  );
}