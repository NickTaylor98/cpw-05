const log = require('./log.js');
const file = require('fs').createWriteStream('logfile.log');
let articles = require('./articles.json');
const ErrorObject = { code: 400, message: 'Request Invalid' };

module.exports.createComment = function createComment(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.articleId)) != -1) {
        payload.id = Date.now();
        articles[index].comments.push(payload);
        log.log(file, '/api/comments/create', payload);
        cb(null, articles);
    }
    else
        cb(ErrorObject);
}