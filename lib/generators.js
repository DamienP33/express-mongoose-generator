/**
 * Module dependencies
 */
const ft = require('./fileTools');
const formatTools = require('./formatTools');
const os = require('os');

/**
 * Generate a Mongoose model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {boolean} ts generating code in TS
 * @param {function} cb
 */
function generateModel(path, modelName, modelFields, generateMethod, ts, cb) {
    const fields = formatTools.getFieldsForModelTemplate(modelFields);
    const schemaName = formatTools.capitalizeFirstLetter(modelName) + 'Schema';

    const extension = (ts) ? 'ts' : 'js';
    let model = ft.loadTemplateSync('model.' + extension);
    model = model.replace(/{modelName}/, modelName);
    model = model.replace(/{modelNameCaptialized}/, formatTools.capitalizeFirstLetter(modelName))
    model = model.replace(/{schemaName}/g, schemaName);
    model = model.replace(/{fields}/, fields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'models', function () {
            ft.writeFile(path + '/models/' + modelName + 'Model.' + extension, model, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Model.' + extension, model, null, cb);
        });
    }
}

/**
 * Generate a Express router
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {boolean} ts generating code in TS
 * @param {function} cb
 */
function generateRouter(path, modelName, generateMethod, ts, cb) {
    const extension = (ts) ? 'ts' : 'js';
    let router = ft.loadTemplateSync('router.' + extension);
    router = router.replace(/{controllerName}/g, modelName + 'Controller');

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'routes', function () {
            router = router.replace(/{controllerPath}/g, '\'../controllers/' + modelName + 'Controller' + ((ts) ? '': '.' + extension) + '\'');
            ft.writeFile(path + '/routes/' + modelName + 'Routes.' + extension, router, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            router = router.replace(/{controllerPath}/g, '\'./' + modelName + 'Controller' + ((ts) ? '': '.' + extension) + '\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Routes.' + extension, router, null, cb);
        });
    }
}

/**
 * Generate Controller
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {boolean} ts generating code in TS
 * @param {function} cb
 */
function generateController(path, modelName, modelFields, generateMethod, ts, cb) {
    const extension = (ts) ? 'ts' : 'js';
    let controller = ft.loadTemplateSync('controller.' + extension);

    let updateFields = '';
    let createFields = os.EOL;

    modelFields.forEach(function (f, index, fields) {
        const field = f.name;

        updateFields += modelName + '.' + field + ' = req.body.' + field + ' ? req.body.' + field + ' : ' +
            modelName + '.' + field + ';';
        updateFields += os.EOL + '\t\t\t';

        createFields += '\t\t\t' + field + ' : req.body.' + field;
        createFields += ((fields.length - 1) > index) ? ',' + os.EOL : '';
    });

    controller = controller.replace(/{modelName}/g, formatTools.capitalizeFirstLetter(modelName) + 'Model');
    model = model.replace(/{modelNameCaptialized}/, formatTools.capitalizeFirstLetter(modelName))
    controller = controller.replace(/{name}/g, modelName);
    controller = controller.replace(/{pluralName}/g, formatTools.pluralize(modelName));
    controller = controller.replace(/{controllerName}/g, modelName + 'Controller');
    controller = controller.replace(/{createFields}/g, createFields);
    controller = controller.replace(/{updateFields}/g, updateFields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'controllers', function () {
            controller = controller.replace(/{modelPath}/g, '\'../models/' + modelName + 'Model' + ((ts) ? '': '.' + extension) + '\'');
            ft.writeFile(path + '/controllers/' + modelName + 'Controller.' + extension, controller, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            controller = controller.replace(/{modelPath}/g, '\'./' + modelName + 'Model' + ((ts) ? '': '.' + extension) + '\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Controller.' + extension, controller, null, cb);
        });
    }
}

module.exports = {
    generateModel: generateModel,
    generateRouter: generateRouter,
    generateController: generateController
};
