module.exports = {
  routes: [
    {
        method: "GET",
        path: "/cashback",
        handler: "cashback.find",
        config: {
            prefix: "",
        },
    }
  ],
};
