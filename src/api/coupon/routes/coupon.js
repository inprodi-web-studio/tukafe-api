module.exports = {
  routes: [
    {
      method: "POST",
      path: "/coupons",
      handler: "coupon.validate",
      config: {
        prefix: "",
      },
    },
  ],
};
