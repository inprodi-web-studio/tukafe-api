module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/fix",
      handler: "order.fix",
      config: {
        auth: false,
      },
    },
  ],
};
