/**
 * order router
 */

export default {
  routes: [
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
