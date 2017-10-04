'use strict';
const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;
const handlers = {
    '/api/articles/readall': readAll,
    '/api/articles/read': read,
    '/api/articles/create': create,
    '/api/articles/delete': _delete,
    '/api/articles/update': update,
};
const JSONFile = 'articles.json';
let articles = [];
fs.readFile(JSONFile, (err, text) => {
    articles = JSON.parse(text);
});
const server = http.createServer((req, res) => {
    //console.log(articles);
    parseBodyJson(req, (err, payload) => {
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

function readAll(req, res, payload, cb) {
    cb(null, articles);
}
function read(req, res, payload, cb) {
    let article;
    if ((article = articles.find(i => i.id == payload.id)) != undefined)
        cb(null, article);
    else
        cb({ code: 101, message: 'Неправильный Id' });
}
function create(req, res, payload, cb) {
    payload.id = Date.now();
    articles.push(payload);
    ChangeArticles();
    cb(null, payload);
}
function update(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.id)) != -1) {
        articles.splice(index, 1, payload);
        ChangeArticles();
        cb(null, articles[index]);
    }
    else
        cb({ code: 101, message: 'Неправильный Id' });
}
function _delete(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.id)) != -1) {
        articles.splice(index,1);
        ChangeArticles();
        cb(null, articles);
    }
    else
        cb({ code: 101, message: 'Неправильный Id' });
}
function ChangeArticles() {
    const file = fs.createWriteStream(JSONFile);
    file.write(JSON.stringify(articles));
}