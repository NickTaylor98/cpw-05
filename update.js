const log = require('./log.js');
const file = require('fs').createWriteStream('logfile.log');
let articles = require('./articles.json');

module.exports.update = function update(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.id)) != -1) {
        articles.splice(index, 1, payload);
        log.log(file, '/api/articles/update', payload);
        cb(null, articles[index]);
    }
    else
        cb(ErrorObject);
}