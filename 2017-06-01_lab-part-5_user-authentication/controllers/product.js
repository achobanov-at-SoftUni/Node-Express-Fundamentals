const url = require('url');
const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const shortid = require('shortid');

const Product = require('../models/Product');
const Category = require('../models/Category');
const authorize = require('../utilities/auth');

function getImageFormat(fileName) {
    if (fileName.endsWith(`.png`)) {
        return `.png`;
    }
    if (fileName.endsWith(`.jpg`)) {
        return `.jpg`;
    }
}
module.exports = {
    addGet: (req, res) => {
        Category.find().then((categories) => {
            res.render('product/add', {categories});
        })
    },
    addPost: (req, res) => {
        let productData = req.body;
        productData.imageUrl = `\\${req.file.path}`;
        productData.imageFormat = getImageFormat(req.file.originalname);
        productData.creator = req.user._id;

        Product.create(productData).then((product) => {
            Category.findById(product.category).then((category) => {
                category.products.push(product._id);
                category.save();
            });
            req.user.createdProducts.push(product._id);
            req.user.save();

            res.redirect('/');
        });
    },
    editGet: (req, res) => {
        let productId = req.params.id;

        Product.findById(productId).populate('category').then((product) => {
            if (!product) {
                res.sendStatus(404);
                return;
            }
            if (!authorize()) {
                let err = `?error=Attempt for unauthorized access!`;
                res.redirect(`/${err}`);
                return;
            }

            Category.find().then((categories) => {
                res.render('product/edit', { product, categories });
            });
        })
    },
    editPost: (req, res) => {
        let productId = req.params.id;
        let editedData = req.body;

        Product.findById(productId).then((product) => {
            if (!product) {
                res.redirect(`/?error=${encodeURIComponent('error=Product was not found!')}`);
                return;
            }
            if (!authorize()) {
                let err = `?error=Unauthorized! Attempted to edit foreign product! Hacker!`;
                res.redirect(`/${err}`);
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
        if (!authorize()) {
            let err = `?error=Attempt for unauthorized access`;
            res.redirect(`/${err}`);
            return;
        }
        let productId = req.params.id;
        Product.findById(productId).then((product) => {
            res.render('product/delete', { product });
        });
    },
    deletePost: (req, res) => {
        if (!authorize()) {
            let err = `?error=Unauthorized! Attempted to delete foreign product! Hacker!`;
            res.redirect(`/${err}`);
            return;
        }

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
        let productId = req.params.id;
        Product.findById(productId).then((product) => {
            res.render('product/buy', { product });
        });
    },
    buyPost: (req, res) => {
        let productId = req.params.id;

        Product.findById(productId).then(product => {
            if (product.buyer) {
                let err = `error=${encodeURIComponent('Product was already bought!')}`;
                res.redirect(`/${err}`);
                return;
            }

            product.buyer = req.user._id;
            product.save().then(() => {
                req.user.boughtProducts.push(product._id);
                req.user.save();
                res.redirect('/'); //??
            });
        });
    }
};