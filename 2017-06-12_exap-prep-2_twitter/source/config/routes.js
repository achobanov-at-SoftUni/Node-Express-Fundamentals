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

    app.post('/user/logout', controllers.user.logout.post);

    app.get('/tweet', permissions.hasUserAccess, controllers.tweet.add.get);
    app.post('/tweet', permissions.hasUserAccess, controllers.tweet.add.post);

    app.get('/tag/:tagName', controllers.tweet.listByTag.get);

    app.get('/profile/:username', permissions.hasUserAccess, controllers.user.profile.get);

    /**
     * Admin routes
     */
    app.post('/tweet/edit/:tweetId', permissions.hasAccess('Admin'), controllers.tweet.edit.post);

    app.get('/tweet/delete/:tweetId', permissions.hasAccess('Admin'), controllers.tweet.delete.get);
    app.post('/tweet/delete/:tweetId', permissions.hasAccess('Admin'), controllers.tweet.delete.post);

    app.get('/admin/all', permissions.hasAccess('Admin'), controllers.user.admin.all.get);

    app.get('/admin/add', permissions.hasAccess('Admin'), controllers.user.admin.add.get);
    app.post('/admin/add', permissions.hasAccess('Admin'), controllers.user.admin.add.post);

    /**
     * Likes and dislikes
     */
    app.post('/tweet/:tweetId/like', permissions.hasUserAccess, controllers.user.like.post);

    app.post('/tweet/:tweetId/dislike', permissions.hasUserAccess, controllers.user.dislike.post);
};