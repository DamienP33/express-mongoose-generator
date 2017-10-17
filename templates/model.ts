import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const {schemaName} = new Schema({fields});

export = mongoose.model('{modelName}', {schemaName});
