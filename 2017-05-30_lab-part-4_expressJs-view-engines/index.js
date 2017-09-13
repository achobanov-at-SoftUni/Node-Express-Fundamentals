const express = require('express');
const http = require('http');
const port = 3002;

const config = require('./config/config');
const database = require('./config/database.config');

let app = express();

let environment = process.env.NODE_ENV || 'development';
database(config[environment]);
require('./config/express')(app, config[environment]);
require('./config/routes')(app);

app.listen(port);
