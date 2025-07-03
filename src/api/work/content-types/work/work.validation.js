const { yup, validateYupSchema } = require("../../../../helpers/validators");

const workSchema = yup
  .array()
  .of(
    yup
      .object()
      .shape({
        customer: yup.string().required(),
        customer_id: yup.string(),
        product: yup.string().required(),
        modificators: yup.array().of(
          yup.object().shape({
            value: yup.string().required(),
          })
        ),
        count: yup.number().required(),
        isOnline: yup.boolean(),
        branch: yup.number(),
        time: yup.string(),
      })
      .noUnknown()
      .strict()
  )
  .min(1)
  .required();

module.exports = {
  validateWork: validateYupSchema(workSchema),
};
