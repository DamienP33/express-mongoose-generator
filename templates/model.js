var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var {schemaName} = new Schema({fields});

module.exports = mongoose.model('{modelName}', {schemaName});
