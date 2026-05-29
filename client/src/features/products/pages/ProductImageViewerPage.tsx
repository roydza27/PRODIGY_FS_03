// ProductImageViewerPage.tsx
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";

export default function ProductImageViewerPage() {
  const navigate = useNavigate();
  const { id, index } = useParams();

  const { product } = useProduct(id ?? "");

  const images = product?.images?.filter(Boolean) ?? [];
  const activeIndex = Math.min(
    Math.max(Number(index ?? 0) || 0, 0),
    Math.max(images.length - 1, 0)
  );

  const productUrl = `/products/${id}`;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate(productUrl);
      }

      if (event.key === "ArrowLeft") {
        navigate(
          `/products/${id}/images/${
            activeIndex === 0 ? images.length - 1 : activeIndex - 1
          }`
        );
      }

      if (event.key === "ArrowRight") {
        navigate(
          `/products/${id}/images/${
            activeIndex === images.length - 1 ? 0 : activeIndex + 1
          }`
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, id, images.length, navigate, productUrl]);

  if (!images.length) return null;

  const previous = () => {
    navigate(
      `/products/${id}/images/${
        activeIndex === 0 ? images.length - 1 : activeIndex - 1
      }`
    );
  };

  const next = () => {
    navigate(
      `/products/${id}/images/${
        activeIndex === images.length - 1 ? 0 : activeIndex + 1
      }`
    );
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#111113]">
      <button
        type="button"
        onClick={() => navigate(productUrl)}
        className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-black/40 p-3 text-white hover:bg-black/60"
        aria-label="Close viewer"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={previous}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-3 text-white hover:bg-black/60 sm:left-6 sm:p-4"
        aria-label="Previous image"
      >
        <ChevronLeft />
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-3 text-white hover:bg-black/60 sm:right-6 sm:p-4"
        aria-label="Next image"
      >
        <ChevronRight />
      </button>

      <div className="flex h-screen items-center justify-center p-4 sm:p-8">
        <img
          src={images[activeIndex]}
          alt={product?.name ?? "Product image"}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-3 overflow-x-auto rounded-full border border-white/10 bg-black/30 p-2 backdrop-blur-sm">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            type="button"
            onClick={() => navigate(`/products/${id}/images/${idx}`)}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border sm:h-16 sm:w-16 ${
              idx === activeIndex ? "border-red-500" : "border-white/10"
            }`}
            aria-label={`Open image ${idx + 1}`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}