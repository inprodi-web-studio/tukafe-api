const { yup, validateYupSchema } = require("../../../../helpers/validators");

const couponSchema = yup.object().shape({
  coupon: yup.string().required(),
  total: yup.number().required(),
  products: yup.array().of(yup.string()).required(),
});

module.exports = {
  validateCoupon: validateYupSchema(couponSchema),
};
