import { useMemo, useState } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";
import { getEffectivePrice } from "../utils/product.helpers";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    const cat = category.toLowerCase().trim();

    let result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        !cat || (product.category || "").toLowerCase().includes(cat);

      return matchesSearch && matchesCategory;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "price-asc") return getEffectivePrice(a) - getEffectivePrice(b);
      if (sortBy === "price-desc") return getEffectivePrice(b) - getEffectivePrice(a);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [products, search, category, sortBy]);

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 text-zinc-400">
            Browse all available products.
          </p>
        </div>

        <div className="mb-6">
          <ProductFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#111113]/95 p-8 text-center text-zinc-400">
            Loading products...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && <ProductGrid products={filteredProducts} />}
      </div>
    </div>
  );
}