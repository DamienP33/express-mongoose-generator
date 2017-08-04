/**
 * Module dependencies
 */
var ft = require('./fileTools');
var formatTools = require('./formatTools');
var os = require('os');

/**
 * Generate a Mongoose model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateModel(path, modelName, modelFields, generateMethod, cb) {
    var fields = formatTools.getFieldsForModelTemplate(modelFields);
    var schemaName = modelName + 'Schema';

    var model = ft.loadTemplateSync('model.js');
    model = model.replace(/{modelName}/, modelName);
    model = model.replace(/{schemaName}/g, schemaName);
    model = model.replace(/{fields}/, fields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'models', function () {
            ft.writeFile(path + '/models/' + modelName + 'Model.js', model, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Model.js', model, null, cb);
        });
    }
}

// /**
//  * Generate a Express router
//  * @param {string} path
//  * @param {string} modelName
//  * @param {array} modelFields
//  * @param {string} generateMethod
//  * @param {function} cb
//  */
// function generateRouter(path, modelName, modelFields, generateMethod, cb) {
//     var router = ft.loadTemplateSync('router.js');
//     router = router.replace(/{controllerName}/g, modelName + 'Controller');

//     if (generateMethod === 't') {
//         ft.createDirIfIsNotDefined(path, 'routes', function () {
//             router = router.replace(/{controllerPath}/g, '\'../controllers/' + modelName + 'Controller.js\'');
//             ft.writeFile(path + '/routes/' + modelName + 'Routes.js', router, null, cb);
//         });
//     } else {
//         ft.createDirIfIsNotDefined(path, modelName, function () {
//             router = router.replace(/{controllerPath}/g, '\'./' + modelName + 'Controller.js\'');
//             ft.writeFile(path + '/' + modelName + '/' + modelName + 'Routes.js', router, null, cb);
//         });
//     }
// }

/**
 * Generate Controller
 */
function generateController(path, modelName, modelFields, generateMethod, cb) {
    var router = ft.loadTemplateSync('router.js');
    var updateFields = '';
    var createFields = os.EOL;

    modelFields.forEach(function (f, index, fields) {
        var field = f.name;

        updateFields += modelName + '.' + field + ' = req.body.' + field + ' ? req.body.' + field + ' : ' +
            modelName + '.' + field + ';';
        updateFields += os.EOL + '\t\t\t';

        createFields += '\t\t\t' + field + ' : req.body.' + field;
        createFields += ((fields.length - 1) > index) ? ',' + os.EOL : '';
    });

    router = router.replace(/{modelName}/g, modelName + 'Model');
    router = router.replace(/{name}/g, modelName);
    router = router.replace(/{pluralName}/g, formatTools.pluralize(modelName));
    router = router.replace(/{routerName}/g, modelName + 'Router');
    router = router.replace(/{createFields}/g, createFields);
    router = router.replace(/{updateFields}/g, updateFields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'routes', function () {
            router = router.replace(/{modelPath}/g, '\'../models/' + modelName + 'Model.js\'');
            ft.writeFile(path + '/routes/' + modelName + 's.js', router, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            router = router.replace(/{modelPath}/g, '\'./' + modelName + 'Model.js\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 's.js', router, null, cb);
        });
    }
}

module.exports = {
    generateModel: generateModel,
    generateRouter: generateRouter,
    generateController: generateController
};
