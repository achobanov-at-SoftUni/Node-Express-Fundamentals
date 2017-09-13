const mongoose = require('mongoose');

let tagSchema = mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true },
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: [] }]
});

let Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;