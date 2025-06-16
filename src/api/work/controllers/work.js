const { validateWork } = require('../content-types/work/work.validation');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::work.work', ({ strapi }) => ({
    async create(ctx) {
        const data = ctx.request.body;
    
        await validateWork(data);
    
        let promises = [];
    
        for (const item of data) {
            for (let i = 0; i < (item.count || 1); i++) {
                promises.push(
                    strapi.entityService.create('api::work.work', {
                        data: {
                            ...item,
                            isOnline: item.isOnline || false,
                            isDone : false,
                        },
                    })
                );
            }
        }
    
        const result = await Promise.all(promises);
        
        return result;
    }
}));
