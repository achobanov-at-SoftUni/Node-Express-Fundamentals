const mongoose = require('mongoose');

let handleSchema = mongoose.Schema({
    userName: { type: mongoose.Schema.Types.String, required: true},
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: []}]
});

let Handle = mongoose.model('Handle', handleSchema);

module.exports = Handle;