[![Build Status](https://travis-ci.org/DamienP33/express-mongoose-generator.svg)](https://travis-ci.org/DamienP33/express-mongoose-generator)
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

### Interactive mode

Generates a Mongoose model, a REST controller and Express router :
```bash
$ mongoose-gen
Model Name : card
Available types : string, number, date, boolean, array
Field Name (press <return> to stop adding fields) : door
Field Type [string] : number
Field Name (press <return> to stop adding fields) : color
Field Type [string] : 
Field Name (press <return> to stop adding fields) : 
Generate Rest (yes/no) ? [yes] : 
        create: ./models/cardModel.js
        create: ./routes/cards.js
        create: ./controllers/cardController.js
```

## Rendering
### Model
models/cardModel.js :
```javascript
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var cardSchema = new Schema({
	"door" : Number,
	"color" : String
});

module.exports = mongoose.model('card', cardSchema);
```

### Router
routes/cards.js :
```javascript
var express = require('express');
var router = express.Router();
var controller = require('../controllers/cardController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    controller.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    controller.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    controller.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    controller.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    controller.remove(req, res);
});

module.exports = router;
```

### Controller
controllers/cardController.js :
```javascript
var model = require('../models/cardModel.js');

/**
 * cardController.js
 *
 * @description :: Server-side logic for managing cards.
 */
module.exports = {

    /**
     * cardController.list()
     */
    list: function(req, res) {
        model.find(function(err, cards){
            if(err) {
                return res.json(500, {
                    message: 'Error getting card.'
                });
            }
            return res.json(cards);
        });
    },

    /**
     * cardController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        model.findOne({_id: id}, function(err, card){
            if(err) {
                return res.json(500, {
                    message: 'Error getting card.'
                });
            }
            if(!card) {
                return res.json(404, {
                    message: 'No such card'
                });
            }
            return res.json(card);
        });
    },

    /**
     * cardController.create()
     */
    create: function(req, res) {
        var card = new model({
			door : req.body.door,
			color : req.body.color
        });

        card.save(function(err, card){
            if(err) {
                return res.json(500, {
                    message: 'Error saving card',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: card._id
            });
        });
    },

    /**
     * cardController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        model.findOne({_id: id}, function(err, card){
            if(err) {
                return res.json(500, {
                    message: 'Error saving card',
                    error: err
                });
            }
            if(!card) {
                return res.json(404, {
                    message: 'No such card'
                });
            }

            card.door =  req.body.door ? req.body.door : card.door;
			card.color =  req.body.color ? req.body.color : card.color;
			
            card.save(function(err, card){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting card.'
                    });
                }
                if(!card) {
                    return res.json(404, {
                        message: 'No such card'
                    });
                }
                return res.json(card);
            });
        });
    },

    /**
     * cardController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        model.findByIdAndRemove(id, function(err, card){
            if(err) {
                return res.json(500, {
                    message: 'Error getting card.'
                });
            }
            return res.json(card);
        });
    }
};
```

## Licence

Copyright (c) 2014 Damien Perrier
Licensed under the [MIT license](LICENSE).
