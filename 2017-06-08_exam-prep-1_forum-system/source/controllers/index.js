
const homeController = require('./home');
const userController = require('./user');
const topicController = require('./topic');
const categoryController = require('./category');

module.exports = {
    user: userController,
    home: homeController,
    topic: topicController,
    category: categoryController
};