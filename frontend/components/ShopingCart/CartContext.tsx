"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Product } from "@/types/product.types";

// ==================== TIPOS ====================
export interface CartItem extends Product {
  quantity: number;
  variantIndex?: number; // Index of the selected variant (if any)
}

export interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  updateQty: (id: number, delta: number, variantIndex?: number) => void;
  removeItem: (id: number, variantIndex?: number) => void;
  clearCart: () => void;
}

// ==================== SERVICIO localStorage ====================
const CART_KEY = "strapi_cart";

class LocalStorageCartService {
  getCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      return [];
    }
  }

  setCart(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error al guardar carrito:", error);
    }
  }

  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  }
}

const localStorageCart = new LocalStorageCartService();

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    const saved = localStorageCart.getCart();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(saved);
  }, []);

  // Guardar en localStorage cuando cambien los items
  useEffect(() => {
    localStorageCart.setCart(cartItems);
  }, [cartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = useCallback(
    (product: Product & { variantIndex?: number }) => {
      setCartItems((prev) => {
        // Check if same product AND same variant already exists
        const existing = prev.find(
          (i) =>
            i.id === product.id &&
            i.variantIndex === (product as any).variantIndex,
        );

        if (existing) {
          // Only increase if it doesn't exceed stock
          if (existing.quantity + 1 <= product.stock) {
            return prev.map((i) =>
              i.id === product.id &&
              i.variantIndex === (product as any).variantIndex
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            );
          }
          // Return unchanged if at max stock
          return prev;
        }

        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            variantIndex: (product as any).variantIndex,
          } as CartItem,
        ];
      });
    },
    [],
  );

  const updateQty = useCallback(
    (id: number, delta: number, variantIndex?: number) => {
      setCartItems((prev) =>
        prev
          .map((i) => {
            if (i.id === id && i.variantIndex === variantIndex) {
              // Prevent quantity from exceeding stock (only for increases)
              const newQty = i.quantity + delta;
              if (delta > 0 && newQty > i.stock) {
                return i; // Don't change if would exceed stock
              }
              return { ...i, quantity: newQty };
            }
            return i;
          })
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const removeItem = useCallback((id: number, variantIndex?: number) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && i.variantIndex === variantIndex)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de CartProvider");
  }
  return context;
}
