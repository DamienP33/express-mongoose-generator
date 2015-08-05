
var fieldTypes = require('./fieldTypes');
var allowedFieldsTypes = {
    "string" : String,
    "number" : Number,
    "date"   : Date,
    "boolean": Boolean,
    "array"  : Array,
    "objectID": fieldTypes.objectID
};

/**
 * Format the fields for the model template
 * @param fields {array} fields input
 * @returns {string} formatted fields
 */
function getFieldsForModelTemplate(fields){
    var lg = fields.length - 1;

    var modelFields = '{\r';
    fields.forEach(function(field, index, array){
        modelFields += '\t"' + field.name + '" : ' + (allowedFieldsTypes[field.type]).name;
        modelFields += (lg > index) ? ',\r' : '\r';
        if(field.ref){
            modelFields = modelFields.replace(/{ref}/, field.ref );
        }
    });
    modelFields += '}';

    return modelFields;
}

/**
 * Puts a word in the plural
 * @param word
 * @returns {string}
 */
function pluralize(word){
    return word + 's';
}

module.exports = {
    getFieldsForModelTemplate: getFieldsForModelTemplate,
    pluralize: pluralize
};
