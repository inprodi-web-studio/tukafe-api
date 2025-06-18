const axios = require("axios");
const { validateCustomer } = require("../content-types/order/order.validation");

const { createCoreController } = require("@strapi/strapi").factories;

const randomId = () => {
  const posibleIds = ["34", "94", "91", "33"];

  return posibleIds[Math.floor(Math.random() * posibleIds.length)];
};

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async fix(ctx) {
    const orders = await strapi.db.query("api::order.order").findMany({
      where: {
        isUsed: false,
      },
      select: ["id"],
      populate: {
        products: {
          populate: {
            modificators: true,
          },
        },
      },
    });

    let posterProducts = [];

    await axios
      .get(
        "https://joinposter.com/api/menu.getProducts?token=182720:8145958cd583496ec02d4cd60b03bebf"
      )
      .then((res) => {
        posterProducts = res.data.response;
      });

    for (const order of orders) {
      const newProducts = order.products;
      let requiresUpdate = false;

      for (let i = 0; i < order.products.length; i++) {
        const product = order.products[i];

        const find = posterProducts?.find(
          (x) => Number(x.product_id) === Number(product.product_id)
        );

        if (find) {
          console.log(`El producto ${product.product_id} existe en poster`);
        } else {
          console.log(
            `procesando producto ${product.product_id} del pedido ${order.id}`
          );

          const idToAssign = randomId();

          newProducts[i].product_id = idToAssign;
          requiresUpdate = true;
        }
      }

      if (requiresUpdate) {
        await strapi.entityService.update("api::order.order", order.id, {
          data: {
            products: newProducts,
          },
        });

        console.log(`Actualizado pedido ${order.id}`);
      } else {
        console.log(`Pedido ${order.id} no requiere actualización`);
      }
    }

    return "success";
  },

  async create(ctx) {
    const data = ctx.request.body;

    await validateCustomer(data);

    const { hasFree } = data;

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
