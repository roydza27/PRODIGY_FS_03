// features/products/components/ProductSortSelect.tsx
"use client";

type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";

type Props = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export default function ProductSortSelect({ value, onChange }: Props) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
        /* FIXED: 
           1. Added 'w-full' to stretch out and fill the side panel card boundaries cleanly.
           2. Changed bg color to solid transparent to match your inner wrapper ring context layout.
           3. Handled cursor selection tracking profiles natively.
        */
        className="h-10 w-full cursor-pointer rounded-xl border-none bg-transparent pl-3 pr-8 text-xs font-medium text-zinc-200 outline-none transition-colors hover:text-white appearance-none"
      >
        {/* FIXED DROP-MENU COLOR SCHEMES: 
            Adding the explicit 'bg-[#17171b]' overrides the native browser agent context, 
            forcing options to remain premium dark even on native operating system renders.
        */}
        <option value="newest" className="bg-[#17171b] text-zinc-300">
          Newest Arrivals
        </option>
        <option value="price-asc" className="bg-[#17171b] text-zinc-300">
          Price: Low to High
        </option>
        <option value="price-desc" className="bg-[#17171b] text-zinc-300">
          Price: High to Low
        </option>
        <option value="name-asc" className="bg-[#17171b] text-zinc-300">
          Name: A to Z
        </option>
      </select>

      {/* Styled Custom Chevron Indicator Arrow */}
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-3.5"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}