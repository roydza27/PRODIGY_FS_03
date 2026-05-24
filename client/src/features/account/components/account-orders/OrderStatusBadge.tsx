import { Badge } from "@/shared/components/ui/badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "../../constants/account-orders.constants";
import type { OrderStatus } from "../../types/order.types";

type Props = {
  status: OrderStatus;
};

export default function OrderStatusBadge({ status }: Props) {
  return (
    <Badge className={["border", ORDER_STATUS_STYLES[status]].join(" ")}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}