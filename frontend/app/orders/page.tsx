"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Order } from "@/types/orders.types";
import { getOrders } from "@/lib/actions/orders-actions";
import { getImageUrl } from "@/lib/utils/image-url";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  shipped: {
    label: "Sent",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  cancelled: {
    label: "Canceled",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="md:mx-40 mx-5 pt-50 sm:pt-30 md:pt-30">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="md:mx-40 mx-5 pt-50 sm:pt-30 md:pt-30 ">
      <div className="mb-8 ">
        <h1 className="text-2xl md:text-3xl mb-2 ">My Orders</h1>
        <p className="text-sm md:text-base text-gray-600">
          Check the state of your recent purchases
        </p>
      </div>

      <div className="flex flex-col gap-y-5">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-base md:text-lg truncate">
                      Order #{order.id}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${
                      statusConfig[order.status as keyof typeof statusConfig]
                        ?.className || "bg-gray-100 text-gray-800"
                    } text-xs whitespace-nowrap flex-shrink-0`}
                  >
                    {statusConfig[order.status as keyof typeof statusConfig]
                      ?.label || order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4 ">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex -space-x-2 flex-shrink-0">
                      {order.items.slice(0, 3).map((item, itemIndex) => (
                        <div
                          key={`order-${order.id}-item-${itemIndex}`}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-white bg-gray-100 overflow-hidden"
                        >
                          <img
                            src={getImageUrl(item.image.url)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center text-xs md:text-sm">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                        <Package className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "product" : "products"}
                        </span>
                      </div>
                      <div className="text-base md:text-lg mt-1">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">You have no orders yet</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
