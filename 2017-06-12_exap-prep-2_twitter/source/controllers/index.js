const homeController = require('./home');
const userController = require('./user');
const tweetController = require('./tweet');

module.exports = {
    user: userController,
    home: homeController,
    tweet: tweetController
};