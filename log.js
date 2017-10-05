module.exports.log = function log(logfile, url, data) {
    const current = new Date();
    logfile.write('\t'+ (current.getDay()+1) + '.' + (current.getMonth()+1) + '.' + current.getFullYear() + ' ' + current.getHours() + ':'+ current.getMinutes() + ':' + current.getSeconds()+'\n'+
                  'URL: ' + url + '\n'+
                  'Request:\n' + JSON.stringify(data) + '\n----------------------------------\n');
}