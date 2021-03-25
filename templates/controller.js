const {modelName} = require({modelPath});

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */


/**
 * {controllerName}.list()
 */
const list = async (req, res) => {
        
    try {
        let {pluralName} = await {modelName}.find({});
        return res.json({pluralName});
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when getting {name}.',
            error: err
        });
    };
};

/**
 * {controllerName}.show()
 */
const show = async (req, res) => {

    let id = req.params.id;

    try {
        let {name} = await {modelName}.findOne({_id: id});

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
const create = async (req, res) => {

    let {name} = new {modelName}({{createFields}});
    
    try {
        let {name} = await {name}.save();
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

const update = async (req, res) => {
    let id = req.params.id;
    let {name};

    try {
        {name} = await {modelName}.findOne({_id: id});
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
const remove = async (req, res) => {
    let id = req.params.id;

    try {
        let {name} = {modelName}.findByIdAndRemove(id);
        return res.status(204).json();
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when deleting the {name}.',
            error: err
        });
    }

}

module.exports = {
    list,
    show,
    create,
    update,
    remove,  
};
