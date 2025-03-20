const {
    NotFoundError,
} = require("./errors");

const formatFields = require("./formatFields");

async function findOneByAny( value, MODEL, field, schema ) {
    const ctx = strapi.requestContext.get();

    const individualModel = MODEL.split(".")[1];
    
    const formattedFields = formatFields( schema );

    const item = await strapi.entityService.findMany( MODEL, {
        filters : {
            [field] : value,
        },
        fields   : formattedFields.fields,
        populate : formattedFields.populate,
    });

    if ( item.length === 0 ) {
        throw new NotFoundError(`${ individualModel } with ${ field } ${ value } not found`, {
            key  : `${ individualModel }.notFound`,
            path : ctx.request.path,
        });
    }

    return item[0];
}

module.exports = findOneByAny;