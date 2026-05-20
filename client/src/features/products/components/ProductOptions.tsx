interface Color {
  id: string;
  hex: string;
  label?: string;
}

interface Props {
  colors: Color[];
  selectedColor: string;
  onColorChange: (id: string) => void;
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function ProductOptions({
  colors,
  selectedColor,
  onColorChange,
  sizes,
  selectedSize,
  onSizeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Colours */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0">
        <span className="w-20 shrink-0 text-sm font-medium text-zinc-300">
          Colour:
        </span>
        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label ?? color.id}
              onClick={() => onColorChange(color.id)}
              className="group relative flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110"
            >
              {/* Outer ring when selected */}
              <span
                className={[
                  "absolute inset-0 rounded-full border-2 transition-all duration-200",
                  selectedColor === color.id
                    ? "border-white scale-100 opacity-100"
                    : "border-transparent scale-90 opacity-0",
                ].join(" ")}
              />
              <span
                className="h-4 w-4 rounded-full shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0">
        <span className="w-20 shrink-0 text-sm font-medium text-zinc-300">
          Size:
        </span>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange(size)}
              className={[
                "h-9 min-w-[2.25rem] rounded-lg border px-3 text-xs font-semibold tracking-wide transition-all duration-150",
                selectedSize === size
                  ? "border-red-500 bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                  : "border-white/10 bg-white/4 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
              ].join(" ")}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}