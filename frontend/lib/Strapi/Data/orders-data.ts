import { queryAutenticatedUser } from "@/lib/Strapi/strapi";
import { Order } from "@/types/orders.types";

export const fetchOrders = async (): Promise<Order[]> => {
  return queryAutenticatedUser(
    "orders?populate=items.image,items.variants.image&sort=createdAt:desc",
  ).then((res) => {
    return res.data || [];
  });
};

export const fetchOrderById = async (
  orderId: string,
): Promise<Order | null> => {
  return queryAutenticatedUser(
    `orders/${orderId}?populate=items.image,items.variants.image`,
  ).then((res) => {
    return res.data || null;
  });
};
