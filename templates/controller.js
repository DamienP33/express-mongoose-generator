var {modelName} = require({modelPath});

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */
module.exports = {

    /**
     * {controllerName}.list()
     */
    list: function (req, res) {
        {modelName}.find(function (err, {pluralName}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    error: err
                });
            }
            return res.json({pluralName});
        });
    },

    /**
     * {controllerName}.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        {modelName}.findOne({_id: id}, function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    error: err
                });
            }
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }
            return res.json({name});
        });
    },

    /**
     * {controllerName}.create()
     */
    create: function (req, res) {
        var {name} = new {modelName}({{createFields}
        });

        {name}.save(function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating {name}',
                    error: err
                });
            }
            return res.status(201).json({name});
        });
    },

    /**
     * {controllerName}.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        {modelName}.findOne({_id: id}, function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}',
                    error: err
                });
            }
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }

            {updateFields}
            {name}.save(function (err, {name}) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating {name}.',
                        error: err
                    });
                }

                return res.json({name});
            });
        });
    },

    /**
     * {controllerName}.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        {modelName}.findByIdAndRemove(id, function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the {name}.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
