const mongoose = require('mongoose');

let concertSchema = mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true },
    band: { type: mongoose.Schema.Types.String, required: true },
    cover: { type: mongoose.Schema.Types.String, required: true },
    location: { type: mongoose.Schema.Types.String },
    dateCreated: { type: mongoose.Schema.Types.Date, default: Date.now() },
    date: {type: mongoose.Schema.Types.Date, required:true },
    setList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

let indexFields = {
    name: 'text',
    band: `text`,
    location: 'text',
    date: 'text'
};

concertSchema.index(indexFields);

let Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;