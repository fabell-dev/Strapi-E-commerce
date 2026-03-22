/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import * as jwt from "jsonwebtoken";

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const extractUserFromToken = (ctx: any) => {
  const authHeader = ctx.request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  try {
    const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";
    return jwt.verify(token, jwtSecret) as any;
  } catch (error) {
    return null;
  }
};

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async getUserOrders(ctx: any) {
      try {
        const user = extractUserFromToken(ctx);
        if (!user || !user.id) {
          ctx.throw(401, "User not authenticated");
        }

        const orders = await strapi.entityService.findMany("api::order.order", {
          fields: [
            "id",
            "items",
            "totalAmount",
            "status",
            "shippingAddress",
            "createdAt",
            "stripePaymentId",
            "cardLastFour",
            "cardBrand",
          ],
          filters: {
            user: user.id,
          },
          populate: {
            user: {
              fields: ["id", "username", "email"],
            },
          },
          start: 0,
          limit: 100,
        });

        ctx.body = { data: orders };
      } catch (error: any) {
        ctx.throw(500, `Error fetching orders: ${error.message}`);
      }
    },

    async getUserOrder(ctx: any) {
      try {
        const user = extractUserFromToken(ctx);
        if (!user || !user.id) {
          ctx.throw(401, "User not authenticated");
        }

        const { id } = ctx.params;

        const order = (await strapi.entityService.findOne(
          "api::order.order",
          id,
          {
            fields: [
              "id",
              "items",
              "totalAmount",
              "status",
              "shippingAddress",
              "createdAt",
              "stripePaymentId",
              "cardLastFour",
              "cardBrand",
            ],
            populate: {
              user: {
                fields: ["id", "username", "email"],
              },
            },
          },
        )) as any;

        if (!order) {
          ctx.throw(404, "Order not found");
        }

        if (order.user?.id !== user.id) {
          ctx.throw(403, "You can only view your own orders");
        }

        ctx.body = { data: order };
      } catch (error: any) {
        ctx.throw(500, `Error fetching order: ${error.message}`);
      }
    },

    async createPaymentIntent(ctx: any) {
      try {
        const user = extractUserFromToken(ctx);
        const { items, totalAmount, shippingAddress } = ctx.request.body;

        if (!items || !totalAmount) {
          ctx.throw(400, "Items y totalAmount son requeridos");
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100),
          currency: "usd",
          metadata: {
            userId: user?.id || "anonymous",
            itemsCount: items.length,
          },
        });

        const order = await strapi.entityService.create("api::order.order", {
          data: {
            items,
            totalAmount,
            stripePaymentId: paymentIntent.id,
            status: "pending",
            email: user?.email || ctx.request.body.email,
            user: user?.id,
            shippingAddress: shippingAddress || null,
          },
        });

        ctx.body = {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          orderId: order.id,
        };
      } catch (error: any) {
        ctx.throw(500, `Error creating payment intent: ${error.message}`);
      }
    },

    async confirmPayment(ctx: any) {
      try {
        const { paymentIntentId, orderId } = ctx.request.body;

        if (!paymentIntentId || !orderId) {
          ctx.throw(400, "paymentIntentId y orderId son requeridos");
        }

        const paymentIntent =
          await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === "succeeded") {
          // Extract card details from payment method
          let cardLastFour = null;
          let cardBrand = null;

          if (paymentIntent.payment_method) {
            try {
              const paymentMethod = await stripe.paymentMethods.retrieve(
                paymentIntent.payment_method as string,
              );
              cardLastFour = paymentMethod.card?.last4 || null;
              cardBrand = paymentMethod.card?.brand || null;
            } catch (error) {
              console.error("Error retrieving payment method:", error);
            }
          }
          const order = await strapi.entityService.findOne(
            "api::order.order",
            orderId,
          );

          if (order && order.items && Array.isArray(order.items)) {
            const itemsByProductId = new Map<number, any[]>();
            for (const item of order.items as any[]) {
              if (!itemsByProductId.has(item.id)) {
                itemsByProductId.set(item.id, []);
              }
              itemsByProductId.get(item.id)!.push(item);
            }

            for (const [productId, items] of itemsByProductId) {
              try {
                const product = (await strapi.entityService.findOne(
                  "api::product.product",
                  productId,
                  { populate: ["variants"] },
                )) as any;

                if (product) {
                  for (const item of items) {
                    if (
                      item.variantIndex !== undefined &&
                      item.variantIndex >= 0
                    ) {
                      if (
                        product.variants &&
                        product.variants[item.variantIndex]
                      ) {
                        const oldStock =
                          product.variants[item.variantIndex].stock;
                        const newStock = Math.max(
                          0,
                          oldStock - (item.quantity || 1),
                        );
                        product.variants[item.variantIndex].stock = newStock;
                      }
                    } else {
                      const oldStock = product.stock;
                      const newStock = Math.max(
                        0,
                        oldStock - (item.quantity || 1),
                      );
                      product.stock = newStock;
                    }
                  }

                  const updateData: any = {};
                  if (product.variants) {
                    updateData.variants = product.variants;
                  }
                  if (items.some((i: any) => i.variantIndex === undefined)) {
                    updateData.stock = product.stock;
                  }

                  await strapi.entityService.update(
                    "api::product.product",
                    productId,
                    { data: updateData },
                  );
                }
              } catch (error) {
                console.error(
                  `[STOCK UPDATE] Error updating product ${productId}:`,
                  error,
                );
              }
            }
          }

          await strapi.entityService.update("api::order.order", orderId, {
            data: {
              status: "completed",
              cardLastFour,
              cardBrand,
            },
          });

          ctx.body = {
            success: true,
            status: "completed",
            cardLastFour,
            cardBrand,
          };
        } else {
          ctx.body = { success: false, status: paymentIntent.status };
        }
      } catch (error: any) {
        ctx.throw(500, `Error confirming payment: ${error.message}`);
      }
    },
  }),
);
