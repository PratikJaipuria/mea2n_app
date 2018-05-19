module.exports = function () {
    var mongoose = require('mongoose');
    var q = require('q');
    const bcrypt = require('bcryptjs');
    var UserSchema = require('./user.schema.server.js')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    var api = {
        createUser: createUser,
        findUserByUsername: findUserByUsername,
        findAllUsers : findAllUsers,
        addUser : addUser,
        getUserByUsername : getUserByUsername,
        comparePassword : comparePassword,
        getUserById : getUserById,
        getGoogleUserById : getGoogleUserById,
        addGoogleUser : addGoogleUser
    };
    return api;


    function getUserById(id, callback){
        UserModel.findById(id, callback);
    }

    function comparePassword(candidatePassword, hash, callback){
        bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
            if(err) throw err;
            callback(null, isMatch);
        });
    }

    function getGoogleUserById(googleId, callback){
        const query = {"google.id": googleId};
        UserModel.findOne(query, callback);
    }

    function getUserByUsername(username, callback){
        const query = {username: username};
        UserModel.findOne(query, callback);
    }

    function addGoogleUser(profile, callback) {
        const newUser = new UserModel({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            },
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            username:profile.emails[0].value
        });
        newUser.save(callback);
    }

    function addUser(newUser, callback) {
        var user = new UserModel({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            method : 'local',
            local : {
                password: newUser.password,
                email: newUser.email
            }
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.local.password, salt, (err, hash) => {
                if(err) throw err;
                user.local.password = hash;
                user.save(callback);
            });
        });

    }

    function createUser(user) {
        var deferred= q.defer();
        UserModel.create(user, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function findAllUsers() {
        var deferred = q.defer();
        UserModel.find({}, function (err, users) {
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(users);
            }
        });
        return deferred.promise;
    }

    function findUserByUsername(username){
        var deferred=q.defer();
        UserModel.findOne({username: username}, function (err, user) {
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(user);
            }

        });
        return deferred.promise;
    }
};