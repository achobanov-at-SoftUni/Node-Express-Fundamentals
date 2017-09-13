const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const database = require(`../config/database`);

module.exports = (req, res) => {
    "use strict";
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname === `/` && req.method === `GET`) {
        let filePath = path.normalize(path.join(__dirname, `../views/home/index.html`));
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);

                res.writeHead(404, {"Content-Type": `text/plain`});
                res.write(`404 Not Found`);
                res.end();
                return;
            }
            let pictures = database.pictures
                .getAll()
                .sort((a, b) => a.name.localeCompare(b.name));

            let content = '';
            for (let picture of pictures) {
                content +=
                    `<div class="product-card">` +
                        `<a href="/picture/details/${picture.id}">` +
                            `<img class="product-img" src="${picture.imageUrl}">` +
                        `</a>` +
                        `<h2>${picture.name}</h2>` +
                    `</div>`;
            }
            let html = data.toString().replace(`{content}`, content);

            res.writeHead(200, {"Content-Type": `text/html`});
            res.write(html);
            res.end();
        })
    } else {
        return true
    }
};