const User = require('../models/user');


module.exports.profile = function (req, res) {
    return res.render('user_profile', {
        title: 'User Profile'
    })
}


// render the sign up page
module.exports.signUp = function (req, res) {
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
        title: "Codeial | Sign In"
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
    const filter = { email: req.user.email }
    const update = { password: req.body.password }
    await User.findOneAndUpdate(filter, update);

    return res.redirect("/users/sign-in")
}

module.exports.signOut = function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/users/sign-in');
      });
}