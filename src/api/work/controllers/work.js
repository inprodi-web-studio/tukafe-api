const { validateWork } = require('../content-types/work/work.validation');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::work.work', ({ strapi }) => ({
    async create(ctx) {
        const data = ctx.request.body;
    
        await validateWork(data);
    
        let promises = [];
    
        for (const item of data) {
            for (let i = 0; i < (item.count || 1); i++) {
                const time = item.time || "asap";
                let date;

                if (time === "asap") {
                    date = new Date();
                } else if (time === "15") {
                    date = new Date();
                    date.setMinutes(date.getMinutes() + 15);
                } else if (time === "30") {
                    date = new Date();
                    date.setMinutes(date.getMinutes() + 30);
                }

                promises.push(
                    strapi.entityService.create('api::work.work', {
                        data: {
                            ...item,
                            prepareIn : date,
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
