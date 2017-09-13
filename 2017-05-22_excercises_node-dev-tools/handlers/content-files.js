const url = require('url');
const fs = require('fs');
const path = require('path');

function getFileType(url) {
    "use strict";
    if (url.endsWith('.css')) {
        return `text/css`;
    }
    if (url.endsWith('.ico')) {
        return `image/x-icon`;
    }
    if (url.endsWith(`.js`)) {
        return `text/ecmascript`;
    }

    console.log(`Unhandled file type: ${url}`);
}

module.exports = (req, res) => {
    "use strict";
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname.startsWith(`/content/`) && req.method === `GET`) {
        let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);

                res.writeHead(404, {"Content-Type": `text/plain`});
                res.write(`404 Not Found!`);
                res.end();
                return;
            }

            res.writeHead(200, {"Content-Type": getFileType(req.pathname)});
            res.write(data);
            res.end();
        })
    } else {
        return true;
    }

};