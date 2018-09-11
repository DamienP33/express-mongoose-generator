let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let {schemaName} = new Schema({fields});

module.exports = mongoose.model('{modelName}', {schemaName});
