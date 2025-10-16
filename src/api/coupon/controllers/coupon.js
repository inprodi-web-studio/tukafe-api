const { COUPON } = require("../../../constants/models");
const { NotFoundError } = require("../../../helpers/errors");
const { validateCoupon } = require("../content-types/coupon/coupon.validation");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::coupon.coupon", ({ strapi }) => ({
  async validate(ctx) {
    const data = ctx.request.body;

    await validateCoupon(data);

    const coupons = await strapi.entityService.findMany(COUPON, {
      filters: {
        code: data.coupon,
      },
    });

    if (coupons.length === 0) {
      return ctx.throw(404, "Coupon not found", {
        details: "coupon.notFound",
      });
    }

    const coupon = coupons[0];

    const now = new Date();

    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return ctx.throw(404, "Coupon not found", {
        details: "coupon.notFound",
      });
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return ctx.throw(400, "Coupon expired", {
        details: "coupon.expired",
      });
    }

    if (coupon.useLimit) {
      const orders = await strapi.entityService.findMany("api::order.order", {
        filters: {
          coupon: coupon.id,
        },
      });

      if (orders.length >= coupon.useLimit) {
        return ctx.throw(400, "Coupon limit reached", {
          details: "coupon.limitReached",
        });
      }
    }

    if (coupon.type === "amount" && data.total < coupon.discount) {
      return ctx.throw(400, "Coupon amount too low", {
        details: "coupon.amountTooLow",
      });
    }

    if (coupon.products && coupon.products.length > 0) {
      const productsWithDiscount = [];

      for (const product of coupon.products) {
        if (data.products.includes(product)) {
          productsWithDiscount.push(product);
        }
      }

      return {
        id: coupon.id,
        type: coupon.type,
        discount: coupon.discount,
        products: productsWithDiscount,
        code: coupon.code,
      };
    }

    return {
      id: coupon.id,
      type: coupon.type,
      discount: coupon.discount,
      products: [],
      code: coupon.code,
    };
  },
}));
