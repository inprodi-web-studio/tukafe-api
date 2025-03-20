const { yup, validateYupSchema } = require("../../../../helpers/validators");

const workSchema = yup.array().of(yup.object().shape({
    customer : yup.string().required(),
    product : yup.string().required(),
    modificators : yup.array().of(yup.object().shape({
        value : yup.string().required(),
    })),
    count : yup.number().required(),
}).noUnknown().strict()).min(1).required();

module.exports = {
    validateWork : validateYupSchema(workSchema),
};