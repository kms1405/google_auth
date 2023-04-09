const User = require('../models/user');
const crypto = require('crypto');
const mail = require("./mail_controller");
const bcrypt = require('bcrypt');


// render the sign up page
module.exports.signUp = function (req, res) {
    // user has already authenticated 
    if (req.isAuthenticated()) {
        return res.render("home", {
            user: req.user

        });
    }

    // redirect to sign up page
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function (req, res) {
    return res.render('user_sign_in', {
        title: "Sign In"
    })
}

// get the sign up data
module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash("error", "password is not matching")
        return res.redirect('back');
    }

    user = await User.findOne({ email: req.body.email })

    if (!user) {
        try {
            password = req.body.password
            // hashing passowrd
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)
            req.body["password"] = hash
            await User.create(req.body)
            return res.redirect('/users/sign-in');

        } catch {
            req.flash("error", "Error while creating the user");
            return res.redirect('back');
        }


    }

    else {
        return res.redirect('back');
    }
}


// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    return res.render("home", {
        user: req.user

    });
}

module.exports.passwordResetPage = function (req, res) {
    return res.render("reset_password");
}


module.exports.resetPassword = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    password = req.body.password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)
    req.body["password"] = hash
    const filter = { email: req.user.email }
    const update = { password: hash }
    await User.findOneAndUpdate(filter, update);

    return res.redirect("/users/sign-in")
}

module.exports.signOut = function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/users/sign-in');
    });
}

module.exports.forgotPassword = function (req, res) {
    res.render("forgot_password")

}

module.exports.sendPassword = async function (req, res) {
    // console.log(req)
    var password = (Math.random() + 1).toString(36).substring(7);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)
    var email = req.body.email
    filter = { "email": email }
    update = { "password": hash }
    User.findOneAndUpdate(filter, update).then((result) => {
        if (result) {
            mail.sendMail(email, password)
        }
        res.redirect('/users/sign-in');
    })
}