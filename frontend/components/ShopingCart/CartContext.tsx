"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
