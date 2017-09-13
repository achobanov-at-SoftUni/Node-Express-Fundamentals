const path = require('path');
const fs = require('fs');
const shortid = require('shortid');

const JSON_TYPE_HEADER = { "Content-Type": 'application/json' };

module.exports = {
    respondToAjax: (params) => {
        let response = {};
        if (params.data) {
            response.data = params.data;
        }
        if (params.error) {
            response.error = params.error;
        }
        if (params.success) {
            response.successs = params.success;
        }

        params.res.writeHead(params.status, JSON_TYPE_HEADER);
        params.res.write(JSON.stringify(response));
        params.res.end();
    }
};