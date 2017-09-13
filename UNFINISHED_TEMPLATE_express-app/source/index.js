"use strict";
const express = require('express');
const http = require('http');
const port = process.env.NODE_PORT || 3000;

const settings = require('./config/settings');
const database = require('./config/database');

let app = express();
let environment = process.env.NODE_ENV || 'development';

database(settings[environment]);
require('./config/express')(app, settings[environment]);
require('./config/routes')(app);
require('./config/passport')();

app.listen(port);
console.log(`Express app listening on ${port}`);