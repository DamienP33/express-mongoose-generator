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
        create: ./routes/cardRoutes.js
        create: ./controllers/cardController.js
```

##### Options

  - `-m, --model <modelName>` - the model name.
  - `-f, --fields  <fields>` - the fields (name1:type,name2:type).
  - `-r, --rest` - enable generation REST.
  - `-t, --tree <tree>`        files tree generation grouped by (t)ype or by (m)odule
  - `--ts` generate TypeScrypt files

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
Files tree generation grouped by Type or by Module (t/m) ? [t] : 
        create: ./models/carModel.js
        create: ./routes/carsRoutes.js
        create: ./controllers/carController.js
```

## Rendering
### Model
models/carModel.js :
```javascript
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const carSchema = new Schema({
	'color' : String,
	'door' : Number,
	'owner' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	}
});

module.exports = mongoose.model('Car', carSchema);
```

### Router
routes/carRoutes.js :
```javascript
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController.js');

/*
 * GET
 */
router.get('/', carController.list);

/*
 * GET
 */
router.get('/:id', carController.show);

/*
 * POST
 */
router.post('/', carController.create);

/*
 * PUT
 */
router.put('/:id', carController.update);

/*
 * DELETE
 */
router.delete('/:id', carController.remove);

module.exports = router;

```

### Controller
controllers/carController.js :
```javascript
const CarModel = require('../models/carModel.js');

/**
 * carController.js
 *
 * @description :: Server-side logic for managing cars.
 */
module.exports = {

    /**
     * carController.list()
     */
    list: async (req, res) => {
        try {
            const cars = await CarModel.find().exec();
            return res.status(200).json(cars);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting cars.',
                error: err
            });
        }
    },

    /**
     * carController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;

        try {
            const car = await CarModel.findById(id).exec();
            if (!car) {
                return res.status(404).json({
                    message: 'No such car.'
                });
            }
            return res.status(200).json(car);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting car.',
                error: err
            });
        }
    },

    /**
     * carController.create()
     */
    create: async function (req, res) {
        try {
            const car = new CarModel({
				door: req.body.door,
				color: req.body.color,
				owner: req.body.owner
            });

            await car.save();
            return res.status(201).json(car);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating car',
                error: err
            });
        }
    },

    /**
     * carController.update()
     */
    update: async function (req, res) {
        const id = req.params.id;

        try {
            const car = await CarModel.findById(id).exec();
            if (!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }

            car.door = req.body.door ?? car.door;
			car.color = req.body.color ?? car.color;
			car.owner = req.body.owner ?? car.owner;
			
            await car.save();
            return res.json.status(200)(car);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating car.',
                error: err
            });
        }
    },

    /**
     * carController.remove()
     */
    remove: async function (req, res) {
        const id = req.params.id;

        try {
            const car = await CarModel.findByIdAndRemove(id);
            if (!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the car.',
                error: err
            });
        }
    }
};
```

### With files tree generation by module
```bash
Files tree generation grouped by Type or by Module (t/m) ? [t] : m
        create: ./car
        create: ./car/carModel.js
        create: ./car/carController.js
        create: ./car/carRoutes.js
```

You then only have to add router in app.js file and MongoDB connection whit Mongoose.
app.js :
```javascript
const routes = require('./routes/index');
const cars = require('./routes/carRoutes');
 ...

app.use('/', routes);
app.use('/cars', cars);
 ...
 
```

## Licence

Copyright (c) 2023 Damien Perrier.
Licensed under the [MIT license](LICENSE).
