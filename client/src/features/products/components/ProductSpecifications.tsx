import type { SpecItem } from "@/features/products/components/ProductForm";

type Props = {
  title?: string;
  subtitle?: string;
  specs: SpecItem[];
};

export default function ProductSpecifications({
  title = "Product specifications",
  subtitle = "Core details about materials, size, compatibility, and more.",
  specs,
}: Props) {
  if (!specs.length) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-zinc-400">{subtitle}</p>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-zinc-400">
          No specifications available for this product.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="mb-5 flex flex-col gap-2 sm:mb-6 mx-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          {subtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/20">
        <div className="divide-y divide-white/8">
          {specs.map((spec, index) => (
            <div
              key={`${spec.label}-${index}`}
              className="grid gap-2 px-4 py-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center sm:gap-6"
            >
              <div className="text-sm font-medium text-zinc-300">
                {spec.label}
              </div>
              <div className="text-sm leading-relaxed text-zinc-400">
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}