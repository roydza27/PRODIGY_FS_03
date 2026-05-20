import { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  error?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export default function ErrorState({
  title = "Something went wrong",
  description = "We could not load this section right now.",
  error,
  actionLabel = "Retry",
  onAction,
  icon,
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-white">
      {icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20 text-red-300">
          {icon}
        </div>
      ) : null}

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-zinc-300">{description}</p>

      {error ? (
        <p className="mt-3 rounded-2xl border border-red-500/20 bg-black/20 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {onAction ? (
        <Button
          onClick={onAction}
          className="mt-5 rounded-xl bg-red-500 text-white hover:bg-red-600"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}