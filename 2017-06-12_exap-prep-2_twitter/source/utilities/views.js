const Tweet = require('mongoose').model('Tweet');

module.exports = {
    incrementViews: (tweets) => {
        for (let tweet of tweets) {
            tweet.views += 1;
            tweet.save();
        }
    },
    incrementLikes: (user, tweetId, callback) => {
        Tweet.findById(tweetId).then(tweet => {
            user.likedTweets.push(tweetId);
            user.save()
                .then(() => {
                    tweet.likes += 1;
                    tweet.save();
                });

            callback();
        });
    },
    decrementLikes: (user, tweetId, callback) => {
        Tweet.findById(tweetId).then(tweet => {
            let indexOfTweet = user.likedTweets.indexOf(tweetId);
            user.likedTweets.splice(indexOfTweet, 1);
            user.save()
                .then(() => {
                    tweet.likes -= 1;
                    tweet.save();
                });

            callback()
        });
    },
    resolveUserLikes: (user, tweets) => {
        for (let tweet of tweets) {
            if (user.likedTweets.indexOf(tweet._id) !== -1) {
                tweet.userHasLikedTweet = true;
            }
        }

        return tweets;
    }
};