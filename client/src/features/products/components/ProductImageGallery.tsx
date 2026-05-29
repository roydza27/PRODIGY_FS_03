import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  images: string[];
  productName: string;
  productId: string;
}

export default function ProductImageGallery({
  images,
  productName,
  productId,
}: Props) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const activeImage = safeImages[active] ?? safeImages[0] ?? "";

  useEffect(() => {
    setActive(0);
  }, [safeImages]);

  const openViewer = () => {
    if (!safeImages.length) return;
    navigate(`/products/${productId}/images/${active}`);
  };

  if (!safeImages.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] text-sm text-zinc-400 sm:rounded-3xl">
        No image available
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start xl:grid-cols-[96px_minmax(0,1fr)] xl:gap-5">
      <div className="order-2 flex max-w-full gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1">
        {safeImages.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => setActive(idx)}
            className={[
              "relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-1.5 transition-all duration-200 sm:h-20 sm:w-20 lg:h-[88px] lg:w-[88px] lg:rounded-2xl lg:p-2",
              active === idx
                ? "border-red-500/70 bg-white/8 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/6",
            ].join(" ")}
          >
            {active === idx && (
              <span className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-red-500/40 lg:rounded-2xl" />
            )}
            <img
              src={img}
              alt={`${productName} view ${idx + 1}`}
              className="h-full w-full rounded-lg bg-white object-contain object-center"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={openViewer}
        className="order-1 relative aspect-square w-full overflow-hidden rounded-2xl border border-white/8 bg-white sm:rounded-3xl lg:order-2 cursor-zoom-in"
        aria-label={`Open full view of ${productName}`}
      >
        <img
          src={activeImage}
          alt={productName}
          className="absolute inset-0 h-full w-full bg-white object-contain object-center transition-opacity duration-200"
        />

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-900/5 via-transparent to-transparent sm:rounded-3xl" />

        <div className="absolute bottom-3 right-3 z-10 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-sm sm:bottom-4 sm:right-4 sm:px-3 sm:text-[11px]">
          {active + 1} / {safeImages.length}
        </div>
      </button>
    </div>
  );
}