const User = require('mongoose').model('User');

module.exports = {
    attachHandles: (handles, tweetId) => {
        User.where('username')
            .in(handles)
            .then(users => {
                for (let user of users) {
                    user.tweets.push(tweetId);
                    user.save();
                }
            });
    }
};