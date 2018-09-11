let {modelName} = require({modelPath});

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */
module.exports = {

  /**
   * {controllerName}.list()
   */
  list: (req, res) => {
    {modelName}.find((err, {pluralName}) => {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting {pluralName}.',
          error: err
        });
      }
      return res.status(200).json({pluralName});
    });
  },

  /**
   * {controllerName}.show()
   */
  show: (req, res) => {
    let id = req.params.id;
    {modelName}.findOne({_id: id}, (err, {name}) => {
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
      return res.status(200).json({name});
    });
  },

  /**
   * {controllerName}.create()
   */
  create: (req, res) => {
    let {name} = new {modelName}({{createFields}
    });

    {name}.save((err, {name}) => {
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
  update: (req, res) => {
    let id = req.params.id;
    {modelName}.findOne({_id: id}, (err, {name}) => {
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
      {name}.save((err, {name}) => {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating {name}.',
            error: err
          });
        }
        return res.status(200).json({name});
      });
    });
  },

  /**
   * {controllerName}.remove()
   */
  remove: (req, res) => {
    let id = req.params.id;
    {modelName}.findByIdAndRemove(id, (err, {name}) => {
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
