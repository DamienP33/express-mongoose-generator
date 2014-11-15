/**
 * Module dependencies
 */
var fs   = require('fs');
var path = require('path');

/**
 * Create a directory if not defined
 * @param dirPath {string} directory path parent
 * @param dirName {string} directory name to find
 * @param cb {function} callback
 */
function createDirIfIsNotDefined(dirPath, dirName, cb){
    fs.exists(path.join(dirPath, dirName), function(exists){
        if(!exists){
            fs.mkdir(dirPath + '/' + dirName, function(err){
                if(err){ throw err; }
                cb && cb()
            });
        } else {
            cb && cb()
        }
    });
}

/**
 * Write a file
 * @param path {string} file path to write
 * @param contents {string} file contents to write
 * @param mode {int} write mode
 * @param cb {function} callback
 */
function writeFile(path, contents, mode, cb) {
    fs.writeFile(path, contents, { mode: mode || 0666 }, function (err) {
        if(err) { throw err; }
        cb && cb();
    });
}

/**
 * Load a template
 * @param name {string} template name
 * @returns {string} template contents
 */
function loadTemplateSync(name) {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf-8');
}

module.exports = {
    createDirIfIsNotDefined: createDirIfIsNotDefined,
    writeFile: writeFile,
    loadTemplateSync: loadTemplateSync
};