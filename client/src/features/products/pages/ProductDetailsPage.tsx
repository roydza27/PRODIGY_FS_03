import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "@/features/cart/context/CartContext";
import { formatPrice, getProductImage } from "../utils/product.helpers";
import { toast } from "sonner";

import ProductBreadcrumb from "../components/ProductBreadcrumb";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import ProductOptions from "../components/ProductOptions";
import ProductActions from "../components/ProductActions";
import ProductDeliveryInfo from "../components/ProductDeliveryInfo";
import RelatedProducts from "../components/RelatedProducts";

const SIZES = ["XS", "S", "M", "L", "XL"];

const COLORS = [
  { id: "blue", hex: "#A0BCE0", label: "Blue" },
  { id: "red", hex: "#E07575", label: "Red" },
  { id: "green", hex: "#A9D18E", label: "Green" },
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { product, loading, error } = useProduct(id ?? "");
  const { products } = useProducts();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("red");
  const [cartLoading, setCartLoading] = useState(false);

  /* ── Derived data ── */
  const images = useMemo(() => {
    if (!product) return [];
    const base = product.images?.filter(Boolean) ?? [];
    const fallback = [getProductImage(product)];
    const combined = base.length ? base : fallback;
    return [...combined, ...combined, ...combined].slice(0, 4);
  }, [product]);

  const relatedItems = useMemo(() => {
    if (!product) return [];
    const sameCategory = products
      .filter(
        (p) =>
          p._id !== product._id &&
          p.category?.toLowerCase() === product.category?.toLowerCase()
      )
      .slice(0, 4);
    return sameCategory.length
      ? sameCategory
      : products.filter((p) => p._id !== product._id).slice(0, 4);
  }, [products, product]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(product?.category
      ? [{ label: product.category, href: `/products?category=${product.category}` }]
      : []),
    { label: product?.name ?? "…" },
  ];

  /* ── Handlers ── */
  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    try {
      await addToCart(product, quantity);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = () => {
    toast.info("Redirecting to checkout…");
    // navigate("/checkout") — wire up when ready
  };

  /* ── States ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111113] px-4 py-10 text-white md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Skeleton shimmer */}
          <div className="grid gap-8 xl:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-white/5" />
            <div className="flex flex-col gap-4 rounded-3xl bg-white/5 p-8 animate-pulse">
              {[40, 28, 20, 16, 16].map((h, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/8"
                  style={{ height: h, width: i === 0 ? "70%" : i === 2 ? "40%" : "90%" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111113] px-4 text-center">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-red-300">
          <p className="text-lg font-semibold">Product not found</p>
          <p className="mt-2 text-sm text-red-400/60">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-xl bg-red-500/20 px-6 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111113] text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">

        <ProductBreadcrumb crumbs={breadcrumbs} />

        {/* Main grid */}
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] xl:gap-12">

          {/* LEFT — Gallery */}
          <ProductImageGallery images={images} productName={product.name} />

          {/* RIGHT — Info panel */}
          <div className="flex flex-col gap-6 rounded-3xl border border-white/8 bg-white/[0.025] p-6 sm:p-7 lg:p-9">

            <ProductInfo
              name={product.name}
              category={product.category}
              price={formatPrice(product.price)}
              description={product.description}
              rating={4}
              reviewCount={150}
              inStock={true}
            />

            <ProductOptions
              colors={COLORS}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              sizes={SIZES}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />

            <ProductActions
              quantity={quantity}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
              loading={cartLoading}
            />

            <ProductDeliveryInfo />
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts products={relatedItems} formatPrice={formatPrice} />

      </main>
    </div>
  );
}