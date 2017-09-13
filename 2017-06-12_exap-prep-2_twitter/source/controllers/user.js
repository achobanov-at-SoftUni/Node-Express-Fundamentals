const User = require('../models/User');
const encryption = require('../utilities/encryption');
const views = require('../utilities/views');

module.exports = {
    register: {
        get: (req, res) => {
            res.render('user/register');
        },
        post: (req, res) => {
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
                            res.render('users/register', { error: 'Authentication error!' });
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
    },
    login: {
        get: (req, res) => {
            res.render('user/login');
        },
        post: (req, res) => {
            let userData = req.body;

            User.findOne({ username: userData.username }).then(user => {
                if (!user || !user.authenticate(userData.password)) {
                    res.render('user/login', { error: 'Wrong credentials' });
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
    },
    logout: {
        post: (req, res) => {
            req.logout();
            res.redirect('/');
        }
    },
    profile: {
        get: (req, res) => {
            let username = req.params.username;
            User.findOne({ username })
                .populate({
                    path: 'tweets',
                    populate: {
                        path: 'author'
                    }
                })
                .then(user => {
                    if (!user) { console.log('User no longer exists'); return; }

                    views.incrementViews(user.tweets);
                    res.render('user/profile', user);
                });
        }
    },
    like: {
        post: (req, res) => {
            let tweetId = req.params.tweetId;
            views.incrementLikes(req.user, tweetId, () => res.redirect('/'));
        }
    },
    dislike: {
        post: (req, res) => {
            let tweetId = req.params.tweetId;
            views.decrementLikes(req.user, tweetId, () => res.redirect('/'));
        }
    },
    admin: {
        all: {
            get: (req, res) => {
                User.find({ roles: 'Admin' }).then(admins => {
                    res.render('user/admin/list', { admins });
                })
            }
        },
        add: {
            get: (req, res) => {
                User.where('roles')
                    .ne('Admin')
                    .then(users => {
                        res.render('user/admin/add', { users });
                    })
            },
            post: (req, res) => {
                let userId = req.body.userId;
                User.findById(userId).then(user => {
                    if (!user) { console.log('User no longer exists.'); return; }

                    user.roles.push('Admin');
                    user.save();

                    res.redirect(`/profile/${user.username}`);
                })
            }
        }
    }
};