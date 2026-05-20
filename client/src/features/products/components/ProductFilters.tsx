import ProductSearchBar from "./ProductSearchBar";
import ProductSortSelect from "./ProductSortSelect";

type SortValue = "newest" | "price-asc" | "price-desc" | "name-asc";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortBy: SortValue;
  setSortBy: (value: SortValue) => void;
};

const categories = [
  "All",
  "electronics",
  "fashion",
  "home",
  "beauty",
  "sports",
  "books",
];

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
}: Props) {
  
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <ProductSearchBar value={search} onChange={setSearch} />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
        >
          {categories.map((item) => (
            <option key={item} value={item === "All" ? "" : item}>
              {item}
            </option>
          ))}
        </select>

        <ProductSortSelect value={sortBy} onChange={setSortBy} />
      </div>
    </div>
  );
}