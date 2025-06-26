const axios = require("axios");
const { validateOrder } = require("../content-types/order/order.validation");

const { createCoreController } = require("@strapi/strapi").factories;

const CASHBACK_PERCENT = 0.1;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body;

    await validateOrder(data);

    const { hasFree, isApp, totalPaid, cashbackUsed } = data;

    if (hasFree) {
      await strapi.db.query("api::order.order").updateMany({
        where: {
          isUsed: false,
          customer_id: data.customer_id,
        },
        data: {
          isUsed: true,
        },
      });
    }

    if (isApp) {
      const cashback = totalPaid * CASHBACK_PERCENT;

      const user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: { posterId: data.customer_id },
      });

      if (user) {
        await strapi.entityService.create("api::cashback.cashback", {
          data: {
            amount: cashback,
            user: user.id,
          },
        });
      }

      if (cashbackUsed) {
        await strapi.entityService.create("api::cashback.cashback", {
          data: { amount: -cashbackUsed },
        });
      }
    }

    const parsedProducts = data.products.filter((x) => x.nodiscount === "0");

    const newOrder = await strapi.entityService.create("api::order.order", {
      data: {
        ...data,
        products: parsedProducts,
        isUsed: hasFree,
      },
    });

    return newOrder;
  },
}));
