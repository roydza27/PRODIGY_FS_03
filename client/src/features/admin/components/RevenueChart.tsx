import type { AnalyticsPoint } from "../services/analytics.service";

type Props = {
  title: string;
  data: AnalyticsPoint[];
  emptyLabel?: string;
};

export default function RevenueChart({ title, data, emptyLabel }: Props) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Monthly trend view based on your current data.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-zinc-400">
          {emptyLabel || "No data available."}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex h-72 items-end gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            {data.map((point) => {
              const height = Math.max((point.value / max) * 100, 8);

              return (
                <div key={point.label} className="flex-1">
                  <div className="flex h-full flex-col justify-end">
                    <div
                      className="rounded-t-xl bg-red-500/80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((point) => (
              <div
                key={point.label}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <p className="text-xs text-zinc-500">{point.label}</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {point.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}