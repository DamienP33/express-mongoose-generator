'use strict';

/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

/**
 * {modelNameCaptialized} Schema
 */
const {schemaName} = new Schema(
        {fields}
    );

/**
 * Validations
 */

/**
 * Methods
 */

 {schemaName}.methods = {
    hello_world: function () {
      console.log('Hello world from {modelNameCaptialized} model methods');
    },
  };

/**
 * Statics
 */

 {schemaName}.statics = {
    hello_world: function () {
      console.log('Hello world from {modelNameCaptialized} model statics');
    },
}
module.exports = mongoose.model('{modelNameCaptialized}', {schemaName});