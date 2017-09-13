const Tweet = require('mongoose').model('Tweet');

module.exports = {
    get: (req, res) => {
        Tweet.find()
            .sort({ creationDate: -1 })
            .limit(100)
            .populate('author', 'username')
            .then(tweets => {
                res.render('home/index', { tweets });
            });
    }
};