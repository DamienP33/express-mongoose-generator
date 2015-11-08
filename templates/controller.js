var {modelName} = require('../models/{modelName}.js');

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */
module.exports = {

    /**
     * {controllerName}.list()
     */
    list: function(req, res) {
        {modelName}.find(function(err, {pluralName}){
            if(err) {
                return res.json(500, {
                    message: 'Error getting {name}.'
                });
            }
            return res.json({pluralName});
        });
    },

    /**
     * {controllerName}.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        {modelName}.findOne({_id: id}, function(err, {name}){
            if(err) {
                return res.json(500, {
                    message: 'Error getting {name}.'
                });
            }
            if(!{name}) {
                return res.json(404, {
                    message: 'No such {name}'
                });
            }
            return res.json({name});
        });
    },

    /**
     * {controllerName}.create()
     */
    create: function(req, res) {
        var {name} = new {modelName}({{createFields}
        });

        {name}.save(function(err, {name}){
            if(err) {
                return res.json(500, {
                    message: 'Error saving {name}',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: {name}._id
            });
        });
    },

    /**
     * {controllerName}.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        {modelName}.findOne({_id: id}, function(err, {name}){
            if(err) {
                return res.json(500, {
                    message: 'Error saving {name}',
                    error: err
                });
            }
            if(!{name}) {
                return res.json(404, {
                    message: 'No such {name}'
                });
            }

            {updateFields}
            {name}.save(function(err, {name}){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting {name}.'
                    });
                }
                if(!{name}) {
                    return res.json(404, {
                        message: 'No such {name}'
                    });
                }
                return res.json({name});
            });
        });
    },

    /**
     * {controllerName}.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        {modelName}.findByIdAndRemove(id, function(err, {name}){
            if(err) {
                return res.json(500, {
                    message: 'Error getting {name}.'
                });
            }
            return res.json({name});
        });
    }
};