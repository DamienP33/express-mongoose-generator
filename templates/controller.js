const {modelName} = require({modelPath});

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */
module.exports = {

    /**
     * {controllerName}.list()
     */
    list: async (req, res) => {
        try {
            const {pluralName} = await {modelName}.find().exec();
            return res.status(200).json({pluralName});
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting {pluralName}.',
                error: err
            });
        }
    },

    /**
     * {controllerName}.show()
     */
    show: async (req, res) => {
        const id = req.params.id;

        try {
            const {name} = await {modelName}.findById(id).exec();
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}.'
                });
            }
            return res.status(200).json({name});
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting {name}.',
                error: err
            });
        }
    },

    /**
     * {controllerName}.create()
     */
    create: async (req, res) => {
        try {
            const {name} = new {modelName}({{createFields}
            });

            await {name}.save();
            return res.status(201).json({name});
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating {name}',
                error: err
            });
        }
    },

    /**
     * {controllerName}.update()
     */
    update: async (req, res) => {
        const id = req.params.id;

        try {
            const {name} = await {modelName}.findById(id).exec();
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }

            {updateFields}
            await {name}.save();
            return res.json.status(200)({name});
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating {name}.',
                error: err
            });
        }
    },

    /**
     * {controllerName}.remove()
     */
    remove: async (req, res) => {
        const id = req.params.id;

        try {
            const {name} = await {modelName}.findByIdAndRemove(id);
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the {name}.',
                error: err
            });
        }
    }
};
