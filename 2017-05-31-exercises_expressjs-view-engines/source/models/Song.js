const mongoose = require('mongoose');

let songSchema = mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true },
    band: { type: mongoose.Schema.Types.String, required: true },
    minutes: { type: mongoose.Schema.Types.Number, required: true },
    seconds: { type: mongoose.Schema.Types.Number, required: true },
    genre: { type: mongoose.Schema.Types.String, required: true },
    ballad: { type: mongoose.Schema.Types.Boolean, default: false }
});

let Song = mongoose.model('Song', songSchema);

module.exports = Song;