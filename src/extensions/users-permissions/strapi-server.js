const authRoutes      = require("./routes/auth");
const authControllers = require("./controllers/auth");

module.exports = ( plugin ) => {
    authControllers(plugin);

    authRoutes(plugin);
    
    return plugin;
};