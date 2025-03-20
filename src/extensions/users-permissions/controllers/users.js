module.exports = (plugin) => {
    plugin.controllers.user[""] = () => {
        return true;
    };
};