import type { ReactNode } from "react";

type AdminPageShellProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminPageShell({
  title,
  description,
  actions,
  children,
}: AdminPageShellProps) {
  return (
    <div className=" min-h-screen bg-[#111113]/95 px-4 py-6 text-white text-left sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mx-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-zinc-400">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        {children}
      </div>
    </div>
  );
}