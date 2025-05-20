const { USER } = require("../../../constants/models");
const findOneByAny = require("../../../helpers/findOneByAny");
const generateToken = require("../../../helpers/generateToken");
const validatePassword = require("../../../helpers/validatePassword");
const { validateLogin, validateRegister } = require("../schemas/auth.schema");

const userFields = {
    fields : ["email", "name", "middleName", "lastName", "phone"],
};

module.exports = (plugin) => {
    plugin.controllers.user["login"] = async (ctx) => {
        const data = ctx.request.body;

        await validateLogin(data);

        const {
            phone,
            password,
        } = data;

        const user = await findOneByAny(phone, USER, "phone", { fields: [...userFields.fields, "password"] });

        await validatePassword(password, user.password);

        if (!user) {
            return ctx.throw(401, "Invalid credentials");
        }

        const token = generateToken({
            id : user.id,
        });

        delete user.password;

        return {
            token,
            user,
        };
    };

    plugin.controllers.user["register"] = async (ctx) => {
        const data = ctx.request.body;

        await validateRegister(data);

        const {
            phone,
            email
        } = data;

        const phoneUser = await strapi.documents(USER).findFirst({
            filters : {
                phone,
            }
        });

        if (phoneUser) {
            return ctx.throw(400, "Phone already exists", { details : "user.duplicatedPhone" });
        }

        const emailUser = await strapi.documents(USER).findFirst({
            filters : {
                email,
            }
        });

        if (emailUser) {
            return ctx.throw(400, "Email already exists", { details : "user.duplicatedEmail" });
        }

        const user = await strapi.documents(USER).create({
            data : {
                ...data,
                username : data.email,
                password : data.password,
            }
        });

        return {
            user,
        };
    };
}