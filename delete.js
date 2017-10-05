const log = require('./log.js');
const file = require('fs').createWriteStream('logfile.log');
let articles = require('./articles.json');
const ErrorObject = { code: 400, message: 'Request Invalid' };

module.exports.delete = function del(req, res, payload, cb) {
    let index;
    if ((index = articles.findIndex(i => i.id == payload.id)) != -1) {
        articles.splice(index, 1);
        log.log(file, '/api/articles/delete', payload);  
        cb(null, articles);
    }
    else
        cb(ErrorObject);
}