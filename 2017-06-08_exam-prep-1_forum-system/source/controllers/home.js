const Topic = require('../models/Topic');

function homeGet(req, res) {
    Topic.find()
        .sort({ dateCreated: -1 })
        .limit(20)
        .populate('author')
        .then(topics => {
            res.render('home/index', { topics });
        })
}

module.exports = { homeGet };