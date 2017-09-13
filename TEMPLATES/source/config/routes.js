const controllers = require('../controllers/index');
// const multer = require('multer');
const permissions = require('./permissions');

// let upload = multer({dest: `./content/images`});

module.exports = (app) => {
    "use strict";
    app.get("/", controllers.home.get);

    app.get('/user/register', controllers.user.register.get);
    app.post('/user/register', controllers.user.register.post);

    app.get('/user/login', controllers.user.login.get);
    app.post('/user/login', controllers.user.login.post);

    app.post('/user/logout', controllers.user.logout);

    app.get('/tweet', p)
};