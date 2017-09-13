const User = require('../models/User');
const encryption = require('../utilities/encryption');

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
                            res.render('users/register', { error: 'Connection to database not working!' });
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
                    res.render('user/login', { error: 'Invalid credentials!' });
                    return;
                }

                req.logIn(user, (err, user) => {
                    if (err) {
                        res.render('user/login', { error: err });
                        return;
                    }

                    res.redirect('/');
                })
            })
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    details: {
        get: (req, res) => {
            let username = req.params.username;
            User.findOne({ username })
                .populate('topics')
                .populate('answers')
                .then(user => {
                    if(req.user.hasAccess('Admin')) {
                        user.hasAdminAccess = true;
                    }
                    res.render('user/profile', user);
                })
        }
    },
    admin: {
        list: {
            get: (req, res) => {
                User.find({ roles: 'Admin' }).then(admins => {
                    res.render('user/admin/list', { admins });
                });
            }
        },
        add: {
            get: (req, res) => {
                User.where('roles')
                    .ne('Admin')
                    .then(users => {
                        res.render('user/admin/add', { users });
                    });
            },
            post: (req, res) => {
                let userId = req.body.userId;

                User.findById(userId).then(user => {
                    if (!user) {
                        console.log('User no longer exists');
                        return;
                    }

                    user.roles.push('Admin');
                    user.save();
                    res.redirect(`/user/profile/${user.username}`);
                })
            }
        },
        block: {
            post: (req, res) => {
                let userId = req.params.id;

                User.findById(userId).then(user => {
                    if (!user) {
                        console.log('User no longer exists!');
                        return;
                    }

                    if (user.hasAccess('Admin')) {
                        console.log('Cannot block admin level access users!');
                        return;
                    }

                    user.isBlocked = true;
                    user.save()
                        .then(() => res.redirect(`/user/profile/${userId}`));
                })
            }
        }

    }
};