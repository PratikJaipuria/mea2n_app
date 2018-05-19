module.exports = function () {
    var model = {
        UserModel : require('./user/user.model.server')()
    };
    return model;
};