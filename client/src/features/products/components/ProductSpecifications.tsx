type SpecItem = {
  label: string;
  value: string;
};

type Props = {
  title?: string;
  specs: SpecItem[];
};

export default function ProductSpecifications({
  title = "Product specifications",
  specs,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:p-7">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Core details about materials, size, compatibility, and more.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <div className="grid divide-y divide-white/8">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="grid gap-1 bg-black/20 px-4 py-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center sm:gap-4"
            >
              <div className="text-sm font-medium text-zinc-300">
                {spec.label}
              </div>
              <div className="text-sm text-zinc-400">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}