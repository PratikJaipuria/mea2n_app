module.exports = function (app) {
    var mongoose = require('mongoose');
    var passport = require("passport");
    var connectionString = 'mongodb://127.0.0.1:27017/mea2n_app';
    var model = require("./model/model.server.js")();

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

    mongoose.connect(connectionString);
    require("./services/user.service.server")(app, model);
    require("./services/passport.service.server")(passport, model);

};