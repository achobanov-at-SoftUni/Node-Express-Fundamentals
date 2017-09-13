const path = require('path');

let dbName = 'shop-stop';

module.exports = {
    development: {
        connectionString: `mongodb://localhost:6789/${dbName}`,
        rootPath: path.normalize(
            path.join(__dirname, '../'))
    },
    production: {}
};