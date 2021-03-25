const CarModel = require('../models/carModel.js');

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

}

module.exports = {
    list,
    show,
    create,
    update,
    remove,  
};
