const mongoose = require('mongoose');

let tweetSchema = mongoose.Schema({
    content: {
        type: mongoose.Schema.Types.String,
        maxLength: 140,
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creationDate: { type: mongoose.Schema.Types.Date, default: Date.now() }
});

let Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;