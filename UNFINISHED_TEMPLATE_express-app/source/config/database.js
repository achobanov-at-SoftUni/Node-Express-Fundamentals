const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (settings) => {
    mongoose.connect(settings.dbConnectionString);

    let database = mongoose.connection;
    database.once('open', err => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Connected to MongoDB!');
    });

    database.on('error', err => {
        console.log(err);
    });

    //TODO: Init db: Admin, default category etc.
};