const { validateCustomer } = require('../content-types/order/order.validation');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const data = ctx.request.body;

        await validateCustomer(data);

        const { hasFree } = data;

        if (hasFree) {
            await strapi.db.query('api::order.order').updateMany({
                where : {
                    isUsed : false,
                },
                data : {
                    isUsed : true,
                },
            });
        }

        const parsedProducts = data.products.filter( x => x.nodiscount === 0 );

        const newOrder = await strapi.entityService.create('api::order.order', {
            data : {
                ...data,
                products : parsedProducts,
                isUsed : hasFree,
            }
        });

        return newOrder;
    },
}));
