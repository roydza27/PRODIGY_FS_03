import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/features/products/types/product.types";
import type { CartItem } from "../types/cart.types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const API_URL = "http://localhost:5000/api";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => sessionStorage.getItem("token");

  const normalizeCartItems = (cart: any): CartItem[] => {
    if (!cart?.items) return [];
    return cart.items.map((item: any) => ({
      product: item.product,
      quantity: item.quantity,
    }));
  };

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    const res = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to load cart");
    }

    setItems(normalizeCartItems(data.cart));
    setLoading(false);
  };

  useEffect(() => {
    fetchCart().catch(() => setLoading(false));
  }, []);

  const addToCart = async (product: Product, quantity = 1) => {
    const token = getToken();
    if (!token) throw new Error("No token provided");

    const res = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        quantity,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to add to cart");
    }

    await fetchCart();
  };

  const removeFromCart = async (productId: string) => {
    const token = getToken();
    if (!token) throw new Error("No token provided");

    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to remove item");
    }

    await fetchCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    const token = getToken();
    if (!token) throw new Error("No token provided");

    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to update quantity");
    }

    await fetchCart();
  };

  const clearCart = async () => {
    const token = getToken();
    if (!token) throw new Error("No token provided");

    const res = await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to clear cart");
    }

    await fetchCart();
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refetchCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}