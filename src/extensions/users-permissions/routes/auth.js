module.exports = ( plugin ) => {
    plugin.routes["content-api"].routes.push({
        method  : "POST",
        path    : "/auth/login",
        handler : "user.login",
        config  : {
            auth : false,
            prefix : "",
        },
    });

    plugin.routes["content-api"].routes.push({
        method  : "POST",
        path    : "/auth/register",
        handler : "user.register",
        config  : {
            auth : false,
            prefix : "",
        },
    });
}