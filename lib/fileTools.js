/**
 * Module dependencies
 */
var fs   = require('fs');
var path = require('path');
var cliStyles = require('./cliStyles');

/**
 * Create a directory if not defined
 * @param {string} dirPath directory path parent
 * @param {string} dirName directory name to find
 * @param {function} cb callback
 */
function createDirIfIsNotDefined(dirPath, dirName, cb) {
    fs.exists(path.join(dirPath, dirName), function(exists) {
        if (!exists) {
            fs.mkdir(dirPath + '/' + dirName, function(err) {
                if (err) { throw err; }
                console.info(cliStyles.cyan + '\tcreate' + cliStyles.reset + ': ' + dirPath + '/' + dirName);
                cb();
            });
        } else {
            cb();
        }
    });
}

/**
 * Write a file
 * @param {string} path file path to write
 * @param {string} contents file contents to write
 * @param {int} mode write mode
 * @param {function} cb callback
 */
function writeFile(path, contents, mode, cb) {
    fs.writeFile(path, contents, {mode: mode || 0666}, function (err) {
        if (err) { throw err; }
        console.info(cliStyles.cyan + '\tcreate' + cliStyles.reset + ': ' + path);
        cb();
    });
}

/**
 * Load a template
 * @param {string} name template name
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
