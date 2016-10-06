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
var mongoose = require('mongoose');
var Driver = require('../app/models/driver');
var requiredFields = ["license", "driver"];


function validateRequest(req, res, isUpdate) {
    var keyValue = [];
    Car.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    var hasOneValidProperty = false;
    for (var key in req.body) {
        // Check if the key property in the request is a valid one.
        if (keyValue.indexOf(key) == -1) {
            var errorObj = Object.assign({}, eCodes['1003']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, key, "Car");
            res.status(errorObj.statusCode).send(errorObj);
            return 0;
        } else {
            hasOneValidProperty = true;
        }
    }
    if (isUpdate) {
        // If this is an update request let's make sure that there is atleast one valid property.
        if (hasOneValidProperty)
            return 1;
        var errorObj = Object.assign({}, eCodes['1008']);
        errorObj.errorMessage = util.format(errorObj.errorMessage, "Car");
        res.status(errorObj.statusCode).send(errorObj);
        return 0;
    }
    return 1;
}

function validateRequiredFields(req, res) {
    for (var key in requiredFields) {
        if (!req.body[requiredFields[key]]) {
            var errorObj = Object.assign({}, eCodes['1004']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, "Car", requiredFields[key]);
            res.status(errorObj.statusCode).send(errorObj);
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
        Car.find(function(err, cars) {
            // Internal database error
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Car", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
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
        if (validateRequest(req, res, false) != 1 || validateRequiredFields(req, res) != 1)
            return;

        var car = new Car();
        car.license = req.body.license;
        car.doorCount = req.body.doorCount;
        car.make = req.body.make;
        car.model = req.body.model;
        car.driver = mongoose.Types.ObjectId(req.body.driver);

        car.save(function(err){
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    var errorObj = Object.assign({}, eCodes['1007']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "Car", "license");
                    res.status(errorObj.statusCode).send(errorObj);
                } else if (err.name === 'ValidationError') {
                    var errorObj = Object.assign({}, eCodes['1009']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "Car", err);
                    res.status(errorObj.statusCode).send(errorObj);
                } else {
                    var errorObj = Object.assign({}, eCodes['1005']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "insert into", "Car", err);
                    res.status(errorObj.statusCode).send(errorObj);                
                }
            } else {
                // res.status(201).json({"message" : "Car Created", "carCreated" : car});
                res.status(201).json(car);
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
        Car.findById(req.params.car_id, function(err, car) {
            if (!car) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Car");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Car", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
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
        if (validateRequest(req, res, true) != 1)
            return;
        Car.findById(req.params.car_id, function(err, car){
            if(err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "update", "Car", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                if (!car) {
                    var errorObj = Object.assign({}, eCodes['1002']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "Car");
                    res.status(errorObj.statusCode).send(errorObj);
                    return;
                }
                if (req.body.driver)
                    car.driver = mongoose.Types.ObjectId(req.body.driver);
                if (req.body.make)
                    car.make = req.body.make;
                if (req.body.model)
                    car.model = req.body.model;
                if (req.body.license)
                    car.license = req.body.license;
                if (req.body.doorCount)
                    car.doorCount = req.body.doorCount;

                car.save(function(err){
                    if (err) {
                        var errorObj = Object.assign({}, eCodes['1005']);
                        errorObj.errorMessage = util.format(errorObj.errorMessage, "update", "Car", err);
                        res.status(errorObj.statusCode).send(errorObj);
                    } else {
                        //res.json({"message" : "Car Updated", "CarUpdated" : Car});
                        res.json(car);
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
            if (car.result.n == 0) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Car");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "delete from", "Car", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else{
                res.json({"message" : "Car Deleted"});
            }
        });
    });

module.exports = router;