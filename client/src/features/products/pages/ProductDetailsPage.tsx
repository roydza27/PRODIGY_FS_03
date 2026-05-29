// ProductDetailsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Copy, Heart } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/app/store/auth.store";
import { useCart } from "@/features/cart/context/CartContext";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";

import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";
import { formatPrice, getProductImage } from "../utils/product.helpers";
import { productService, type ProductReview } from "../services/product.service";

import ProductActions from "../components/ProductActions";
import ProductBreadcrumb from "../components/ProductBreadcrumb";
import ProductDeliveryInfo from "../components/ProductDeliveryInfo";
import ProductFAQ from "@/features/products/components/ProductFAQ";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import ProductOptions from "../components/ProductOptions";
import ProductReviews from "@/features/products/components/ProductReviews";
import ProductSpecifications from "@/features/products/components/ProductSpecifications";
import RelatedProducts from "../components/RelatedProducts";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { toggleWishlist, isWishlisted } = useWishlist();

  const { product, loading, error } = useProduct(id ?? "");
  const { products } = useProducts();

  const [canReview, setCanReview] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  const productColors = product && "colors" in product ? product.colors ?? [] : [];
  const productSizes = product && "sizes" in product ? product.sizes ?? [] : [];

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [copyingId, setCopyingId] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Do not call review endpoints without auth
    if (!isAuthenticated) {
      setCanReview(false);
      setReviews([]);
      return;
    }

    let alive = true;

    async function loadReviewData() {
      try {
        const [reviewStateRes, reviewsRes] = await Promise.all([
          productService.getReviewState(id),
          productService.getReviews(id),
        ]);

        if (!alive) return;

        setCanReview(reviewStateRes.canReview);
        setReviews(reviewsRes.reviews || []);
      } catch {
        if (!alive) return;
        setCanReview(false);
        setReviews([]);
      }
    }

    void loadReviewData();

    return () => {
      alive = false;
    };
  }, [id, isAuthenticated]);

  const images = useMemo(() => {
    if (!product) return [];

    const base = (product.images ?? []).filter(
      (img): img is string => Boolean(img)
    );

    const unique = Array.from(new Set(base));
    return unique.length > 0 ? unique : [getProductImage(product)];
  }, [product]);

  useEffect(() => {
    setSelectedSize(productSizes[0] ?? "");
  }, [productSizes]);

  useEffect(() => {
    setSelectedColor(productColors[0] ?? "");
  }, [productColors]);

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

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

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to proceed to checkout");
      navigate("/login");
      return;
    }

    if (!product) return;

    setCartLoading(true);
    try {
      await addToCart(product, quantity);
      navigate("/checkout");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to process order");
    } finally {
      setCartLoading(false);
    }
  };

  const handleSubmitReview = async ({
    rating,
    comment,
  }: {
    rating: number;
    comment: string;
  }) => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.info("Please log in to review this product");
      navigate("/login");
      return;
    }

    try {
      await productService.addReview(product._id, {
        rating,
        comment,
      });

      const [reviewStateRes, reviewsRes] = await Promise.all([
        productService.getReviewState(product._id),
        productService.getReviews(product._id),
      ]);

      setCanReview(reviewStateRes.canReview);
      setReviews(reviewsRes.reviews || []);
      toast.success("Review submitted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save items to your wishlist");
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      setWishlistLoading(true);
      const alreadySaved = isWishlisted(product._id);
      toggleWishlist(product);
      toast.success(alreadySaved ? "Removed from wishlist" : "Added to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCopyId = async () => {
    if (!product) return;

    try {
      setCopyingId(true);
      await navigator.clipboard.writeText(product._id);
      toast.success("Product ID copied");
    } catch {
      toast.error("Failed to copy product ID");
    } finally {
      setCopyingId(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111113] text-white">
        <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-4 text-sm text-zinc-300">
            Loading product...
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#111113] text-white">
        <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 text-center">
            <h1 className="text-xl font-semibold">Product not found</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {error ? "Failed to load product details." : "This product no longer exists."}
            </p>
            <Button className="mt-4" onClick={() => navigate("/products")}>
              Back to products
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111113] text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-10 lg:py-12">
        <ProductBreadcrumb crumbs={breadcrumbs} />

        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] xl:gap-12">
          <div className="min-w-0">
            <ProductImageGallery
              images={images}
              productName={product.name}
              productId={product._id}
            />
          </div>

          <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.025] p-4 sm:rounded-3xl sm:p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex flex-wrap items-start gap-6 sm:items-center">
              <span className="max-w-full rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                <span className="mr-1">ID:</span>
                <span className="font-mono break-all align-middle">{product._id}</span>
              </span>

              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-medium text-zinc-300 transition hover:bg-white/5"
              >
                <Copy className="h-3 w-3" />
                {copyingId ? "Copying..." : "Copy ID"}
              </button>

              {product.isFeatured ? (
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-400">
                  Featured
                </span>
              ) : null}
            </div>

            <div className="min-w-0 gap">
              <ProductInfo
                name={product.name}
                category={product.category}
                price={formatPrice(product.price)}
                description={product.description}
                rating={product.rating ?? 0}
                reviewCount={product.reviewCount ?? 0}
                inStock={(product.stock ?? 0) > 0}
                isWishlisted={isWishlisted(product._id)}
                onWishlistToggle={handleWishlist}
              />
            </div>

            <div className="min-w-0">
              <ProductOptions
                colors={productColors}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                sizes={productSizes}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />
            </div>

            <div className="min-w-0">
              <ProductActions
                quantity={quantity}
                onIncrement={() => setQuantity((q) => q + 1)}
                onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
                loading={cartLoading}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="h-12 w-full rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5"
            >
              <Heart
                className={`mr-2 h-4 w-4 ${
                  isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
            </Button>

            <ProductDeliveryInfo />
          </div>
        </div>

        <div className="mt-8 space-y-8 lg:mt-10 lg:space-y-10">
          <ProductSpecifications specs={product.specifications ?? []} />

          <ProductReviews
            averageRating={product.rating ?? 0}
            reviewCount={product.reviewCount ?? 0}
            reviews={reviews}
            canReview={canReview}
            onSubmitReview={handleSubmitReview}
          />

          <ProductFAQ items={product.faqs ?? []} />
          <RelatedProducts products={relatedItems} formatPrice={formatPrice} />
        </div>
      </main>
    </div>
  );
}