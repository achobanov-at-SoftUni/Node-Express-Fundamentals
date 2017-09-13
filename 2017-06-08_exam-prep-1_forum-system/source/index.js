"use strict";

const express = require('express');
const http = require('http');
const port = 3000;

const config = require('./config/config');
const database = require('./config/database.config.js');

let app = express();

let environment = process.env.NODE_ENV || 'development';
database(config[environment]);
require('./config/express')(app, config[environment]);
require('./config/routes')(app);
require('./config/passport')();

app.listen(port);
console.log(`Listening on ${port}`);
