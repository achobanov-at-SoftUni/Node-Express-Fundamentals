const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: [] }]
});

let Category = mongoose.model('Category', categorySchema);

module.exports = Category;