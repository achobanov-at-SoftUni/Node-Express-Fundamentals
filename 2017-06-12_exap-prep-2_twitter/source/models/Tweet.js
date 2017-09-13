const mongoose = require('mongoose');

let tweetSchema = mongoose.Schema({
    content: {
        type: mongoose.Schema.Types.String,
        maxLength: 140,
        required: true
    },
    tags: [{ type: mongoose.Schema.Types.String, default: [] }],
    views: { type: mongoose.Schema.Types.Number, default: 0 },
    likes: { type: mongoose.Schema.Types.Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: mongoose.Schema.Types.Date, default: Date.now() }
});

let Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;