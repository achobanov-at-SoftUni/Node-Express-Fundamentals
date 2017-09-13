const qs = require('querystring');

const Topic = require('mongoose').model('Topic');
const Answer = require('mongoose').model('Answer');
const User = require('mongoose').model('User');
const Category = require('mongoose').model('Category');
const helpers = require('../utilities/helpers');

module.exports = {
    add: {
        get: (req, res) => {
            Category.find().then(categories => {
                res.render('topic/add', { categories });
            });

        },
        post: (req, res) => {
            if (req.user.isBlocked) {
                console.log('Write attempt blocked!');
                res.redirect('/');
                return;
            }

            let inputData = req.body;
            let topicData = {
                title: inputData.title,
                description: inputData.description,
                author: req.user._id,
                answers: [],
            };

            Topic.create(topicData).then(topic => {
                let categoryId = inputData.categoryId;
                Category.findById(categoryId).then(category => {
                    category.topics.push(topic._id);
                    category.save();
                });

                req.user.topics.push(topic._id);
                req.user.save();
                res.redirect('/');
            });
        },
    },
    list: {
        get: (req, res) => {
            let queryData = req.query;

            let page = Number(queryData.page) || 1;
            let topicsPerPage = 20;
            let documentToSkip = (queryData.page - 1) * topicsPerPage;

            let topicsCountPromise = Topic.count({});
            Topic.find()
                .sort({ dateCreated: -1 })
                .skip(documentToSkip)
                .limit(topicsPerPage)
                .populate('author')
                .then(topics => {
                    let data  = {
                        topics,
                        page,
                        prevPage: page - 1,
                        nextPage: page + 1
                    };
                    topicsCountPromise
                        .then(count => {
                            if (page === 1) {
                                data.onFirstPage = true;
                            } else if (page * topicsPerPage >= count) {
                                data.onLastPage = true;
                            }

                            res.render('topic/list', data);
                        });
                })
        },
    },
    details: {
        get: (req, res) => {
            let topicId = req.params.id;

            Topic.findById(topicId)
                .populate('author')
                .populate({
                    path: 'answers',
                    populate: {
                        path: 'author'
                    }
                })
                .then(topic => {
                    if (!topic) {
                        console.log('Topic not found!');
                        return;
                    }
                    topic.views++;
                    topic.save();

                    if (req.isAuthenticated()) {
                        if (req.user.likedTopics.indexOf(topic._id) !== -1) {
                            topic.hasLikedTopic = true;
                        } else {
                            topic.hasNotLikedTopic = true;
                        }
                    }

                    Answer.find({ author: topic.author })
                        .sort({ dateCreated: -1 })
                        .populate('author')
                        .then(answers => {
                            topic.answers = answers;

                            if (req.isAuthenticated()) {
                                topic.hasUserAccess = true;

                                if (req.user.hasAccess('Admin')) {
                                    topic.hasAdminAccess = true;
                                }
                            }

                            res.render('topic/details', topic);

                        });
                });
        },
        post: (req, res) => {
            if (req.user.isBlocked) {
                console.log('You are blocked!');
                return;
            }

            if (!req.isAuthenticated()) {
                console.log('Unauthorized access attempt! Request: ', req);
                res.redirect('/user/login');
                return;
            }

            let inputData = req.body;
            let answerData = {
                author: req.user._id,
                content: inputData.content,
            };

            Answer.create(answerData).then(answer => {
                req.user.answers.push(answer._id);
                req.user.save();

                let topicId = req.params.id;
                Topic.findById(topicId)
                    .then(topic => {
                        topic.answers.push(answer._id);
                        topic.lastAnswerDate = answer.dateCreated;
                        topic.save().then(() => {
                            res.redirect(`/topic/${topicId}/${topic.title}`);
                        });
                    });
            })
        },

    },
    edit: (req, res) => {
        let inputData = req.body;
        let updatedData = {
            title: inputData.title,
            description: inputData.description
        };

        let topicId = req.params.id;
        Topic.findByIdAndUpdate(topicId, updatedData)
            .populate('author')
            .populate({
                path: 'answers',
                populate: {
                    path: 'author'
                }
            })
            .then(topic => {
                res.redirect(`/topic/${topicId}/${topic.title}`);
            })
    },
    delete: {
        get: (req, res) => {
            let topicId = req.params.id;
            Topic.findById(topicId)
                .populate('author')
                .populate({
                    path: 'answers',
                    populate: {
                        path: 'author'
                    }
                })
                .then(topic => {
                    res.render('topic/delete', topic);
                })
        },
        post: (req, res) => {
            let topicId = req.params.id;

            Topic.findByIdAndRemove(topicId)
                .populate('author')
                .populate({
                    path: 'answers',
                    populate: {
                        path: 'author'
                    }
                })
                .then((topic) => {
                    let topicIdIndex = topic.author.topics.indexOf(topicId);
                    topic.author.topics.splice(topicIdIndex, 1);
                    topic.author.save();

                    //TODO: fix save() and add removal for category

                    for (let answer of topic.answers) {
                        User.findOne({ answers: answer._id }).then(user => {
                            let answerIdIndex = user.answers.indexOf(answer._id);
                            user.answers.splice(answerIdIndex, 1);
                            user.save();
                        });


                        console.log('this');
                        answer.remove();
                    }


                })
        }
    },
    like: {
        post: (req, res) => {
            let topicId = req.params.id;

            Topic.findById(topicId).then(topic => {
                if (!topic) {
                    console.log('topic not found!');
                    return;
                }

                topic.likes++;
                topic.save();

                User.findById(req.user._id).then(user => {
                    if (!user) {
                        console.log('user no longer exists');
                        return;
                    }

                    user.likedTopics.push(topicId);
                    user.save()
                        .then(() => res.redirect(`/topic/${topicId}/${topic.title}`));
                });
            });
        }
    },
    dislike: {
        post: (req, res) => {
            let topicId = req.params.id;

            Topic.findById(topicId).then(topic => {
                if (!topic) {
                    console.log('topic not found!');
                    return;
                }

                topic.likes--;
                topic.save();

                User.findById(req.user._id).then(user => {
                    if (!user) {
                        console.log('user no longer exists');
                        return;
                    }

                    let topicIdIndex = user.likedTopics.indexOf(topicId);
                    user.likedTopics.splice(topicIdIndex, 1);
                    user.save()
                        .then(() => res.redirect(`/topic/${topicId}/${topic.title}`));
                });
            });
        }
    }
};