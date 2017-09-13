const url = require('url');
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const shortid = require('shortid');
const Product = require('../models/Product');
const Category = require('../models/Category');

function getImageFormat(fileName) {
    "use strict";
    if (fileName.endsWith(`.png`)) {
        return `.png`;
    }
    if (fileName.endsWith(`.jpg`)) {
        return `.jpg`;
    }
}

module.exports = {
    addGet: (req, res) =>  {
        "use strict";
        Category.find().then((categories) => {
            res.render('product/add', { categories });
        })
    },
    addPost: (req, res) => {
        "use strict";
        let productData = req.body;
        productData.imageUrl = `\\${req.file.path}`;
        productData.imageFormat = getImageFormat(req.file.originalname);
        Product.create(productData).then((product) => {
            Category.findById(product.category).then((category) => {
                category.products.push(product._id);
                category.save();
            });

            res.redirect('/');
        });
    },
    editGet: (req, res) => {
        "use strict";
        let productId = req.params.id;

        Product
            .findById(productId)
            .populate('category')
            .then((product) => {
            if (!product) {
                res.sendStatus(404);
                return;
            }
            Category.find().then((categories) => {
                res.render('product/edit', { product, categories });
            });
        })
    },
    editPost: (req, res) => {
        "use strict";
        let productId = req.params.id;
        let editedData = req.body;

        Product.findById(productId).then((product) => {
            if (!product) {
                res.redirect(`/?error=${encodeURIComponent('error=Product was not found!')}`);
                return;
            }

            product.name = editedData.name;
            product.description = editedData.description;
            product.price = editedData.price;
            if (req.file) {
                product.imageUrl = `\\${req.file.path}`;
            }
            if (product.category.toString() !== editedData.category) {
                Category.findById(product.category).then((currentCategory) => {
                    Category.findById(editedData.category).then((nextCategory) => {
                        let productCurrentIndex = currentCategory.indexOf(product._id);
                        if (productCurrentIndex !== -1) {
                            currentCategory.products.splice(productCurrentIndex, 1);
                        }
                        currentCategory.save();

                        nextCategory.products.push(product._id);
                        nextCategory.save();

                        product.category = editedData.category;

                        product.save().then(() => {
                            res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`);
                        })
                    })
                })
            } else {
                product.save().then(() => {
                    res.redirect(`/?success=${encodeURIComponent('Product was edited successfully')}`);
                })
            }
        })
    },
    deleteGet: (req, res) => {
        "use strict";
        let productId = req.params.id;
        Product.findById(productId).then((product) => {
            res.render('product/delete', { product });
        });
    },
    deletePost: (req, res) => {
        "use strict";
        let productId = req.params.id;

        Product.findById(productId).populate('category').then((product) => {
            let categoryId = product.category._id;

            Product.remove({_id: productId}).exec().then(() => {
                Category.findById(categoryId).then((category) => {
                    category.products.splice(productId);
                    category.save();
                });

                res.redirect(`/?success=${encodeURIComponent('Product deleted successfully!')}`);

                let imageUrlTokens = product._doc.imageUrl.split('\\');
                let imageFileName = imageUrlTokens[imageUrlTokens.length - 1];
                let filePath = path.join(__dirname, `../content/images/${imageFileName}`);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })

            });
        });
    },
    buyGet: (req, res) => {
        "use strict";
        let productId = req.params.id;
        Product.findById(productId).then((product) => {
            res.render('product/buy', { product });
        })
    }
};