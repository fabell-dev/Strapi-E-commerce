"use server";

import { fetchOrders, fetchOrderById } from "@/lib/Strapi/Data/orders-data";
import { Order } from "@/types/orders.types";

export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await fetchOrders();
    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const order = await fetchOrderById(orderId);
    return order;
  } catch (error) {
    console.error("Error getting order by id:", error);
    return null;
  }
}
