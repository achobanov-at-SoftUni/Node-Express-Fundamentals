const User = require('../models/User');
const encryption = require('../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: (req, res) => {
        let userData = req.body;

        if (userData.password && userData.password !== userData.confirmedPassword) {
            userData.error = 'Passwords do not match';
            res.render('user/register', userData);
            return;
        }

        let salt = encryption.generateSalt();
        userData.salt = salt;

        if (userData.password) {
            userData.password = encryption.generateHashedPassword(salt, userData.password);
        }

        User.create(userData)
            .then(user => {
                req.logIn(user, (err, user) => {
                    if (err) {
                        res.render('users/register', { error: 'Authentication not working!' });
                        return;
                    }

                    res.redirect('/');
                })
            })
            .catch(error => {
                userData.error = error;
                res.render('user/register', userData);
            });
    },
    loginGet: (req, res) => {
        res.render('user/login');
    },
    loginPost: (req, res) => {
        let userData = req.body;

        User.findOne({ username: userData.username }).then(user => {
            if (!user || !user.authenticate(userData.password)) {
                res.render('user/login', { error: 'Authentication not working!' });
                return;
            }

            req.logIn(user, (err, user) => {
                if (err) {
                    res.render('user/login', { error: 'Authentication not working!' });
                    return;
                }

                res.redirect('/');
            })
        })
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
};