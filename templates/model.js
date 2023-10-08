const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {schemaName} = new Schema({fields});

module.exports = mongoose.model('{modelName}', {schemaName});
