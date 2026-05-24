import { Link } from "react-router-dom";

type Props = {
  orderId: string;
};

export default function OrderDetailsBreadcrumbs({ orderId }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
      <Link to="/account" className="hover:text-zinc-200">
        My Account
      </Link>
      <span>/</span>
      <Link to="/account/orders" className="hover:text-zinc-200">
        Orders
      </Link>
      <span>/</span>
      <span className="text-zinc-200">
        #{orderId.slice(-8).toUpperCase()}
      </span>
    </div>
  );
}