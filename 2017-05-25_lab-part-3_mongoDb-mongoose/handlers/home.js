const url = require('url');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const qs = require('querystring');

module.exports = (req, res) => {
    "use strict";
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname === '/' && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html'));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                res.write('404 not found');
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            Product.find().then((products) => {
                let queryData = qs.parse(url.parse(req.url).query);
                if (queryData.query) {
                    let lowerCaseFilter = queryData.query.toString().toLowerCase();
                    products = products.filter(
                        p => p.name.toLowerCase().indexOf(lowerCaseFilter) !== -1
                        || p.description.toLowerCase().indexOf(lowerCaseFilter) !== -1);
                }

                let content = '';
                for (let product of products) {
                    content +=
                        `<div class="product-card">` +
                            `<img class="product-img" src="${product.imageUrl}">` +
                            `<h2>${product.name}</h2>` +
                            `<p>${product.description}</p>` +
                        `</div>`;
                }

                let html = data.toString().replace(`{content}`, content);

                res.write(html);
                res.end();
            });
        });
    } else {
        return true;
    }
};