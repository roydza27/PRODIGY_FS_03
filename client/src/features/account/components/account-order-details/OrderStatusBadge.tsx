import { Badge } from "@/shared/components/ui/badge";
import type { Order } from "../../types/order.types";

function getStatusClass(status: Order["status"]) {
  switch (status) {
    case "delivered":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    case "shipped":
      return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    case "processing":
      return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    case "paid":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20";
    case "cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/20";
  }
}

type Props = {
  status: Order["status"];
};

export default function OrderStatusBadge({ status }: Props) {
  return (
    <Badge className={["border", getStatusClass(status)].join(" ")}>
      {status}
    </Badge>
  );
}