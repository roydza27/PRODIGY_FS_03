import { Badge } from "@/shared/components/ui/badge";
import type { SupportStatus } from "../services/support.service";

type Props = {
  status: SupportStatus;
};

function getClassName(status: SupportStatus) {
  switch (status) {
    case "open":
      return "border-amber-500/20 bg-amber-500/15 text-amber-400";
    case "in_progress":
      return "border-blue-500/20 bg-blue-500/15 text-blue-400";
    case "resolved":
      return "border-emerald-500/20 bg-emerald-500/15 text-emerald-400";
    case "closed":
      return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
    default:
      return "border-zinc-500/20 bg-zinc-500/15 text-zinc-300";
  }
}

function label(status: SupportStatus) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    default:
      return status;
  }
}

export default function SupportStatusBadge({ status }: Props) {
  return (
    <Badge className={`border capitalize ${getClassName(status)}`}>
      {label(status)}
    </Badge>
  );
}