'use strict';

/**
 * Module dependencies
 */

const mongoose = require('mongoose');
const {modelName} = mongoose.model('{modelNameCaptialized}')

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */


/**
 * {controllerName}.list()
 */
exports.list = async (req, res) => {

    try {
        let {pluralName} = await {modelName}.find({}).exec();
        return res.json({pluralName});
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when getting {pluralName}.',
            error: err
        });
    };
};

/**
 * {controllerName}.show()
 */
exports.show = async (req, res) => {

    let id = req.params.id;

    try {
        let {name} = await {modelName}.findOne({_id: id}).exec();

        if (!{name}) {
            return res.status(404).json({
                message: 'No such {name}'
            });
        }

        return res.json({name});
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when getting {name}.',
            error: err
        });
    }

};

/**
 * {controllerName}.create()
 */
exports.create = async (req, res) => {

    let {name} = new {modelName}({{createFields}});

    try {
        {name} = await {name}.save();
        return res.status(201).json({name});
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when creating {name}.',
            error: err
        });
    }
}

/**
* {controllerName}.update()
*/
exports.update = async (req, res) => {
    let id = req.params.id;
    let {name};

    try {
        {name} = await {modelName}.findOne({_id: id}).exec();
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when getting {name}',
            error: err
        });
    }


    {updateFields}

    try {
        {name} = await {name}.save();
        return res.json({name});
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when updating {name}.',
            error: err
        });
    }

};


/**
 * {controllerName}.remove()
 */
exports.remove = async (req, res) => {
    let id = req.params.id;

    try {
        let {name} = await {modelName}.findByIdAndRemove(id).exec();
        return res.status(204).json();
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when deleting the {name}.',
            error: err
        });
    }

};

exports.paginate = async (req, res) => {
    // destructure page and limit and set default values
    const { page = 1, limit = 10 } = req.query;

    try {
      // execute query with page and limit values
      const {pluralName} = await {modelName}.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      // return response with {name} and current page
      res.json({
        {pluralName},
        currentPage: page
      });
    } catch (err) {
        return res.status(500).json({
            message: 'Error while paginating {name}.',
            error: err
        });
    }
  });