const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport,model){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');//ExtractJwt.fromAuthHeader();
    opts.secretOrKey = 'hello';
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        model.UserModel.getUserById(jwt_payload.data._id, (err, user) => {
            if(err){
                return done(err, false);
            }

            if(user){
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
};
