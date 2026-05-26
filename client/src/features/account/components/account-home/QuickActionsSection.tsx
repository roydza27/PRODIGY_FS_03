import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import AccountSectionCard from "../shared/AccountSectionCard";
import AccountSectionTitle from "../shared/AccountSectionTitle";
import type { AccountQuickAction } from "../../types/account-home.types";

type Props = {
  actions: AccountQuickAction[];
};

export default function QuickActionsSection({ actions }: Props) {
  return (
    <AccountSectionCard>
      <AccountSectionTitle
        title="Quick Actions"
        description="Common account tasks."
      />

      <div className="space-y-3 pt-5 text-">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10"
          >
            <span>{action.label}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </AccountSectionCard>
  );
}