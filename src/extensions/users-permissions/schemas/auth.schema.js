const { yup, validateYupSchema } = require("../../../helpers/validators");

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
}).strict().noUnknown();

const registerSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().length(10).required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(8)
      .required(),
  })
  .strict()
  .noUnknown();

module.exports = {
  validateLogin: validateYupSchema(loginSchema),
  validateRegister: validateYupSchema(registerSchema),
};
