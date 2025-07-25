const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::favorite.favorite', ({ strapi }) => ({
    async find(ctx) {
        const { user } = ctx.state || {};

        return await strapi.db.query('api::favorite.favorite').findMany({
            where: {
                user: user?.id,
            },
        });
    },
    async create(ctx) {
        const { user } = ctx.state || {};
        const { productId } = ctx.request.body || {};

        if (!productId) {
            return ctx.badRequest('Product ID is missing');
        }

        const current = await strapi.db.query('api::favorite.favorite').findOne({
            where: {
                user: user.id,
                product_id: productId,
            },
        });

        if (current) {
            return strapi.documents('api::favorite.favorite').delete({
                documentId : current.documentId,
            });
        } else {
            return strapi.documents('api::favorite.favorite').create({
                data: {
                    user: user.id,
                    product_id: productId,
                },
            });
        }

        return { ok: true };
    }
}));
