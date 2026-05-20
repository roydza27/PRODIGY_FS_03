type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";

type Props = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export default function ProductSortSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortValue)}
      className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A to Z</option>
    </select>
  );
}