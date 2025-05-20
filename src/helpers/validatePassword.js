const bcrypt = require("bcryptjs");

const { NotFoundError } = require("./errors");

const validatePassword = async (password, hash) => {
    const ctx = strapi.requestContext.get();

    const isValidPassword = await bcrypt.compareSync( password, hash );

    if ( !isValidPassword ) {
        throw new NotFoundError(`user not found`, {
            key  : `user.notFound`,
            path : ctx.request.path,
        });
    }
};

module.exports = validatePassword;