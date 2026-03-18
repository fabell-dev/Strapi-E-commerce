/**
 * order controller
 */

import { factories } from "@strapi/strapi";
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async createPaymentIntent(ctx: any) {
      try {
        const { items, totalAmount } = ctx.request.body;

        if (!items || !totalAmount) {
          ctx.throw(400, "Items y totalAmount son requeridos");
        }

        // Crear payment intent en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalAmount * 100), // Stripe usa centavos
          currency: "usd",
          metadata: {
            userId: ctx.state.user?.id || "anonymous",
            itemsCount: items.length,
          },
        });

        // Guardar orden en Strapi
        const order = await strapi.entityService.create("api::order.order", {
          data: {
            items,
            totalAmount,
            stripePaymentId: paymentIntent.id,
            status: "pending",
            email: ctx.state.user?.email || ctx.request.body.email,
            user: ctx.state.user?.id,
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

        // Verificar estado del payment intent
        const paymentIntent =
          await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === "succeeded") {
          // Obtener la orden para acceder a los items
          const order = await strapi.entityService.findOne(
            "api::order.order",
            orderId,
          );

          if (order && order.items && Array.isArray(order.items)) {
            // Agrupar items por ID de producto para actualizar una sola vez por producto
            const itemsByProductId = new Map<number, any[]>();
            for (const item of order.items as any[]) {
              if (!itemsByProductId.has(item.id)) {
                itemsByProductId.set(item.id, []);
              }
              itemsByProductId.get(item.id)!.push(item);
            }

            // Procesar cada producto UNA SOLA VEZ
            for (const [productId, items] of itemsByProductId) {
              try {
                const product = (await strapi.entityService.findOne(
                  "api::product.product",
                  productId,
                  { populate: ["variants"] },
                )) as any;

                if (product) {
                  // Procesar todos los items de este producto
                  for (const item of items) {
                    if (
                      item.variantIndex !== undefined &&
                      item.variantIndex >= 0
                    ) {
                      // Es una variante
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
                      // Es el producto principal
                      const oldStock = product.stock;
                      const newStock = Math.max(
                        0,
                        oldStock - (item.quantity || 1),
                      );
                      product.stock = newStock;
                    }
                  }

                  // Guardar el producto UNA SOLA VEZ con todos los cambios
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

          // Actualizar orden a "completed"
          await strapi.entityService.update("api::order.order", orderId, {
            data: {
              status: "completed",
            },
          });

          ctx.body = { success: true, status: "completed" };
        } else {
          ctx.body = { success: false, status: paymentIntent.status };
        }
      } catch (error: any) {
        ctx.throw(500, `Error confirming payment: ${error.message}`);
      }
    },
  }),
);
