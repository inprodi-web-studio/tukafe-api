const { default: axios } = require("axios");
const { USER, ORDER } = require("../../../constants/models");
const findOneByAny = require("../../../helpers/findOneByAny");
const generateToken = require("../../../helpers/generateToken");
const validatePassword = require("../../../helpers/validatePassword");
const { validateLogin, validateRegister } = require("../schemas/auth.schema");
const qs = require("qs");
const https = require("https");
const poster = axios.create({
  timeout: 10000,
  httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }),
});

const userFields = {
    fields : ["email", "name", "lastName", "phone", "posterId"],
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

        let posterId = user.posterId;

        if (!user.posterId) {
            const posterRequest = await axios.get("https://joinposter.com/api/clients.getClients", {
                params : {
                    token : process.env.POSTER_TOKEN,
                    phone : data.phone,
                }
            });
    
            const posterUser = posterRequest?.data?.response?.[0];

            posterId = posterUser?.client_id ?? "0";

            if (posterUser) {
                await strapi.documents(USER).update({
                    id : user.id,
                    data : {
                        posterId : posterUser.client_id,
                    }
                });
            }
        }

        const lastOrders = await strapi.documents(ORDER).findFirst({
            filters : {
                customer_id : posterId,
                isUsed : false,
            },
            sort : "createdAt:desc",
            populate : "*",
            pagination : {
                limit : 1,
            }
        });

        const token = generateToken({
            id : user.id,
        });

        delete user.password;

        return {
            token,
            user,
            lastOrders,
        };
    };

    plugin.controllers.user["register"] = async (ctx) => {
        const data = ctx.request.body;

        await validateRegister(data);

        const {
            phone,
            email
        } = data;


        // Check if exists internal
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

        // Check if exists in poster
        const posterRequest = await axios.get("https://joinposter.com/api/clients.getClients", {
            params : {
                token : process.env.POSTER_TOKEN,
                phone : data.phone,
            }
        });

        const posterUser = posterRequest?.data?.response?.[0];

        if (posterUser) {
            const user = await strapi.documents(USER).create({
                data : {
                    ...data,
                    role : 1,
                    username : data.email,
                    password : data.password,
                    posterId : posterUser.client_id
                },
                ...userFields,
            });

            await poster.post("https://joinposter.com/api/clients.updateClient", qs.stringify({
                client_id : posterUser.client_id,
                client_name : data.name + " " + data.lastName,
                email : data.email,
            }), {
              params: { token: process.env.POSTER_TOKEN },
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).catch(err => console.log(err));
    
            return user;
        } else {
            const createdPosterUser = await poster.post("https://joinposter.com/api/clients.createClient", qs.stringify({
                client_name : data.name + " " + data.lastName,
                phone : data.phone,
                email : data.email,
                "client_sex": 0,
                "client_groups_id_client" : "1",
                "skip_phone_validation": true
            }), {
              params: { token: process.env.POSTER_TOKEN },
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).catch(err => console.log(err));

            const user = await strapi.documents(USER).create({
                data : {
                    ...data,
                    role : 1,
                    username : data.email,
                    password : data.password,
                    posterId : String(createdPosterUser?.data?.response ?? 0),
                },
                ...userFields,
            });

            return user;
        }
    };
}