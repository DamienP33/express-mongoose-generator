[![Build Status](https://travis-ci.org/DamienP33/express-mongoose-generator.svg?branch=master)](https://travis-ci.org/DamienP33/express-mongoose-generator)
# express-mongoose-generator

It’s a mongoose model, REST controller and Express router code generator for Express.js 4 application.

## Installation
```bash
$ npm install -g express-mongoose-generator
```

## Usage
### Non-Interactive mode
Generates a Mongoose model, a REST controller and Express router :
```bash
$ mongoose-gen -m car -f carDoor:number,color -r
        create: ./models/cardModel.js
        create: ./routes/cards.js
        create: ./controllers/cardController.js
```

##### Options

  - `-m, --model <modelName>` - the model name.
  - `-f, --fields  <fields>` - the fields (name1:type,name2:type).
  - `-r, --rest` - enable generation REST.

##### Available types
  - string
  - number
  - date
  - boolean
  - array
  - objectId

### Interactive mode

Generates a Mongoose model, a REST controller and Express router :
```bash
$ mongoose-gen
Model Name : car
Available types : string, number, date, boolean, array
Field Name (press <return> to stop adding fields) : door
Field Type [string] : number
Field Name (press <return> to stop adding fields) : color
Field Type [string] : 
Field Name (press <return> to stop adding fields) : owner
Field Type [string] : objectId
Reference (model name referred by the objectId field) : User
Field Name (press <return> to stop adding fields) : 
Generate Rest (yes/no) ? [yes] : 
        create: ./models/carModel.js
        create: ./routes/cars.js
        create: ./controllers/carController.js
```

## Rendering
### Model
models/carModel.js :
```javascript
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var carSchema = new Schema({
	"color" : String,
	"door" : Number,
    "owner" : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('car', carSchema);
```

### Router
routes/cars.js :
```javascript
var express = require('express');
var router = express.Router();
var carController = require('../controllers/carController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    carController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    carController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    carController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    carController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    carController.remove(req, res);
});

module.exports = router;
```

### Controller
controllers/carController.js :
```javascript
var carModel = require('../models/carModel.js');

/**
 * carController.js
 *
 * @description :: Server-side logic for managing cars.
 */
module.exports = {

    /**
     * carController.list()
     */
    list: function(req, res) {
        carModel.find(function(err, cars){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            return res.json(cars);
        });
    },

    /**
     * carController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            if(!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }
            return res.json(car);
        });
    },

    /**
     * carController.create()
     */
    create: function(req, res) {
        var car = new carModel({
			color : req.body.color,
			door : req.body.door
        });

        car.save(function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving car',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: car._id
            });
        });
    },

    /**
     * carController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving car',
                    error: err
                });
            }
            if(!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }

            car.color =  req.body.color ? req.body.color : car.color;
			car.door =  req.body.door ? req.body.door : car.door;
			
            car.save(function(err, car){
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting car.'
                    });
                }
                if(!car) {
                    return res.status(404).json({
                        message: 'No such car'
                    });
                }
                return res.json(car);
            });
        });
    },

    /**
     * carController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        carModel.findByIdAndRemove(id, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            return res.json(car);
        });
    }
};
```

You then only have to add router in app.js file and MongoDB connection whit Mongoose.
app.js :
```javascript
var routes = require('./routes/index');
var cars = require('./routes/cars');
 ...

app.use('/', routes);
app.use('/cars', cars);
 ...
 
```

## Licence

Copyright (c) 2014 Damien Perrier
Licensed under the [MIT license](LICENSE).
