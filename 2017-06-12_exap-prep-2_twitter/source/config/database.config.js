const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/User');
const Category = require('../models/Tag');
const encryption = require('../utilities/encryption');

function seedAdmin() {
    return new Promise((resolve, reject) => {
        User.find({username: 'admin'}).then(users => {
            if (users.length === 0) {
                let pwd = 'admin12';
                let salt = encryption.generateSalt();
                let hashedPwd = encryption.generateHashedPassword(salt, pwd);

                let adminData = {
                    username: 'admin',
                    firstName: 'Alex',
                    lastName: 'Chobanov',
                    salt: salt,
                    age: 33,
                    password: hashedPwd,
                    roles: ['Admin']
                };

                User.create(adminData).then(admin => {
                    console.log(`Seeded admin: ${admin.username}`);
                    resolve(admin._id);
                });
            }
        });
    });
}

module.exports = (config) => {
    "use strict";
    mongoose.connect(config.connectionString);

    let database = mongoose.connection;
    database.once('open', (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Connected!');
    });

    database.on('error', (err) => {
        console.log(err);
    });

    // initDb();
    seedAdmin();
    require('../models/Tweet');
    require('../models/Tag');
    require('../models/Handle');
};

