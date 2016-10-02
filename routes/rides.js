/** 
 * Express Route: /rides
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Ride = require('../app/models/ride');
var eCodes = require('../app/CustomError');
var mongoose = require('mongoose');
var requiredFields = ["passenger", "driver", "car", "rideType", "startPoint", "endPoint",
                      "requestTime", "pickUpTime", "dropOffTime", "status"];

function validateRequest(req, res) {
    var keyValue = [];
    Ride.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    for (var key in req.body) {
        // Check if the key property in the request is a valid one.
        if (keyValue.indexOf(key) == -1) {
            var errorObj = Object.assign({}, eCodes['1003']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, key, "Rides");
            res.status(errorObj.statusCode).send(errorObj);
            return 0;
        }
    }
    return 1;
}

function validateRequiredFields(req, res) {
    for (var key in requiredFields) {
        if (!req.body[requiredFields[key]]) {
            var errorObj = Object.assign({}, eCodes['1004']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, "Ride", requiredFields[key]);
            res.status(errorObj.statusCode).send(errorObj);
            return 0;
        }
    }
    return 1;
}

router.route('/rides/:id/routePoints')
    /**
     * GET call for the ride entity.
     * @returns {object} A list of routePoints. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Ride.findById(req.params.id, function(err, ride) {
            if (!ride) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Ride");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Ride", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json(ride.route);
            }
        });
    });

    router.route('/rides')

    /**
     * POST call for the ride entity to add a new ride.
     */
    .post(function(req, res){
        if (validateRequest(req, res) != 1 || validateRequiredFields(req, res) != 1)
            return;

        var ride = new Ride();
        ride.passenger = mongoose.Types.ObjectId(req.body.passenger);
        ride.driver = mongoose.Types.ObjectId(req.body.driver);
        ride.car = mongoose.Types.ObjectId(req.body.car);
        ride.rideType = req.body.rideType;
        ride.startPoint = req.body.startPoint;
        ride.endPoint = req.body.endPoint;
        ride.requestTime = req.body.requestTime;
        ride.pickupTime = req.body.pickupTime;
        ride.dropOffTime = req.body.dropOffTime;
        ride.status = req.body.status;
        ride.fare = req.body.fare;
        ride.route = req.body.route;

        ride.save(function(err){
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "insert into", "Ride", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else if (err.name === 'ValidationError') {
                var errorObj = Object.assign({}, eCodes['1009']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Ride", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.status(201).json({"message" : "Ride Created", "rideCreated" : ride});
            }
        });
    });

router.route('/rides/:id/routePoint/current')
    /**
     * GET call for the ride entity.
     * @returns {object} The current route point. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Ride.findById(req.params.id, function(err, ride) {
            if (!ride) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Ride");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Ride", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                // Check if the ride has started
                if (['REQUESTED', 'AWAITING_DRIVER', 'DRIVE_ASSIGNED'].indexOf(ride.status) > 0) {
                    var errorObj = Object.assign({}, eCodes['2001']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, ride.status);
                    res.status(errorObj.statusCode).send(errorObj);
                    return;
                }
                var currRoute = ride.route;
                // Check if the route is stored
                if (!currRoute || currRoute.length == 0) {
                    var errorObj = Object.assign({}, eCodes['2002']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage);
                    res.status(errorObj.statusCode).send(errorObj);
                    return;
                }
                // Return the last entry of the current route array 
                res.json(currRoute[currRoute.length-1]);
            }
        });
    });

module.exports = router;