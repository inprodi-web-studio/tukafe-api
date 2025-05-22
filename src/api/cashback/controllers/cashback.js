const { CASHBACK } = require('../../../constants/models');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(CASHBACK, ({ strapi }) => ({
    async find(ctx) {
        const { user } = ctx.state;

        const cashbacks = await strapi.db.query(CASHBACK).findMany({
            where : {
                user : user.id,
            },
        });

        const total = cashbacks.reduce((acc, cashback) => acc + cashback.amount, 0);

        return { total };
    },  
}));
