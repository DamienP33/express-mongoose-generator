const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const {schemaName} = new Schema(
        {fields},
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model('{modelName}', {schemaName});