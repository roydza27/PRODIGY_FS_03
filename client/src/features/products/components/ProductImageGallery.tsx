import { useState } from "react";

interface Props {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-4 lg:flex-row flex-col-reverse">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible shrink-0">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setActive(idx)}
            className={[
              "relative flex h-[90px] w-[90px] shrink-0 items-center justify-center rounded-2xl border p-2.5 transition-all duration-200 overflow-hidden",
              active === idx
                ? "border-red-500/70 bg-white/8 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/6",
            ].join(" ")}
          >
            {active === idx && (
              <span className="absolute inset-0 rounded-2xl ring-1 ring-red-500/40 pointer-events-none" />
            )}
            <img
              src={img}
              alt={`${productName} view ${idx + 1}`}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02]">
        {/* Subtle ambient glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-900/5 via-transparent to-transparent" />

        <div className="flex aspect-square items-center justify-center p-8">
          <img
            src={images[active]}
            alt={productName}
            className="max-h-full max-w-full object-contain drop-shadow-2xl transition-opacity duration-200"
          />
        </div>

        {/* Image counter pill */}
        <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-zinc-400 backdrop-blur-sm">
          {active + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}