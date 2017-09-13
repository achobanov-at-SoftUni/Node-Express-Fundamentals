const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

module.exports = (app, settings) => {
    app.set('view engine', 'pug');
    app.set('views', path.join(settings.rootPath, 'source/views'));

    app.use(cookieParser());
    app.use(session({ secret: 'S3cr3t', saveUninitialized: false, resave: false }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Attach user object to locals. This way we pass user on every view automatically.
    app.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;
        }

        next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        if (req.url.startsWith('/public')) {
            req.url = req.url.replace('/public', '');
        }

        next();
    }, express.static(path.normalize((path.join(settings.rootPath, 'public')))));
};
