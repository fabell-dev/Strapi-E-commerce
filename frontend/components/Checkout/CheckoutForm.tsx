"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/ShopingCart/CartContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface BillingDetails {
  name: string;
  email: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  country: string;
}

type Step = "billing" | "payment" | "confirm";

export function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>("billing");

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: "",
    email: "",
    city: "",
    postalCode: "",
    addressLine1: "",
    country: "US",
  });

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateBilling = (): boolean => {
    if (
      !billingDetails.name ||
      !billingDetails.email ||
      !billingDetails.postalCode ||
      !billingDetails.addressLine1
    ) {
      setError("Completa todos los campos requeridos");
      return false;
    }
    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === "billing") {
      if (validateBilling()) {
        setCurrentStep("payment");
      }
    } else if (currentStep === "payment") {
      setCurrentStep("confirm");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("billing");
    } else if (currentStep === "confirm") {
      setCurrentStep("payment");
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!stripe || !elements) {
        setError("Stripe no está cargado");
        return;
      }

      if (cartItems.length === 0) {
        setError("Tu carrito está vacío");
        return;
      }

      // 1. Crear Payment Intent en backend
      const createRes = await fetch(
        `${STRAPI_URL}/api/orders/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            totalAmount: totalPrice,
            email: billingDetails.email,
          }),
        },
      );

      if (!createRes.ok) {
        throw new Error("Error al crear el pago");
      }

      const { clientSecret, orderId } = await createRes.json();

      // 2. Confirmar pago con CardElement
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              address: {
                line1: billingDetails.addressLine1,
                city: billingDetails.city,
                postal_code: billingDetails.postalCode,
                country: billingDetails.country,
              },
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Error en el pago");
        setLoading(false);
        return;
      }

      // Si el pago se completa
      if (paymentIntent?.status === "succeeded") {
        await fetch(`${STRAPI_URL}/api/orders/confirm-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId,
          }),
        });

        router.push("/checkout/success");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error en checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Formulario - 2 columnas */}
      <div className="lg:col-span-2">
        {/* Indicador de pasos */}
        <div className="mb-8 flex justify-between">
          <div
            className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition ${
              currentStep === "billing"
                ? "bg-blue-600 text-white"
                : currentStep === "payment"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            1. Dirección
          </div>
          <div className="w-4 flex items-center justify-center text-gray-400">
            →
          </div>
          <div
            className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition ${
              currentStep === "payment"
                ? "bg-blue-600 text-white"
                : currentStep === "billing"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            2. Pago
          </div>
          <div className="w-4 flex items-center justify-center text-gray-400">
            →
          </div>
          <div
            className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition ${
              currentStep === "confirm"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            3. Confirmar
          </div>
        </div>

        {/* Formulario por pasos */}
        <form onSubmit={handleSubmitPayment} className="space-y-6">
          {/* PASO 1: Datos de Facturación */}
          {(currentStep === "billing" || currentStep === "confirm") && (
            <div
              className={`p-6 border rounded-lg transition relative group ${
                currentStep === "confirm" ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Dirección de Envío</h3>
                {currentStep === "confirm" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep("billing");
                      setError("");
                    }}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Editar
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo *"
                    value={billingDetails.name}
                    onChange={handleBillingChange}
                    disabled={currentStep === "confirm"}
                    className="p-3 border rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={billingDetails.email}
                    onChange={handleBillingChange}
                    disabled={currentStep === "confirm"}
                    className="p-3 border rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="Ciudad *"
                    value={billingDetails.city}
                    onChange={handleBillingChange}
                    disabled={currentStep === "confirm"}
                    className="p-3 border rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Código postal *"
                    value={billingDetails.postalCode}
                    onChange={handleBillingChange}
                    disabled={currentStep === "confirm"}
                    className="p-3 border rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                  <select
                    name="country"
                    value={billingDetails.country}
                    onChange={handleBillingChange}
                    disabled={currentStep === "confirm"}
                    className="p-3 border rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="US">Estados Unidos</option>
                    <option value="MX">México</option>
                    <option value="ES">España</option>
                    <option value="AR">Argentina</option>
                    <option value="CO">Colombia</option>
                    <option value="CL">Chile</option>
                    <option value="BR">Brasil</option>
                    <option value="PE">Perú</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Dirección *"
                  value={billingDetails.addressLine1}
                  onChange={handleBillingChange}
                  disabled={currentStep === "confirm"}
                  className="p-3 border rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>
          )}

          {/* PASO 2: Información de Pago */}
          {(currentStep === "payment" || currentStep === "confirm") && (
            <div
              className={`p-6 border rounded-lg transition ${
                currentStep === "confirm" ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Información de Pago</h3>
                {currentStep === "confirm" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep("payment");
                      setError("");
                    }}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Editar
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">
                  Detalles de Tarjeta
                </label>
                <div
                  className={`p-4 border rounded ${
                    currentStep === "confirm" ? "bg-gray-100" : ""
                  }`}
                >
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424242",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#fa755a",
                        },
                      },
                      disabled: currentStep === "confirm",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mensajes de error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex gap-4 pt-6">
            {currentStep !== "billing" && (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={loading}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:cursor-not-allowed transition"
              >
                ← Atrás
              </button>
            )}
            {currentStep !== "confirm" ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Siguiente →
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:cursor-not-allowed transition"
                >
                  ← Cambiar Datos
                </button>
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Procesando..." : "✓ Confirmar Pago"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Resumen del Pedido - 1 columna */}
      <div className="lg:col-span-1">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>

          {/* Items */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map((item: any) => (
              <div
                key={`${item.id}-${item.variantIndex ?? "main"}`}
                className="flex justify-between items-center p-3 bg-white rounded border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {item.variantIndex !== undefined && item.color
                      ? `${item.name} - ${item.color}`
                      : item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="border-t border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Impuestos:</span>
              <span>Calcula en checkout</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Info de seguridad */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            🔒 Tu información está protegida con encriptación de nivel
            empresarial
          </div>
        </div>
      </div>
    </div>
  );
}
