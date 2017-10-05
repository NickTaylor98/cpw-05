const log = require('./log.js');
const file = require('fs').createWriteStream('logfile.log');
let articles = require('./articles.json');

module.exports.read = function read(req, res, payload, cb) {
    let article;
    if ((article = articles.find(i => i.id == payload.id)) != undefined)
        {
            log.log(file, '/api/articles/read', payload);
            cb(null, article);
        }
    else
        cb(ErrorObject);
}