/**
 * order router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/orders",
      handler: "api::order.order.getUserOrders",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "api::order.order.getUserOrder",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/create-payment-intent",
      handler: "api::order.order.createPaymentIntent",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/confirm-payment",
      handler: "api::order.order.confirmPayment",
      config: {
        auth: false,
      },
    },
  ],
};
