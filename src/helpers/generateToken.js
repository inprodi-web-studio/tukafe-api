const jwt = require("jsonwebtoken");

const generateToken = (payload, jwtOptions) => {
    const defaultJwtOptions = strapi.config.get("plugin.users-permissions.jwt");
    const options = { ...defaultJwtOptions, ...jwtOptions };
    return jwt.sign(
      payload.toJSON ? payload.toJSON() : payload,
      strapi.config.get("plugin.users-permissions.jwtSecret"),
      options
    );
};

module.exports = generateToken;