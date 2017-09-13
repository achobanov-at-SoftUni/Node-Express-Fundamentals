"use strict";

const express = require('express');
const http = require('http');
const port = 3000;

const config = require('./source/config/db-config');
const database = require('./source/config/database');

let environment = process.env.NODE_ENV || 'dev';
let app = express();

database(config[environment]);
require('./source/config/express')(app, config[environment]);
require('./source/config/routes')(app);

app.listen(port);
console.log(`Express listening on port ${port}`);
