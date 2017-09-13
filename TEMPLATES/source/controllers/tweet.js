const Tweet = require('../models/Tweet');

module.exports = {
    add: {
        get: (req, res) => {
            res.render('tweet/add');
        },
        post: (req, res) => {
            let inputData = req.body;
            let tweetData = {
                content: inputData.content,
                author: req.user._id,
            };

            Tweet.create(tweetData).then(tweet => {
                if (!tweet) { console.log('Cannot create tweet. Check DB!'); return; }

                res.redirect('/');
            })
        }
    }
};