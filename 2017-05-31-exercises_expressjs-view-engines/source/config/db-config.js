const path = require('path');

let dbName = 'metal-world';

module.exports = {
    dev: {
        connectionString: `mongodb://localhost:27017/${dbName}`,
        rootPath: path.normalize(path.join(__dirname, '../../'))
    },
    production: {}
};
