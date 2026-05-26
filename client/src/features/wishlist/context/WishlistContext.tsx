// src/features/wishlist/context/WishlistContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/features/products/types/product.types";

type WishlistContextValue = {
  items: Product[];
  wishlistedIds: string[];
  loading: boolean;
  syncing: boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const WISHLIST_URL = `${API_BASE}/wishlist`;

function getProductId(product: Product) {
  const id =
    (product as Product & { id?: string })._id ??
    (product as Product & { id?: string }).id;

  if (!id) {
    throw new Error("Product ID is missing");
  }

  return String(id);
}

function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  let payload: any = null;

  try {
    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = text ? { message: text } : null;
    }
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Wishlist request failed (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
}

function normalizeWishlistData(input: unknown): Product[] {
  if (Array.isArray(input)) return input as Product[];

  if (input && typeof input === "object") {
    const data = (input as { data?: unknown }).data;

    if (Array.isArray(data)) return data as Product[];

    if (data && typeof data === "object") {
      const wishlist = (data as { wishlist?: unknown }).wishlist;
      if (Array.isArray(wishlist)) return wishlist as Product[];
    }
  }

  return [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await request<unknown>(WISHLIST_URL, {
        method: "GET",
      });

      setItems(normalizeWishlistData(res));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  const addToWishlist = useCallback(async (product: Product) => {
    const productId = getProductId(product);

    setError(null);

    setItems((prev) => {
      if (prev.some((item) => String(item._id) === productId)) return prev;
      return [...prev, product];
    });

    try {
      setSyncing(true);
      await request<{ success: boolean }>(`${WISHLIST_URL}/${productId}`, {
        method: "POST",
      });
    } catch (err) {
      setItems((prev) => prev.filter((item) => String(item._id) !== productId));
      setError(err instanceof Error ? err.message : "Failed to add item");
      throw err;
    } finally {
      setSyncing(false);
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!productId) {
      throw new Error("Product ID is missing");
    }

    setError(null);

    let removedItem: Product | null = null;
    setItems((prev) => {
      removedItem = prev.find((item) => String(item._id) === productId) ?? null;
      return prev.filter((item) => String(item._id) !== productId);
    });

    try {
      setSyncing(true);
      await request<{ success: boolean }>(`${WISHLIST_URL}/${productId}`, {
        method: "DELETE",
      });
    } catch (err) {
      if (removedItem) {
        setItems((prev) =>
          prev.some((item) => String(item._id) === String(removedItem!._id))
            ? prev
            : [...prev, removedItem!]
        );
      }

      setError(err instanceof Error ? err.message : "Failed to remove item");
      throw err;
    } finally {
      setSyncing(false);
    }
  }, []);

  const clearWishlist = useCallback(async () => {
    setError(null);

    const previous = items;
    setItems([]);

    try {
      setSyncing(true);
      await request<{ success: boolean }>(WISHLIST_URL, {
        method: "DELETE",
      });
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Failed to clear wishlist");
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [items]);

  const toggleWishlist = useCallback(
    async (product: Product) => {
      const productId = getProductId(product);
      const exists = items.some((item) => String(item._id) === productId);

      if (exists) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(product);
      }
    },
    [items, addToWishlist, removeFromWishlist]
  );

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => String(item._id) === productId),
    [items]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      wishlistedIds: items.map((item) => String(item._id)),
      loading,
      syncing,
      error,
      refreshWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      toggleWishlist,
      isWishlisted,
    }),
    [
      items,
      loading,
      syncing,
      error,
      refreshWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      toggleWishlist,
      isWishlisted,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return ctx;
}