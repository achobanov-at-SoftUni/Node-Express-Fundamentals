const controllers = require('../controllers/index');
// const multer = require('multer');
const permissions = require('./permissions');

// let upload = multer({dest: `./content/images`});

module.exports = (app) => {
    app.get("/", controllers.home.homeGet);

    app.get('/user/register', controllers.user.register.get);
    app.post('/user/register', controllers.user.register.post);

    app.get('/user/login', controllers.user.login.get);
    app.post('/user/login', controllers.user.login.post);

    app.post('/user/logout', controllers.user.logout);

    app.post('/user/:id/block', permissions.hasAccess('Admin'), controllers.user.admin.block.post);

    app.get('/user/profile/:username', permissions.hasUserAccess, controllers.user.details.get);

    app.get('/topic/add', permissions.hasUserAccess, controllers.topic.add.get);
    app.post('/topic/add', permissions.hasUserAccess, controllers.topic.add.post);

    app.get('/topic/list', controllers.topic.list.get);

    app.get('/topic/categories', controllers.category.listAll.get);

    app.get('/topic/list/:category', controllers.category.listCategory.get);

    app.get('/category/add', permissions.hasAccess('Admin'), controllers.category.add.get);
    app.post('/category/add', permissions.hasAccess('Admin'), controllers.category.add.post);

    app.post('/topic/edit/:id', permissions.hasAccess('Admin'), controllers.topic.edit);

    app.post('/topic/:id/like', permissions.hasUserAccess, controllers.topic.like.post);

    app.post('/topic/:id/dislike', permissions.hasUserAccess, controllers.topic.dislike.post);

    app.get('/topic/:id/:title', controllers.topic.details.get);
    app.post('/topic/:id/:title', permissions.hasUserAccess, controllers.topic.details.post);

    app.get('/topic/post/:id', permissions.hasAccess('Admin'), controllers.topic.delete.get);
    app.post('/topic/post/:id', permissions.hasAccess('Admin'), controllers.topic.delete.post);

    app.get('/admin/all', permissions.hasAccess('Admin'), controllers.user.admin.list.get);

    app.get('/admin/add', permissions.hasAccess('Admin'), controllers.user.admin.add.get);
    app.post('/admin/add', permissions.hasAccess('Admin'), controllers.user.admin.add.post);
};