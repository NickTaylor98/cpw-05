const log = require('./log.js');
const file = require('fs').createWriteStream('logfile.log');
let articles = require('./articles.json');

module.exports.create = function create(req, res, payload, cb) {
    payload.id = Date.now();
    articles.push(payload);
    log.log(file, '/api/articles/create', payload);
    cb(null, payload);
}