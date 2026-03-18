"use client";

import { CheckoutForm } from "@/components/Checkout/CheckoutForm";
import { useCart } from "@/components/ShopingCart/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Carrito vacío</h1>
          <p className="text-gray-600 mb-6">No hay productos en tu carrito.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Volver a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center px-4 mt-50 md:mt-25 ">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
