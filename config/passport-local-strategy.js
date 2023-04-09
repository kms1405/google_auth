const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    }, async function (email, password, done) {
        user = await User.findOne({ email: email });
        
        // user not found
        if (!user) {
            console.log('Error in finding user --> Passport');
            return done(null,false);
        }

        // password check
        const password_check = await bcrypt.compare(password, user.password)
        if (password_check == false) {
            console.log('Invalid Username/Password');
            return done(null, false);
        }

        return done(null, user);

    }
));


// serilizing
passport.serializeUser(function (id, done) {
    done(null, user.id);
});


// deserilizing
passport.deserializeUser(async function (id, done) {
    try {
        user = await User.findById(id)
        return done(null, user);

    } catch {
        console.log("error while deserialize")
        return done(err);

    }

});


// Authentication check
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log(req.isAuthendicated, "authencation check")
    return res.redirect("/users/sign-in")
}


// setauthendication
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }

    next();

}


module.exports = passport;

