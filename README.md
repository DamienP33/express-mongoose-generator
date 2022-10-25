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
routes/carRoutes.js :
```javascript
const express = require('express');
const router = express.Router();
const carController = require('./carController.js');

/*
 * GET
 */
router.get('/', carController.list);

/*
 * GET
 */
router.get('/:id', carController.show);

/*
 * GET
 */
router.get('/p/paginate', carController.paginate);

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
const CarModel = require('./carModel.js');

/**
 * carController.js
 *
 * @description :: Server-side logic for managing cars.
 */


/**
 * carController.list()
 */
const list = async (req, res) => {
        
    try {
        let cars = await CarModel.find({});
        return res.json(cars);
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when getting car.',
            error: err
        });
    };
};

/**
 * carController.show()
 */
const show = async (req, res) => {

    let id = req.params.id;

    try {
        let car = await CarModel.findOne({_id: id});

        if (!car) {
            return res.status(404).json({
                message: 'No such car'
            });
        }

        return res.json(car);
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when getting car.',
            error: err
        });
    }

};

/**
 * carController.create()
 */
const create = async (req, res) => {

    let car = new CarModel({
			door : req.body.door,
			color : req.body.color,
			owner : req.body.owner});
    
    try {
        let car = await car.save();
        return res.status(201).json(car);
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when creating car.',
            error: err
        });
    }
}

/**
* carController.update()
*/

const update = async (req, res) => {
    let id = req.params.id;
    let car;

    try {
        car = await CarModel.findOne({_id: id});
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when getting car',
            error: err
        });
    }


    car.door = req.body.door ? req.body.door : car.door;
			car.color = req.body.color ? req.body.color : car.color;
			car.owner = req.body.owner ? req.body.owner : car.owner;
			

    try {
        car = await car.save();
        return res.json(car);
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when updating car.',
            error: err
        });
    }

};


/**
 * carController.remove()
 */
const remove = async (req, res) => {
    let id = req.params.id;

    try {
        let car = CarModel.findByIdAndRemove(id);
        return res.status(204).json();
    }
    catch (err) {
        return res.status(500).json({
            message: 'Error when deleting the car.',
            error: err
        });
    }

};

const paginate = async (req, res) => {
    // destructure page and limit and set default values
    const { page = 1, limit = 10 } = req.query;
  
    try {
      // execute query with page and limit values
      const car = await CarModel.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      // return response with car and current page
      res.json({
        car,
        currentPage: page
      });
    } catch (err) {
        return res.status(500).json({
            message: 'Error while paginating car.',
            error: err
        });
    }
  });

module.exports = {
    list,
    show,
    create,
    update,
    remove,
    paginate,
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

Copyright (c) 2021 Damien Perrier.
Licensed under the [MIT license](LICENSE).