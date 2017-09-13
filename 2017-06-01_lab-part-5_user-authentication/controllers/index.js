const homeController = require('./home');
const productController = require('./product');
const categoryController = require('./category');
const userController = require('./user');

module.exports = {
    user: userController,
    home: homeController,
    product: productController,
    category: categoryController
};