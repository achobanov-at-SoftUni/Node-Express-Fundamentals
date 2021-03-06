const controllers = require('../controllers');
const auth = require('./auth');
const multer = require('multer');

let upload = multer({dest: `./content/images`});

module.exports = (app) => {
    "use strict";
    app.get("/", controllers.home.homeGet);

    app.get('/user/register', controllers.user.registerGet);
    app.post('/user/register', controllers.user.registerPost);

    app.get('/user/login', controllers.user.loginGet);
    app.post('/user/login', controllers.user.loginPost);

    app.post('/user/logout', controllers.user.logout);

    // Let only admin create categories
    app.get('/category/add',
        auth.isInRole('Admin'),
        controllers.category.addGet);
    app.post('/category/add',
        auth.isInRole('Admin'),
        controllers.category.addPost);

    // Let only registered users to create, edit, delete or buy.
    app.get('/product/add',
        auth.isAuthenticated,
        controllers.product.addGet);
    app.post('/product/add',
        auth.isAuthenticated,
        upload.single('image'),
        controllers.product.addPost);

    app.get('/product/edit/:id',
        auth.isAuthenticated,
        controllers.product.editGet);
    app.post('/product/edit/:id',
        auth.isAuthenticated,
        upload.single('image'),
        controllers.product.editPost);

    app.get('/product/delete/:id',
        auth.isAuthenticated,
        controllers.product.deleteGet);
    app.post('/product/delete/:id',
        auth.isAuthenticated,
        controllers.product.deletePost);

    app.get('/product/buy/:id',
        auth.isAuthenticated,
        controllers.product.buyGet);
    app.post('/product/buy/:id',
        auth.isAuthenticated,
        controllers.product.buyPost);

    app.get('/category/:category/products', controllers.category.productsByCategory);
};