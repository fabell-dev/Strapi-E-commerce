"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "@/types/orders.types";
import { getOrderById } from "@/lib/actions/orders-actions";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    icon: Package,
  },
  shipped: {
    label: "Sent",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Canceled",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: CheckCircle2,
  },
};

export default function OrderDetail() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="md:mx-40 mx-5 pt-10 sm:pt-20 md:pt-20">
        <Link href="/orders">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading order...</p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="md:mx-40 mx-5 pt-10 sm:pt-20 md:pt-20">
        <Link href="/orders">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Order not found</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const statusKey = order.status as keyof typeof statusConfig;
  const StatusIcon = statusConfig[statusKey]?.icon || Package;
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const tax = subtotal * 0.21;

  return (
    <section className="md:mx-40 mx-5 pt-50 sm:pt-50 md:pt-30 pb-20">
      <Link href="/orders" className="hidden sm:block">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div className="flex  items-center justify-between">
            <h1 className="text-xl md:text-3xl break-words">
              Order #{order.id}
            </h1>
            <Link href="/orders" className="h-10 sm:hidden">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </Link>
          </div>
          <Badge
            className={`${
              statusConfig[statusKey]?.className || "bg-gray-100 text-gray-800"
            } text-xs self-start sm:self-auto whitespace-nowrap`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig[statusKey]?.label || order.status}
          </Badge>
        </div>
        <p className="text-sm md:text-base text-gray-600 break-words">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, itemIndex) => (
                  <div key={`item-${itemIndex}`}>
                    <div className="flex gap-3 md:gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_STRAPI_URL ||
                            "http://localhost:1337"
                          }${item.image.url}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base break-words line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm md:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {itemIndex < order.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-xs md:text-sm break-words">
                  {order.shippingAddress.name && (
                    <p>{order.shippingAddress.name}</p>
                  )}
                  {order.shippingAddress.street && (
                    <p>{order.shippingAddress.street}</p>
                  )}
                  {(order.shippingAddress.city ||
                    order.shippingAddress.state ||
                    order.shippingAddress.zipCode) && (
                    <p>
                      {order.shippingAddress.city}
                      {order.shippingAddress.state &&
                        `, ${order.shippingAddress.state}`}
                      {order.shippingAddress.zipCode &&
                        ` ${order.shippingAddress.zipCode}`}
                    </p>
                  )}
                  {order.shippingAddress.country && (
                    <p>{order.shippingAddress.country}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.cardBrand && order.cardLastFour ? (
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-gray-600">
                    Card Brand: <span className="font-semibold capitalize">{order.cardBrand}</span>
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Card Ending in: <span className="font-semibold">•••• {order.cardLastFour}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs md:text-sm text-gray-600">Card information not available</p>
              )}
              <Separator />
              <p className="text-xs md:text-sm break-words font-mono text-gray-600">
                Transaction ID: {order.stripePaymentId}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="overflow-hidden sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Tax (21%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-base md:text-lg font-bold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
