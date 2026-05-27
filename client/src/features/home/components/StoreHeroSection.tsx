import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Search, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Link } from "react-router-dom";
import { productService } from "@/features/products/services/product.service";
import type { Product } from "@/features/products/types/product.types";

import ThreeDCarousel from "./ThreeDCarousel";
import type { ThreeDCarouselItem } from "./ThreeDCarousel";

type AnyProduct = Product & {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  coverImage?: string;
  poster?: string;
  banner?: string;
  images?: Array<string | { url?: string; secure_url?: string }>;
  media?: Array<string | { url?: string; secure_url?: string }>;
  gallery?: Array<string | { url?: string; secure_url?: string }>;
  price?: number;
  salePrice?: number;
  discountPrice?: number;
  currentPrice?: number;
  originalPrice?: number;
  mrp?: number;
  compareAtPrice?: number;
  regularPrice?: number;
  isFeatured?: boolean;
  featured?: boolean;
  category?: string;
};

type StoreHeroSectionProps = {
  products?: Product[];
};

function extractProducts(res: unknown): AnyProduct[] {
  if (Array.isArray(res)) return res as AnyProduct[];

  const data = res as {
    products?: AnyProduct[];
    data?: AnyProduct[] | { products?: AnyProduct[]; data?: AnyProduct[] };
    result?: { products?: AnyProduct[]; data?: AnyProduct[] };
  };

  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result?.products)) return data.result.products;
  if (Array.isArray(data?.result?.data)) return data.result.data;

  if (data?.data && !Array.isArray(data.data)) {
    const nested = data.data as { products?: AnyProduct[]; data?: AnyProduct[] };
    if (Array.isArray(nested.products)) return nested.products;
    if (Array.isArray(nested.data)) return nested.data;
  }

  return [];
}

function pickFeaturedProduct(products: AnyProduct[]) {
  return (
    products.find((p) => p.isFeatured || p.featured) ??
    products.find((p) => Boolean(p.image || p.imageUrl || p.thumbnail || p.coverImage || p.poster || p.banner)) ??
    products[0] ??
    null
  );
}

function getFeaturedImage(product: AnyProduct | null) {
  if (!product) return "";

  const imageFromArray = (arr?: Array<string | { url?: string; secure_url?: string }>) => {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    const first = arr[0];
    if (typeof first === "string") return first;
    return first?.secure_url || first?.url || "";
  };

  return (
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.coverImage ||
    product.poster ||
    product.banner ||
    imageFromArray(product.images) ||
    imageFromArray(product.media) ||
    imageFromArray(product.gallery) ||
    ""
  );
}

function getProductName(product: AnyProduct | null) {
  if (!product) return "Featured product";
  return product.name || product.title || "Featured product";
}

function getCurrentPrice(product: AnyProduct | null) {
  if (!product) return "—";

  const value =
    product.salePrice ??
    product.discountPrice ??
    product.currentPrice ??
    product.price ??
    0;

  return value ? `₹${Number(value).toLocaleString("en-IN")}` : "Price on request";
}

function getOldPrice(product: AnyProduct | null) {
  if (!product) return "";

  const value =
    product.originalPrice ??
    product.mrp ??
    product.compareAtPrice ??
    product.regularPrice ??
    0;

  return value ? `₹${Number(value).toLocaleString("en-IN")}` : "";
}

const StoreHeroSection = ({ products: productsProp }: StoreHeroSectionProps) => {
  const [fetchedProducts, setFetchedProducts] = useState<AnyProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      if (Array.isArray(productsProp) && productsProp.length > 0) {
        setFetchedProducts(productsProp as AnyProduct[]);
        setLoadingFeatured(false);
        return;
      }

      try {
        const res = await productService.getAll();
        const products = extractProducts(res);

        if (mounted) {
          setFetchedProducts(products);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        if (mounted) {
          setFetchedProducts([]);
        }
      } finally {
        if (mounted) setLoadingFeatured(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [productsProp]);

  const featuredProduct = useMemo(
    () => pickFeaturedProduct(fetchedProducts),
    [fetchedProducts]
  );

  const dynamicGroceriesItem = useMemo(() => {
    return fetchedProducts.find(p => {
      const matchText = `${p.name} ${p.title} ${p.category}`.toLowerCase();
      return matchText.includes("grocery") || matchText.includes("food") || matchText.includes("fresh");
    }) ?? fetchedProducts[1] ?? null;
  }, [fetchedProducts]);

  const dynamicEssentialsItem = useMemo(() => {
    return fetchedProducts.find(p => {
      const matchText = `${p.name} ${p.title} ${p.category}`.toLowerCase();
      return matchText.includes("essential") || matchText.includes("home") || matchText.includes("living");
    }) ?? fetchedProducts[2] ?? null;
  }, [fetchedProducts]);

  const carouselItems = useMemo<ThreeDCarouselItem[]>(() => {
    if (!fetchedProducts || fetchedProducts.length === 0) return [];
    
    const targets = fetchedProducts.filter(p => p.isFeatured || p.featured);
    const pool = targets.length > 0 ? targets : fetchedProducts;
    
    return pool.slice(0, 5).map((p) => ({
      id: p._id ?? p.id ?? Math.random().toString(),
      title: getProductName(p),
      brand: p.brand || p.category || "Zynta Exclusive",
      description: p.description || "Discover premium quality selections built for your clean shopping workflow experience.",
      price: getCurrentPrice(p),
      oldPrice: getOldPrice(p),
      imageUrl: getFeaturedImage(p),
      link: `/products/${p._id ?? p.id}`,
    }));
  }, [fetchedProducts]);

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_1fr]">
        
        {/* LEFT CARD CONTAINER */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(219,68,68,0.16),transparent_32%)]" />
          <div className="relative z-10 flex flex-col gap-8 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              <ShoppingBag className="h-3.5 w-3.5 text-[#DB4444]" />
              Zynta E-commerce Platform
            </div>

            <div className="max-w-2xl space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-400">
                New season arrivals
              </p>
              <h1 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[0.98]">
                Shop smarter with a clean, premium local store experience.
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                Discover curated products, fast browsing, simple cart actions, and a smooth shopping flow built for your internship project.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Search products, brands, categories..."
                  className="h-14 rounded-2xl border-white/10 bg-black/30 pl-11 text-base text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                />
              </div>
              <Link to="/products">
                <Button className="h-14 rounded-2xl bg-[#DB4444] px-6 text-white hover:bg-[#c53a3a]">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Fast checkout", value: "1-click cart flow" },
                { label: "Trusted store", value: "Quality local products" },
                { label: "Support ready", value: "Easy order help" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>          

          {/* INTERNAL SPREAD CARD WITH REAL DATA */}
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1 my-6 relative z-10">
            {loadingFeatured ? (
              <div className="h-44 flex items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/20 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading item profile...
              </div>
            ) : dynamicGroceriesItem ? (
              <Link 
                to={`/products/${dynamicGroceriesItem._id ?? dynamicGroceriesItem.id}`}
                className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition-all hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex flex-col md:flex-row gap-5 items-center">
                  <div className="flex-1 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#DB4444]">
                      In Stock Now
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white group-hover:text-[#DB4444] transition-colors">
                      {dynamicGroceriesItem.name || dynamicGroceriesItem.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 max-w-sm line-clamp-2">
                      {dynamicGroceriesItem.description || "Fresh selection curated directly from premium regional vendors."}
                    </p>
                    <p className="mt-4 text-xl font-bold text-white">
                      {getCurrentPrice(dynamicGroceriesItem)}
                    </p>
                  </div>
                  
                  <div className="h-32 w-full md:w-44 shrink-0 rounded-2xl overflow-hidden bg-black/30 border border-white/5">
                    {getFeaturedImage(dynamicGroceriesItem) ? (
                      <img 
                        src={getFeaturedImage(dynamicGroceriesItem)} 
                        alt="Promo display" 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-zinc-600">No Image</div>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left">
                <p className="text-sm text-zinc-500">Daily use items</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Fresh groceries</h3>
                <div className="mt-5 h-28 rounded-2xl border border-dashed border-white/10 bg-black/20" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CARD COLUMN */}
        <div className="grid gap-6 text-left overflow-visible">
          <div className="overflow-visible rounded-[28px] border border-white/10 bg-gradient-to-b from-[#161619] to-[#0f0f11] p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="flex items-center justify-between mb-6 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#DB4444]" />
                  <p className="text-xs uppercase font-medium tracking-[0.24em] text-zinc-400">
                    Featured Deals
                  </p>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Trending Arrivals
                </h2>
              </div>
              <span className="rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400 font-medium tracking-wide">
                Up to 30% Off
              </span>
            </div>

            <div className="w-full relative px-10 overflow-visible flex items-center justify-center">
              {/* FIXED: Conditionally block initialization until layout tokens are fully mounted */}
              {loadingFeatured || carouselItems.length === 0 ? (
                <div className="h-[450px] w-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-black/10 text-zinc-500 text-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-[#DB4444] mb-3" />
                  Populating carousel deck...
                </div>
              ) : (
                <ThreeDCarousel 
                  items={carouselItems} 
                  isLoading={false} 
                  cardHeight={550} 
                  rotateInterval={4500} 
                />
              )}
            </div>
          </div>

          {/* RIGHT SIDE SECONDARY CARD */}
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
            {loadingFeatured ? (
              <div className="h-36 flex items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/25 text-xs text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-[#DB4444]" />
                Loading side catalog...
              </div>
            ) : dynamicEssentialsItem ? (
              <Link
                to={`/products/${dynamicEssentialsItem._id ?? dynamicEssentialsItem.id}`}
                className="group block relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-lg transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-black/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#DB4444]/0 via-[#DB4444]/[0.02] to-[#DB4444]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 grid grid-cols-[1fr_auto] items-center gap-4">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Home Essentials
                      </p>
                      <span className="h-1 w-1 rounded-full bg-[#DB4444] animate-pulse" />
                    </div>
                    
                    <h3 className="text-lg font-medium text-white tracking-tight group-hover:text-[#DB4444] transition-colors duration-200 line-clamp-1">
                      {dynamicEssentialsItem.name || dynamicEssentialsItem.title}
                    </h3>
                    
                    <p className="text-xl font-semibold text-zinc-100">
                      {getCurrentPrice(dynamicEssentialsItem)}
                    </p>
                  </div>

                  <div className="h-20 w-20 shrink-0 relative overflow-hidden rounded-2xl bg-black/40 border border-white/10 shadow-inner">
                    {getFeaturedImage(dynamicEssentialsItem) ? (
                      <img 
                        src={getFeaturedImage(dynamicEssentialsItem)} 
                        alt="Essential product preview" 
                        className="h-full w-full object-cover filter brightness-[0.9] contrast-[1.05] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:brightness-100"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
                        Item
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left">
                <p className="text-sm text-zinc-500">Useful every day</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Home essentials</h3>
                <div className="mt-5 h-28 rounded-2xl border border-dashed border-white/10 bg-black/20" />
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StoreHeroSection;