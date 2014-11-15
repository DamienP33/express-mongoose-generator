/**
 * Module dependencies
 */
var ft = require('./fileTools');
var formatTools = require('./formatTools');

/**
 * Generate a Mongoose model
 * @param path {string}
 * @param modelName {string}
 * @param modelFields {string}
 */
function generateModel(path, modelName, modelFields){
    ft.createDirIfIsNotDefined(path, 'models', function () {
        var fields = formatTools.getFieldsForModelTemplate(modelFields);
        var schemaName = modelName + 'Schema';

        var model = ft.loadTemplateSync('model.js');
        model = model.replace(/{modelName}/, modelName);
        model = model.replace(/{schemaName}/g, schemaName);
        model = model.replace(/{fields}/, fields );

        ft.writeFile(path + '/models/' + modelName + '.js', model);
    });
}

module.exports = {
    generateModel: generateModel
};