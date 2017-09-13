const mongoose = require('mongoose');

let answerSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    content: { type: mongoose.Schema.Types.String, required: true },
    dateCreated: { type: mongoose.Schema.Types.Date, default: Date.now() }
});

let Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;