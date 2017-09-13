const mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    name: {type: mongoose.Schema.Types.String, required: true},
    description: {type: mongoose.Schema.Types.String, required: true},
    price: {type: mongoose.Schema.Types.Number, min: 0, max: Number.MAX_VALUE},
    imageUrl: {type: mongoose.Schema.Types.String, required: true},
    isBought: {type: mongoose.Schema.Types.Boolean, default: false},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
});

let Product = mongoose.model('Product', productSchema);

module.exports = Product;