const fs = require('fs');
const url = require('url');
const path = require('path');
const qs = require('querystring');
const Category = require('../models/Category');

module.exports = {
    addGet: (req, res) => {
        "use strict";
        res.render('category/add');
    },
    addPost: (req, res) => {
        "use strict";
        let categoryData = req.body;
        Category.create(categoryData).then(() => {
            res.redirect('/');
        });
    },
    productsByCategory: (req, res) => {
        "use strict";
        let categoryName = req.params.category;

        Category
            .findOne({name: categoryName})
            .populate('products')
            .then((category) => {
            if (!category) {
                res.sendStatus(404);
                return;
            }

            res.render('category/products', {category});
        })
    }
};