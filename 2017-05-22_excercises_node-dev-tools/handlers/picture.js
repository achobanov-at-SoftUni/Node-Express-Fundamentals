const url = require('url');
const fs = require('fs');
const path = require('path');
const sq = require('querystring');
const database = require('../config/database');

const full_header = "StatusHeader";
const full_status = "Full";

module.exports = (req, res) => {
    "use strict";
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname === `/picture/add` && req.method === `GET`) {
        let filePath = path.normalize(path.join(__dirname, `../views/picture/add.html`));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);

                res.writeHead(404, {"Content-Type": `text/plain`});
                res.write(`404 Not Found!`);
                res.end();
                return;
            }

            res.writeHead(200, {"Content-Type": `text/html`});
            res.write(data);
            res.end();
        })
    } else if (req.pathname === `/picture/add` && req.method === `POST`) {
        let dataString = '';
        // Unclear
        req.on('data', (data) => {
            dataString += data
        });
        req.on('end', () => {
            let picture = sq.parse(dataString);
            database.pictures.add(picture);

            res.writeHead(302, {"Location": `/`});
            res.end();
        })
    } else if (req.pathname.indexOf(`/picture/details/`) !== -1 && req.method === `GET`) {
        let filePath = path.normalize(path.join(__dirname, `../views/picture/details.html`));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);

                res.writeHead(404, {"Content-Type": `text/plain`});
                res.write(`404 Not Found!`);
                res.end();
                return;
            }

            let urlTokens = req.pathname.split('/');
            let pictureId = urlTokens[urlTokens.length - 1];
            let picture = database.pictures.findById(pictureId);
            if (!picture) {
                console.log(`\n__DEV_picture-not-found: /handlers/picture.js`);

                res.writeHead(302, {"Location": "/"});
                res.end();
                return;
            }

            let pictureDetails =
                `<div id="details-content">` +
                `<h2>${picture.name}</h2>` +
                `<<img src="${picture.imageUrl}" alt="Image">` +
                `</div>`;

            let html = data.toString().replace(`{content}`, pictureDetails);

            res.writeHead(200, {"Content-Type": `text/html`});
            res.write(html);
            res.end();
        })
    } else if (req.headers.hasOwnProperty(full_header) && req.headers[full_header] === full_status && req.method === `GET`) {
        let filePath = path.normalize(path.join(__dirname, "../views/picture/status.html"));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);

                res.writeHead(404, {"Content-Type": `text/plain`});
                res.write(`404 Not Found!`);
                res.end();
                return;
            }

            res.writeHead(200, {"Content-Type": `text/html`});
            res.write(data);
            res.end();
        })
    } else {
        return true;
    }
};