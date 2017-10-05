const log = require('./log.js');
const file = require('fs').createWriteStream('logfile.log');
let articles = require('./articles.json');

module.exports.readAll = function readAll(req, res, payload, cb) {
    log.log(file,'/api/articles/readall', payload);
    cb(null, articles);
}