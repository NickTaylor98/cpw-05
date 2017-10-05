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
    '/api/comments/create': createComment,
    '/api/comments/delete': deleteComment
};
const JSONFile = 'articles.json';
const ErrorObject = { code: 400, message: 'Request Invalid' };
let articles = require('./'+JSONFile);
const logfile = fs.createWriteStream('logfile.log');
/*
fs.readFile(JSONFile, (err, text) => {
    articles = JSON.parse(text);
});
*/
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
    log('/api/articles/readall', payload);
    cb(null, articles);
}
function read(req, res, payload, cb) {
    let article;
    if ((article = articles.find(i => i.id == payload.id)) != undefined)
        {
            log('/api/articles/read', payload);
            cb(null, article);
        }
    else
        cb(ErrorObject);
}
function create(req, res, payload, cb) {
    payload.id = Date.now();
    articles.push(payload);
    ChangeArticles();
    log('/api/articles/create', payload);
    cb(null, payload);
}
function update(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.id)) != -1) {
        articles.splice(index, 1, payload);
        ChangeArticles();
        log('/api/articles/update', payload);
        cb(null, articles[index]);
    }
    else
        cb(ErrorObject);
}
function _delete(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.id)) != -1) {
        articles.splice(index, 1);
        ChangeArticles();
        log('/api/articles/delete', payload);  
        cb(null, articles);
    }
    else
        cb(ErrorObject);
}
function createComment(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.articleId)) != -1) {
        payload.id = Date.now();
        articles[index].comments.push(payload);
        ChangeArticles();
        log('/api/comments/create', payload);
        cb(null, articles);
    }
    else
        cb(ErrorObject);
}
function deleteComment(req, res, payload, cb) {
    let index, indexOfComment;
    if ((index = articles.findIndex(i => i.id == payload.articleId)) != -1 &&
        (indexOfComment = articles[index].comments.findIndex(i => i.id == payload.id)) != -1) {
        articles[index].comments.splice(indexOfComment, 1);
        ChangeArticles();
        log('/api/comments/delete', payload);
        cb(null, articles);
    }
    else
        cb(ErrorObject);
}
function ChangeArticles() {
    const file = fs.createWriteStream(JSONFile);
    file.write(JSON.stringify(articles));
}
function log(url, data) {
    const current = new Date();
    logfile.write('\t'+ (current.getDay()+1) + '.' + (current.getMonth()+1) + '.' + current.getFullYear() + ' ' + current.getHours() + ':'+ current.getMinutes() + ':' + current.getSeconds()+'\n'+
                  'URL: ' + url + '\n'+
                  'Request:\n' + JSON.stringify(data) + '\n----------------------------------\n');
}