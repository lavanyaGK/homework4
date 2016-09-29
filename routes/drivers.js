/** 
 * Express Route: /Drivers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var eCodes = require('../app/CustomError');
var Driver = require('../app/models/driver');

function validateRequest(req,res) {
    var keyValue = [];
    Driver.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    for (var key in keyValue) {
        var kv = keyValue[key];
        // validate the key property
        if (!(kv in req.body)) {
            var errorObj = eCodes['1004'];
            errorObj.errorMessage = util.format(errorObj.errorMessage, "Driver", kv);
            res.status(eCodes['1004'].statusCode).send(errorObj);
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
    .get(function(req, res){
        Driver.find(function(err, drivers){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(drivers);
            }
        });
    })
    /**
     * POST call for the Driver entity.
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if(validateRequest(req,res)!=1)
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

        driver.save(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(201).json({"message" : "Driver Created", "DriverCreated" : driver});
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
        Driver.findById(req.params.driver_id, function(err, Driver){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(Driver);
            }
        });  
    })
    /**
     * PATCH call for the Driver entity (single).
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        if(validateRequest(req,res)!=1)
            return;

        Driver.findById(req.params.Driver_id, function(err, driver){
            if(err){
                res.status(500).send(err);
            }else{
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

                Driver.save(function(err){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.json({"message" : "Driver Updated", "DriverUpdated" : Driver});
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
            _id : req.params.Driver_id
        }, function(err, Driver){
            if(err){
                res.status(500).send(err);
            }else{
                res.json({"message" : "Driver Deleted"});
            }
        });
    });

module.exports = router;