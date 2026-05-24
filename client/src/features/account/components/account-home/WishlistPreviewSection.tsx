import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import AccountSectionCard from "../shared/AccountSectionCard";
import AccountSectionTitle from "../shared/AccountSectionTitle";
import type { AccountWishlistItem } from "../../types/account-home.types";

type Props = {
  items: AccountWishlistItem[];
};

export default function WishlistPreviewSection({ items }: Props) {
  return (
    <AccountSectionCard>
      <AccountSectionTitle
        title="Wishlist Preview"
        description="Items you saved for later."
        action={
          <Link
            to="/account/wishlist"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            View all
          </Link>
        }
      />

      <div className="space-y-3 pt-5">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10"
          >
            <span>{item.title}</span>
            <Heart className="h-4 w-4 text-[#DB4444]" />
          </Link>
        ))}
      </div>
    </AccountSectionCard>
  );
}