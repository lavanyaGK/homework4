/** 
 * Express Route: /Drivers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var Driver = require('../app/models/driver');
var eCodes = require('../app/CustomError');
var requiredFields = ["emailAddress", "password", "phoneNumber", "drivingLicense", "licensedState"];

function validateRequest(req, res, isUpdate) {
    var keyValue = [];
    Driver.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    var hasOneValidProperty = false;
    for (var key in req.body) {
        // Check if the key property in the request is a valid one.
        if (keyValue.indexOf(key) == -1) {
            var errorObj = Object.assign({}, eCodes['1003']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, key, "Driver");
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
        errorObj.errorMessage = util.format(errorObj.errorMessage, "Driver");
        res.status(errorObj.statusCode).send(errorObj);
        return 0;
    }
    return 1;
}

function validateRequiredFields(req, res) {
    for (var key in requiredFields) {
        if (!req.body[requiredFields[key]]) {
            var errorObj = Object.assign({}, eCodes['1004']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, "Driver", requiredFields[key]);
            res.status(errorObj.statusCode).send(errorObj);
            return 0;
        }
    }
    return 1;
}

router.route('/drivers')
    /**
     * GET call for the Driver entity (multiple).
     * @returns {object} A list of Drivers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res) {
        Driver.find(function(err, drivers) {
            // Internal database error
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Driver", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json(drivers);
            }
        });
    })

    /**
     * POST call for the Driver entity.
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if (validateRequest(req, res, false) != 1 || validateRequiredFields(req, res) != 1)
            return;

        var driver = new Driver();
        driver.firstName = req.body.firstName;
        driver.lastName=req.body.lastName;
        driver.emailAddress=req.body.emailAddress;
        driver.password=req.body.password;
        driver.addressLine1=req.body.addressLine1;
        driver.addressLine2=req.body.addressLine2;
        driver.city=req.body.city;
        driver.state=req.body.state;
        driver.zip=req.body.zip;
        driver.phoneNumber=req.body.phoneNumber;
        driver.drivingLicense=req.body.drivingLicense;
        driver.licensedState=req.body.licensedState;

        driver.save(function(err) {
            if (err) {
                if (err.name === 'ValidationError') {
                    var errorObj = Object.assign({}, eCodes['1009']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "Driver", err);
                    res.status(errorObj.statusCode).send(errorObj);
                } else {
                    var errorObj = Object.assign({}, eCodes['1005']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "insert into", "Driver", err);
                    res.status(errorObj.statusCode).send(errorObj);
                }
            } else {
                //res.status(201).json({"message" : "Driver Created", "DriverCreated" : driver});
                res.status(201).json(driver);
            }
        });
    });

/** 
 * Express Route: /drivers/:driver_id
 * @param {string} Driver_id - Id Hash of Driver Object
 */
router.route('/drivers/:driver_id')

    /**
     * GET call for the Driver entity (single).
     * @returns {object} the Driver with Id Driver_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Driver.findById(req.params.driver_id, function(err, driver){
            if (!driver) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Driver");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "Driver", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json(driver);
            }
        });
    })

    /**
     * PATCH call for the Driver entity (single).
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        if (validateRequest(req,res, true) != 1)
            return;
        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "update", "Driver", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                if (!driver) {
                    var errorObj = Object.assign({}, eCodes['1002']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "Driver");
                    res.status(errorObj.statusCode).send(errorObj);
                    return;
                }
                if (req.body.firstName)
                    driver.firstName = req.body.firstName;
                if (req.body.lastName)
                    driver.lastName=req.body.lastName;
                if (req.body.emailAddress)
                    driver.emailAddress=req.body.emailAddress;
                if (req.body.password)
                    driver.password=req.body.password;
                if (req.body.addressLine1)
                    driver.addressLine1=req.body.addressLine1;
                if (req.body.addressLine2)
                    driver.addressLine2=req.body.addressLine2;
                if (req.body.city)
                    driver.city=req.body.city;
                if (req.body.state)
                    driver.state=req.body.state;
                if (req.body.zip)
                    driver.zip=req.body.zip;
                if (req.body.phoneNumber)
                    driver.phoneNumber=req.body.phoneNumber;
                if (req.body.drivingLicense)
                    driver.drivingLicense=req.body.drivingLicense;
                if (req.body.licensedState)
                    driver.licensedState=req.body.licensedState;

                driver.save(function(err){
                    if (err) {
                        var errorObj = Object.assign({}, eCodes['1005']);
                        errorObj.errorMessage = util.format(errorObj.errorMessage, "update", "Driver", err);
                        res.status(errorObj.statusCode).send(errorObj);
                    } else {
                        //res.json({"message" : "Driver Updated", "DriverUpdated" : Driver});
                        res.status(201).json(driver);

                    }
                });
            }
        });
    })

    /**
     * DELETE call for the Driver entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        Driver.remove({
            _id : req.params.driver_id
        }, function(err, driver){
            if (driver.result.n == 0) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "Driver");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "delete from", "Driver", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json({"message" : "Driver Deleted"});
            }
        });
    });

module.exports = router;