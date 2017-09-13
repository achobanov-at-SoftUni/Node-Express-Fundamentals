const url = require('url');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const qs = require('querystring');

function homeGet(req, res) {
    let queryData = req.query;

    Product.find().populate('category').then((products) => {
        "use strict";
        if (queryData.query) {
            let query = queryData.query.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(query)
                || p.description.toLowerCase().includes(query));
        }

        // Look for message in query string
        let data = { products };
        if (req.query.error) {
            data.error = req.query.error;
        } else if (req.query.success) {
            data.success = req.query.success;
        }

        res.render('home/index', data);
    });
}

module.exports = { homeGet };