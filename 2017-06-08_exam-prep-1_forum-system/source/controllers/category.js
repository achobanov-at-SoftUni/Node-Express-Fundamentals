const Category = require('mongoose').model('Category');

module.exports = {
    add: {
        get: (req, res) => {
            res.render('category/add');
        },
        post: (req, res) => {
            let name = req.body.name;
            let categoryData = { name };

            Category.create(categoryData).then(category => {
                res.redirect('/category/add');
            });
        }
    },
    listCategory: {
        get: (req, res) => {
            let category = req.params.category;

            Category.findOne({ name: category })
                .populate({
                    path: 'topics',
                    populate: {
                        path: 'author'
                    }
                })
                .then(category => {
                    res.render('category/list', category);
                })
        }
    },
    listAll: {
        get: (req, res) => {
            Category.find().then(categories => {
                res.render('category/list-all', { categories });
            })
        }
    }
};