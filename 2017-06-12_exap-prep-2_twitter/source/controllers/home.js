const Tweet = require('mongoose').model('Tweet');
const views = require('../utilities/views');

module.exports = {
    get: (req, res) => {
        Tweet.find()
            .sort({ creationDate: -1 })
            .limit(100)
            .populate('author', 'username')
            .then(tweets => {
                views.incrementViews(tweets);
                if (req.user) {
                    tweets = views.resolveUserLikes(req.user, tweets);
                }

                res.render('home/index', { tweets });
            });
    }
};