'use strict';
const http = require('http');
const fs = require('fs');
const create = require('./create.js');
const del = require('./delete.js');
const update = require ('./update.js');
const createcom = require('./createComment.js');
const deletecom = require('./deleteComment.js');
const read = require('./read.js');
const readAll = require('./readAll.js');

const hostname = '127.0.0.1';
const port = 3000;
const handlers = {
    '/api/articles/readall': readAll.readAll,
    '/api/articles/read': read.read,
    '/api/articles/create': create.create,
    '/api/articles/delete': del.delete,
    '/api/articles/update': update.update,
    '/api/comments/create': createcom.createComment,
    '/api/comments/delete': deletecom.deleteComment
};
const JSONFile = 'articles.json';
let articles = require('./'+JSONFile);

const server = http.createServer((req, res) => {
    parseBodyJson(req, (err, payload) => {
        console.log(articles);
        const handler = getHandler(req.url);
        handler(req, res, payload, (err, result) => {
            if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            ChangeArticles();
            res.end(JSON.stringify(result));
        });
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
    return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
    cb({ code: 404, message: 'Not found' });
}

function parseBodyJson(req, cb) {
    let body = [];
    req.on('data', (chunk) => { body.push(chunk); })
        .on('end', () => {
            body = Buffer.concat(body).toString();
            let params;
            if (body !== "") {
                params = JSON.parse(body);
            }
            cb(null, params);
        });
}
function ChangeArticles() {
    const file = fs.createWriteStream(JSONFile);
    file.write(JSON.stringify(articles));
}