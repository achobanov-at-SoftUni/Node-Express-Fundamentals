const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/User');
const Category = require('../models/Category');
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
                    password: hashedPwd,
                    age: 33,
                    gender: 'Male',
                    hashedPass: hashedPwd,
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

function seedProductCategory(adminId) {
    Category.findOne({name: 'Product'}).then((categoryExists) => {
        if (!categoryExists) {
            let categoryData = {
                name: 'Product',
                creator: adminId,
                products: []
            };

            Category.create(categoryData).then(category => {
                console.log(`Seeded default category: ${category.name}`);
            })
        }
    })
}

function initDb() {
    seedAdmin().then(adminId => seedProductCategory(adminId));
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

    initDb();
};

