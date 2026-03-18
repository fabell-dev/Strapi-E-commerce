"use client";

import { useCart } from "@/components/ShopingCart/CartContext";
import { useEffect } from "react";

export default function page() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="p-8 bg-green-50 border border-green-200 rounded-lg text-center">
      <div className="mb-4 text-5xl">✓</div>
      <h3 className="text-2xl font-semibold text-green-700 mb-2">
        ¡Pago exitoso!
      </h3>
      <p className="text-green-600 mb-4">
        Tu orden ha sido procesada correctamente. Recibirás un email de
        confirmación pronto.
      </p>
    </div>
  );
}
