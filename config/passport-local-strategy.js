const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require('../models/user');


passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    }, async function (email, password, done) {
        user = await User.findOne({ email: email });
        if (!user) {
            console.log('Error in finding user --> Passport');
            return done("user not found");
        }

        if (!user || user.password != password) {
            console.log('Invalid Username/Password');
            return done(null, false);
        }

        return done(null, user);

    }
));


passport.serializeUser(function (id, done) {
    done(null, user.id);
});


passport.deserializeUser(async function (id, done) {
    try {
        user = await User.findById(id)
        return done(null, user);

    } catch {
        console.log("error while deserialize")
        return done(err);

    }

});


passport.checkAuthentication = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    console.log(req.isAuthendicated,"authencation check")
    return res.redirect("/users/sign-in")
}

passport.setAuthenticatedUser = function(req,res,next){
    if (req.isAuthenticated()) {
        res.locals.user=req.user
    }

    next();

}


module.exports = passport;

