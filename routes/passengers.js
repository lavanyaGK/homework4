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

function validateRequest(req,res) {
    var keyValue = [];
    Passenger.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    for (var key in keyValue) {
        var kv = keyValue[key];
        // validate the key property
        if (!(kv in req.body)) {
            var errorObj = eCodes['1004'];
            errorObj.errorMessage = util.format(errorObj.errorMessage, "Passenger", kv);
            res.status(eCodes['1004'].statusCode).send(errorObj);
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
        Passenger.find(function(err, Passengers){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(Passengers);
            }
        });
    })
    /**
     * POST call for the Passenger entity.
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if(validateRequest(req,res)!=1)
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

        passenger.save(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(201).json({"message" : "Passenger Created", "PassengerCreated" : passenger});
            }
        });
    });

/** 
 * Express Route: /Passengers/:Passenger_id
 * @param {string} Passenger_id - Id Hash of Passenger Object
 */
router.route('/passengers/:passenger_id')
    /**
     * GET call for the Passenger entity (single).
     * @returns {object} the Passenger with Id Passenger_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(passenger);
            }
        });  
    })
    /**
     * PATCH call for the Passenger entity (single).
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        if(validateRequest(req,res)!=1)
            return;

        Passenger.findById(req.params.Passenger_id, function(err, passenger){
            if(err){
                res.status(500).send(err);
            }else{
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

                passenger.save(function(err){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.json({"message" : "Passenger Updated", "PassengerUpdated" : passenger});
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
        }, function(err, Passenger){
            if(err){
                res.status(500).send(err);
            }else{
                res.json({"message" : "Passenger Deleted"});
            }
        });
    });

module.exports = router;