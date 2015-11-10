/**
 * Module dependencies
 */
var ft = require('./fileTools');
var formatTools = require('./formatTools');

/**
 * Generate a Mongoose model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {function} cb
 */
function generateModel(path, modelName, modelFields, cb) {
    ft.createDirIfIsNotDefined(path, 'models', function () {
        var fields = formatTools.getFieldsForModelTemplate(modelFields);
        var schemaName = modelName + 'Schema';

        var model = ft.loadTemplateSync('model.js');
        model = model.replace(/{modelName}/, modelName);
        model = model.replace(/{schemaName}/g, schemaName);
        model = model.replace(/{fields}/, fields);

        ft.writeFile(path + '/models/' + modelName + 'Model.js', model, null, cb);
    });
}

/**
 * Generate a Express router
 * @param {string} path
 * @param {string} modelName
 * @param {function} cb
 */
function generateRouter(path, modelName, cb) {
    ft.createDirIfIsNotDefined(path, 'routes', function () {
        var router = ft.loadTemplateSync('router.js');
        router = router.replace(/{controllerName}/g, modelName + 'Controller');

        ft.writeFile(path + '/routes/' + modelName + 's.js', router, null, cb);
    });
}

/**
 * Generate Controller
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {function} cb
 */
function generateController(path, modelName, modelFields, cb) {
    ft.createDirIfIsNotDefined(path, 'controllers', function () {
        var controller = ft.loadTemplateSync('controller.js');

        var updateFields = '';
        var createFields = '\r';
        modelFields.forEach(function (f, index, fields) {
            var field = f.name;

            updateFields += modelName + '.' + field + ' = req.body.' + field + ' ? req.body.' + field + ' : ' +
                modelName + '.' + field + ';';
            updateFields += '\r\t\t\t';

            createFields += '\t\t\t' + field + ' : req.body.' + field;
            createFields += ((fields.length - 1) > index) ? ',\r' : '\r';
        });

        controller = controller.replace(/{modelName}/g, modelName + 'Model');
        controller = controller.replace(/{name}/g, modelName);
        controller = controller.replace(/{pluralName}/g, formatTools.pluralize(modelName));
        controller = controller.replace(/{controllerName}/g, modelName + 'Controller');
        controller = controller.replace(/{createFields}/g, createFields);
        controller = controller.replace(/{updateFields}/g, updateFields);

        ft.writeFile(path + '/controllers/' + modelName + 'Controller.js', controller, null, cb);
    });
}

module.exports = {
    generateModel: generateModel,
    generateRouter: generateRouter,
    generateController: generateController
};
