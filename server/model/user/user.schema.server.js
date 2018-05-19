module.exports = function () {
    var role=['ADMIN', 'USER'];

    var mongoose = require('mongoose');
    var UserSchema = mongoose.Schema({
            username:  {type: String, index: {unique: true}},
            // password: String,
            firstName: String,
            lastName: String,

            method: {
                type : String,
                enum : ['local', 'google'],
                required : true
            },
            local: {
                email: {
                    type: String,
                    lowercase : true
                },
                password:{
                    type : String
                }
            },
            google: {
                id: {
                    type : String
                },
                email: {
                    type : String,
                    lowercase: true
                }
            }

        }, {collection: 'user'});
    return UserSchema;
};