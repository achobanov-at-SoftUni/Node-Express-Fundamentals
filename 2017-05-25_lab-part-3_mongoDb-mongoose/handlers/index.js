const homeHandler = require('./home');
const fileHandler = require('./static-files');
const productHandler = require('./product');
const categoryHandler = require('./categoryHandler');

module.exports = [ homeHandler, fileHandler, productHandler, categoryHandler ];