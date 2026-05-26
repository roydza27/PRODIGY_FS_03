import { useState } from "react";

interface Props {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);

  const activeImage = images[active] ?? images[0] ?? "";

  if (!images.length) {
    return (
      <div className="flex min-h-[520px] flex-1 items-center justify-center rounded-3xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] text-sm text-zinc-400">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="flex shrink-0 gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setActive(idx)}
            className={[
              "relative flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border p-2.5 transition-all duration-200",
              active === idx
                ? "border-red-500/70 bg-white/8 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/6",
            ].join(" ")}
          >
            {active === idx && (
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-red-500/40" />
            )}
            <img
              src={img}
              alt={`${productName} view ${idx + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>

      <div className="relative min-h-[520px] flex-1 overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02]">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-900/5 via-transparent to-transparent" />

        <img
          src={activeImage}
          alt={productName}
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-200"
        />

        <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-zinc-400 backdrop-blur-sm">
          {active + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}