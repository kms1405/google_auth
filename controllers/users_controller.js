const User = require('../models/user');
const crypto = require('crypto');
const mail = require("./mail_controller");

module.exports.profile = function (req, res) {
    return res.render('user_profile', {
        title: 'User Profile'
    })
}


// render the sign up page
module.exports.signUp = function (req, res) {
    console.log(req)
    if (req.isAuthenticated()) {
        return res.render("home", {
            user: req.user

        });
    }

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
        return res.redirect('back');
    }

    user = await User.findOne({ email: req.body.email })

    if (!user) {
        try {
            password = req.body.password
            let salt = crypto.randomBytes(16).toString('hex');
            let hash = crypto.pbkdf2Sync(password, salt,
                1000, 14, `sha512`).toString(`hex`);
            req.body["password"] = hash
            await User.create(req.body)
            return res.redirect('/users/sign-in');

        } catch {
            console.log('error in creating user while signing up')
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
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt,
        1000, 14, `sha512`).toString(`hex`);
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

module.exports.sendPassword = function (req, res) {
    // console.log(req)
    var password = (Math.random() + 1).toString(36).substring(7);
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt,
        1000, 14, `sha512`).toString(`hex`);
    console.log(hash,"dddddddddddd")
    var email = req.body.email
    filter= { "email": email }
    update= {"password":hash}
    User.findOneAndUpdate(filter,update).then((result) => {
        if (result){
            mail.sendMail(email,password)
        }
        res.redirect('/users/sign-in');
    })
}