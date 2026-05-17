import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice, getProductImage } from "@/features/products/utils/product.helpers";
import type { CartItem as CartItemType } from "../types/cart.types";

type Props = {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: Props) {
  const { product, quantity } = item;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row">
      <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-black/30 sm:w-28">
        <img
          src={product.images?.[0] || getProductImage(product)}
          alt={product.name}
          className="h-full w-full object-contain p-3"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-white">{product.name}</h2>
          <p className="line-clamp-2 text-sm text-zinc-400">
            {product.description}
          </p>
          <p className="text-sm font-semibold text-red-400">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-xl border border-white/10">
            <button
              type="button"
              onClick={onDecrease}
              className="grid h-10 w-10 place-items-center bg-black/20 transition hover:bg-black/40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="grid h-10 w-12 place-items-center border-x border-white/10 text-sm font-medium text-white">
              {quantity}
            </div>
            <button
              type="button"
              onClick={onIncrease}
              className="grid h-10 w-10 place-items-center bg-black/20 transition hover:bg-black/40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-zinc-300 transition hover:border-red-500/40 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}