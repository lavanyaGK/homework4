/** 
 * Express Route: /cars
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Car = require('../app/models/car');
var eCodes = require('../app/CustomError');

function validateRequest(req,res) {
    var keyValue = [];
    Car.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    for (var key in keyValue) {
        var kv = keyValue[key];
        // validate the key property
        if (!(kv in req.body)) {
            var errorObj = eCodes['1004'];
            errorObj.errorMessage = util.format(errorObj.errorMessage, "Car", kv);
            res.status(eCodes['1004'].statusCode).send(errorObj);
            return 0;
        }
    }
    return 1;
}

router.route('/cars') 
    /**
     * GET call for the car entity (multiple).
     * @returns {object} A list of cars. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Car.find(function(err, cars){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(cars);
            }
        });
    })
    /**
     * POST call for the car entity.
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if(validateRequest(req,res)!=1)
            return;

        var car = new Car();
        car.license = req.body.license;
        car.doorCount = req.body.doorCount;
        car.make = req.body.make;
        car.model = req.body.model;
        car.driver = req.body.driver;

        car.save(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(201).json({"message" : "Car Created", "carCreated" : car});
            }
        });
    });

/** 
 * Express Route: /cars/:car_id
 * @param {string} car_id - Id Hash of Car Object
 */
router.route('/cars/:car_id')
    /**
     * GET call for the car entity (single).
     * @returns {object} the car with Id car_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Car.findById(req.params.car_id, function(err, car){
            if(err){
                var errorObj = eCodes['1002'];
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Car");
                res.status(eCodes['1002'].statusCode).send(errorObj);
            }else{
                res.json(car);
            }
        });  
    })
    /**
     * PATCH call for the car entity (single).
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        if(validateRequest(req,res)!=1)
            return;

        Car.findById(req.params.car_id, function(err, car){
            if(err){
                res.status(500).send(err);
            }else{
                car.license = req.body.license;
                car.doorCount = req.body.doorCount;
                car.make = req.body.make;
                car.model = req.body.model;
                car.driver = req.body.driver;

                car.save(function(err){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.json({"message" : "Car Updated", "carUpdated" : car});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the car entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        Car.remove({
            _id : req.params.car_id
        }, function(err, car){
            if(err){
                res.status(500).send(err);
            }else{
                res.json({"message" : "Car Deleted"});
            }
        });
    });

module.exports = router;