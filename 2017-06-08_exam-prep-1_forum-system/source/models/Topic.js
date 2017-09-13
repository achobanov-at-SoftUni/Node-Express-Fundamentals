const mongoose = require('mongoose');

let topicSchema = mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: true },
    description: { type: mongoose.Schema.Types.String, required: true },
    dateCreated: { type: mongoose.Schema.Types.Date, default: Date.now() },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true }],
    lastAnswerDate: { type: mongoose.Schema.Types.Date },
    views: { type: mongoose.Schema.Types.Number, default: 0 },
    likes: { type: mongoose.Schema.Types.Number, default: 0 }
});

let Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;