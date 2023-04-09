const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const path  = require("path");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);

// Setup bootstrap style path
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,"views"));


// user session setup
app.use(session({
    name: 'kmsauthapp',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/test-app',
      autoRemove:"disabled"
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// flash message setup
app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

// use express router
app.use('/', require('./routes'));


// server setup
app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
