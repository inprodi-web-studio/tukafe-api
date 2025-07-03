module.exports = (plugin) => {
  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/login",
    handler: "user.login",
    config: {
      auth: false,
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/register",
    handler: "user.register",
    config: {
      auth: false,
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/forgot",
    handler: "user.forgotPassword",
    config: {
      auth: false,
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/validate",
    handler: "user.validateCode",
    config: {
      auth: false,
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/reset",
    handler: "user.resetPassword",
    config: {
      auth: false,
      prefix: "",
    },
  });
};
