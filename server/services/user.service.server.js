module.exports = function (app,model) {

    var bcrypt = require("bcrypt-nodejs");
    const GooglePlusTokenStrategy = require('passport-google-plus-token');
    const passport = require('passport');
    const jwt = require('jsonwebtoken');
    const JwtStrategy = require('passport-jwt').Strategy;
    const ExtractJwt = require('passport-jwt').ExtractJwt;
    var UserModel = model.UserModel;

    app.post('/authenticate', authenticate);
    app.post("/register", register);
    app.get("/users", getAllUsers);
    app.get("/user/profile", passport.authenticate('jwt', {session:false}), profile);
    app.post("/oauth/google", passport.authenticate('googleToken', {session:false}), googleOAuth);



    passport.use('googleToken', new GooglePlusTokenStrategy({
        clientID: "793666480779-mk0fr11cd3nuhftncp3qkqr7pfcsnkqn.apps.googleusercontent.com",//config.oauth.google.clientID,
        clientSecret: "6awsCm7ddASWLVoLGJb24wQ8"//config.oauth.google.clientSecret
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Should have full user profile over here
            // console.log('profile', profile);
            // console.log('accessToken', accessToken);
            // console.log('refreshToken', refreshToken);

            UserModel
                .getGoogleUserById(profile.id, (err, user) =>{
                    const existingUser = user;
                    if(existingUser){
                        return done(null, existingUser);
                    }

                    UserModel
                        .addGoogleUser(profile,(err,user) => {
                            if(err){
                                done(null,err);
                            }else {
                                done(null,user);
                            }
                        });

                });
        } catch(error) {
            done(error, false, error.message);
        }
    }));


    function profile(req, res, next) {

            if(req.user.method==='google'){
                googleUser = req.user;
                let user = {
                        id: googleUser._id,
                        firstName: googleUser.firstName,
                        lastName: googleUser.lastName,
                        username: googleUser.username,
                        email: googleUser.google.email
                };
                res.json({user});
            }else{
                nUser = req.user;
                // nUser.email = req.user.local.email;
                let user = {
                    id: nUser._id,
                    firstName: nUser.firstName,
                    lastName: nUser.lastName,
                    username: nUser.username,
                    email: nUser.local.email
                };
                res.json({user});
            }

    }

    function googleOAuth(req, res, next) {
        // console.log("Google User ===================> " + req.user);
        const token = jwt.sign({data : req.user}, 'hello');
        googleUser = req.user;
        res.json({
            success: true,
            token: 'JWT '+token,
            user: {
                id: googleUser._id,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                username: googleUser.username,
                email: googleUser.google.email
            }
        });

    }

    function register(req, res, next) {
        var newUser = req.body;
        UserModel
            .addUser(newUser, (err, user) => {
            if(err){
                res.json({success: false, msg:'Failed to register user'});
            } else {
                res.json({success: true, msg:'User registered'});
            }
        });
    }



    function authenticate(req, res, next) {
            const username = req.body.username;
            const password = req.body.password;
            UserModel
                .getUserByUsername(username, (err, user) => {
                if(err) throw err;
                if(!user){
                    return res.json({success: false, msg: 'User not found'});
                }
                UserModel
                    .comparePassword(password, user.local.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    // console.log(user);
                    const token = jwt.sign({data : user}, 'hello');

                    res.json({
                        success: true,
                        token: 'JWT '+token,
                        user: {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            username: user.username,
                            email: user.local.email
                        }
                    });
                } else {
                    return res.json({success: false, msg: 'Wrong password'});
                }
                });
            });
    }

    function getAllUsers(req, res) {
        UserModel
            .findAllUsers()
            .then(function (users) {
                res.json(users);
            }, function (err){
                res.sendStatus(404);
            });
    };

};