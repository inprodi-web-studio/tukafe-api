const { yup, validateYupSchema } = require("../../../../helpers/validators");

const orderSchema = yup.object().shape({
    "customer_id" : yup.string().required(),
    "hasFree"     : yup.boolean().required(),
    "products" : yup.array().of(yup.object().shape({
        "product_id" : yup.string().required(),
        "count" : yup.number().required(),
        "modificators" : yup.array().of(yup.object().shape({
            "modificator_id" : yup.number().required(),
            "count" : yup.number().required(),
        }).noUnknown().strict()).nullable(),
        "category_id" : yup.string().required(),
    }).noUnknown().strict()).min(1).required(),
}).noUnknown().strict();

module.exports = {
    validateCustomer : validateYupSchema(orderSchema),
};