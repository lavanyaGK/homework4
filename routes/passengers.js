/** 
 * Express Route: /Passengers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var Passenger = require('../app/models/passenger');
var eCodes = require('../app/CustomError');
var requiredFields = ["emailAddress", "password", "phoneNumber"];

function validateRequest(req, res, isUpdate) {
    var keyValue = [];
    Passenger.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    var hasOneValidProperty = false;
    for (var key in req.body) {
        // Check if the key property in the request is a valid one.
        if (keyValue.indexOf(key) == -1) {
            var errorObj = Object.assign({}, eCodes['1003']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, key, "Passenger");
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
        errorObj.errorMessage = util.format(errorObj.errorMessage, "Passenger");
        res.status(errorObj.statusCode).send(errorObj);
        return 0;
    }
    return 1;
}

function validateRequiredFields(req, res) {
    for (var key in requiredFields) {
        if (!req.body[requiredFields[key]]) {
            var errorObj = Object.assign({}, eCodes['1004']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, "Passenger", requiredFields[key]);
            res.status(errorObj.statusCode).send(errorObj);
            return 0;
        }
    }
    return 1;
}

router.route('/passengers')
    /**
     * GET call for the Passenger entity (multiple).
     * @returns {object} A list of Passengers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Passenger.find(function(err, passengers) {
            // Internal database error
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Passenger", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json(passengers);
            }
        });
    })

    /**
     * POST call for the Passenger entity.
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if (validateRequest(req, res, false) != 1 || validateRequiredFields(req, res) != 1)
            return;

        var passenger = new Passenger();
        passenger.firstName = req.body.firstName;
        passenger.lastName=req.body.lastName;
        passenger.emailAddress=req.body.emailAddress;
        passenger.password=req.body.password;
        passenger.addressLine1=req.body.addressLine1;
        passenger.addressLine2=req.body.addressLine2;
        passenger.city=req.body.city;
        passenger.state=req.body.state;
        passenger.zip=req.body.zip;
        passenger.phoneNumber=req.body.phoneNumber;

        passenger.save(function(err) {
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "insert into", "Passenger", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.status(201).json({"message" : "Passenger Created", "PassengerCreated" : passenger});
            }
        });
    });

/** 
 * Express Route: /passengers/:passenger_id
 * @param {string} Passenger_id - Id Hash of Passenger Object
 */
router.route('/passengers/:passenger_id')
    /**
     * GET call for the Passenger entity (single).
     * @returns {object} the Passenger with Id passenger_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if (!passenger) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Passenger");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Passenger", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json(passenger);
            }
        });
    })

    /**
     * PATCH call for the Passenger entity (single).
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        if (validateRequest(req,res, true) != 1)
            return;
        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if(err){
                res.status(500).send(err);
            }else{
                if (!passenger) {
                    var errorObj = Object.assign({}, eCodes['1002']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "Passenger");
                    res.status(errorObj.statusCode).send(errorObj);
                    return;
                }
                if (req.body.firstName)
                    passenger.firstName = req.body.firstName;
                if (req.body.lastName)
                    passenger.lastName=req.body.lastName;
                if (req.body.emailAddress)
                    passenger.emailAddress=req.body.emailAddress;
                if (req.body.password)
                    passenger.password=req.body.password;
                if (req.body.addressLine1)
                    passenger.addressLine1=req.body.addressLine1;
                if (req.body.addressLine2)
                    passenger.addressLine2=req.body.addressLine2;
                if (req.body.city)
                    passenger.city=req.body.city;
                if (req.body.state)
                    passenger.state=req.body.state;
                if (req.body.zip)
                    passenger.zip=req.body.zip;
                if (req.body.phoneNumber)
                    passenger.phoneNumber=req.body.phoneNumber;

                passenger.save(function(err){
                    if (err) {
                        var errorObj = Object.assign({}, eCodes['1005']);
                        errorObj.errorMessage = util.format(errorObj.errorMessage, "update", "Passenger", err);
                        res.status(errorObj.statusCode).send(errorObj);
                    } else {
                        res.json({"message" : "Passenger Updated", "PassengerUpdated" : Passenger});
                    }
                });
            }
        });
    })

    /**
     * DELETE call for the Passenger entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        Passenger.remove({
            _id : req.params.passenger_id
        }, function(err, passenger){
            if (passenger.result.n == 0) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Passenger");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "delete from", "Passenger", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json({"message" : "Passenger Deleted"});
            }
        });
    });

module.exports = router;