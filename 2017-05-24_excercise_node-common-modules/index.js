const http = require('http');
const port = 3000;
const handlers = require('./handlers');

const config = require('./config/config');
const database = require('./config/database.config');



let environment = process.env.NODE_ENV || 'development';
database(config[environment]);

http.createServer((req, res) => {
    "use strict";
    for (let handler of handlers) {
        if (!handler(req, res)) {
            break;
        }
    }

}).listen(port);
