const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const formidable = require('express-formidable');

module.exports = (app, config) => {
    // Setup views
    app.set('view engine', 'pug');
    app.set('views', path.join(config.rootPath, 'source/views'));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Setup public
    app.use((req, res, next) => {
        if (req.url.startsWith('/public')) {
            req.url = req.url.replace('/public', '');
        }

        next();
    }, express.static(path.normalize(path.join(config.rootPath, 'public'))));

    // Setup multipart-encoding form handler
    // !! USE LAST !!
    // app.use(formidable());


};