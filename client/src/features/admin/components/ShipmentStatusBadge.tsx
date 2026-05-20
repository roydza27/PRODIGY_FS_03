import { Badge } from "@/shared/components/ui/badge";

export type ShipmentStatus =
  | "pending"
  | "packed"
  | "in_transit"
  | "delivered"
  | "cancelled";

type Props = {
  status: ShipmentStatus;
};

function getStatusClass(status: ShipmentStatus) {
  switch (status) {
    case "delivered":
      return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
    case "in_transit":
      return "border-blue-500/20 bg-blue-500/15 text-blue-400";
    case "packed":
      return "border-cyan-500/20 bg-cyan-500/15 text-cyan-400";
    case "cancelled":
      return "border-red-500/20 bg-red-500/15 text-red-400";
    default:
      return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
  }
}

function getLabel(status: ShipmentStatus) {
  switch (status) {
    case "in_transit":
      return "In Transit";
    case "packed":
      return "Packed";
    default:
      return status;
  }
}

export default function ShipmentStatusBadge({ status }: Props) {
  return (
    <Badge className={`border capitalize ${getStatusClass(status)}`}>
      {getLabel(status)}
    </Badge>
  );
}