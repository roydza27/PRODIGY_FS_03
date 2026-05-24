import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function AccountSectionTitle({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-zinc-400">{description}</p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}