import { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";

type PageStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: PageStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white">
      {icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20 text-zinc-300">
          {icon}
        </div>
      ) : null}

      <h3 className="text-lg font-semibold">{title}</h3>

      {description ? (
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
      ) : null}

      {actionLabel && onAction ? (
        <Button
          onClick={onAction}
          className="mt-5 rounded-xl bg-red-500 hover:bg-red-600"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

type SkeletonListProps = {
  rows?: number;
};

export function TableSkeleton({ rows = 5 }: SkeletonListProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-5">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded-xl bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ rows = 8 }: SkeletonListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
        >
          <div className="aspect-square animate-pulse bg-white/10" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-full animate-pulse rounded bg-white/10" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}