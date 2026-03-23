"use client";

import { useCart } from "@/components/ShopingCart/CartContext";
import { useEffect } from "react";
import { SuccessPayment } from "@/components/SuccessPayment";
import { useSearchParams } from "next/navigation";

export default function SuccessPageContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const cardLast4 = searchParams.get("cardLast4") || "****";

  useEffect(() => {
    clearCart();
  }, []);

  return <SuccessPayment orderId={orderId} cardLast4={cardLast4} />;
}
