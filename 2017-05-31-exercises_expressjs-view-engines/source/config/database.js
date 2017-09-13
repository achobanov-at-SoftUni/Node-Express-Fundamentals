const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (config) => {
    mongoose.connect(config.connectionString);

    let database = mongoose.connection;
    database.once('open', err => {
        // Initial connection error
        if (err) {
            console.log(err);
            return;
        }

        console.log('Connected to MongoDB');
    });

    database.on('error', err => {
        console.log(`__DB-ERROR: ${err}`);
    });
};