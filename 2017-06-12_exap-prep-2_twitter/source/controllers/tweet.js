const Tweet = require('mongoose').model('Tweet');
const matcher = require('../utilities/matcher');
const handleController = require('./handle');
const tagController = require('./tag');


module.exports = {
    add: {
        get: (req, res) => {
            res.render('tweet/add');
        },
        post: (req, res) => {
            let inputData = req.body;
            let tags = matcher.get(inputData.content);
            let handles = matcher.get(inputData.content, 'handles');

            let tweetData = {
                content: inputData.content,
                author: req.user._id,
                tags: tags,
            };

            Tweet.create(tweetData).then(tweet => {
                if (!tweet) { console.log('Cannot write tweet in database.'); return; }

                tagController.addTags(tags, [], tweet._id);
                handleController.attachHandles(handles, tweet._id);

                req.user.tweets.push(tweet._id);
                req.user.save();

                res.redirect('/');
            });
        }
    },
    listByTag: {
        get: (req, res) => {
            let name = req.params.tagName;
            Tweet.find({ tags: name })
                .sort({ dateCreated: -1 })
                .limit(100)
                .populate('author', 'username')
                .then(tweets => {
                    res.render('tweet/list', { name, tweets });
                })
        }
    },
    edit: {
        post: (req, res) => {
            let tweetId = req.params.tweetId;
            let editedContent = req.body.content;
            let newTags = matcher.get(editedContent);

            Tweet.findById(tweetId).then(tweet => {
                if (!tagController.tagsAreEqual(tweet.tags, newTags)) {
                    let tagsToRemove = tagController.getTags(newTags, tweet.tags);
                    let tagsToAdd = tagController.getTags(tweet.tags, newTags);

                    let tags = tagController.removeTags(tagsToRemove, tweet.tags, tweetId);
                    tags = tagController.addTags(tagsToAdd, tags, tweetId);

                    tweet.tags = tags;
                }

                tweet.content = editedContent;
                tweet.save();

                res.redirect('/');
            });
        }
    },
    delete: {
        get: (req, res) => {
            let tweetId = req.params.tweetId;

            Tweet.findById(tweetId).then(tweet => {
                res.render('tweet/delete', tweet);
            })
        },
        post: (req, res) => {
            let tweetId = req.params.tweetId;

            Tweet.findByIdAndRemove(tweetId).then(tweet => {
                let tagsToRemove = tweet.tags;
                tagController.removeTags(tagsToRemove, tagsToRemove, tweet._id);

                res.redirect('/');
            });
        }
    }
};