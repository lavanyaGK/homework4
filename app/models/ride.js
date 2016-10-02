/** 
 * Mongoose Schema for the Entity Ride
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Passenger    = require('../models/passenger');
var Driver       = require('../models/driver');
var Car          = require('../models/car');

var RideSchema   = new Schema({
    /**
     * Here you need to add the rides properties
     * - passenger (reference, Required)
     * - driver (reference, Required)
     * - car (reference, Required)
     * - rideType (String, [ECONOMY, PREMIUM, EXECUTIVE], Required)
     * - startPoint  Object (lat: Decimal, long: Decimal) (latitude/longitude combination, Required)
     * - endPoint Object (lat: Decimal, long: Decimal) (latitude/longitude combination, Required)
     * - requestTime (Number, TimeStamp, Required)
     * - pickupTime (Number, TimeStamp, Required)
     * - dropOffTime (Number, TimeStamp, Required)
     * - status (String, [REQUESTED, AWAITING_DRIVER, DRIVE_ASSIGNED, IN_PROGRESS, ARRIVED, CLOSED], Required)
     * - fare (Number)
     * - route (series of latitude/longitude values)
     */
     passenger : { type: Schema.Types.ObjectId, ref: 'Passenger', required:true },
     driver : { type: Schema.Types.ObjectId, ref: 'Driver', required:true },
     car : { type: Schema.Types.ObjectId, ref: 'Car', required:true },
     rideType : { type: String, enum : ['ECONOMY', 'PREMIUM', 'EXECUTIVE'], required:true },
     startPoint : {
        type :
            {
                lat: { type: Number, required: true },
                long: { type: Number, required: true}
            },
        required:true },
     endPoint : {
        type :
            {
                lat: { type: Number, required: true },
                long: { type: Number, required: true }
            },
        required:true },
     requestTime : { type: Number, default: (new Date()).getTime(), required:true },
     pickUpTime : { type: Number, default: (new Date()).getTime(), required:true },
     dropOffTime : { type: Number, default: (new Date()).getTime(), required:true },
     status : {
         type: String, 
         enum : ['REQUESTED', 'AWAITING_DRIVER', 'DRIVE_ASSIGNED', 'IN_PROGRESS', 'ARRIVED', 'CLOSED'], 
         required:true
     },
     fare : Number,
     route : [{
        lat : Number,
        long : Number
     }]
});

module.exports = mongoose.model('Ride', RideSchema);

RideSchema.path('driver').validate(function (value, respond) {
    Driver.findOne({_id: value}, function (err, doc) {
        if (err || !doc) {
            respond(false);
        } else {
            respond(true);
        }
    });
}, 'Invalid reference to driver');

RideSchema.path('passenger').validate(function (value, respond) {
    Passenger.findOne({_id: value}, function (err, doc) {
        if (err || !doc) {
            respond(false);
        } else {
            respond(true);
        }
    });

}, 'Invalid reference to passenger');

RideSchema.path('car').validate(function (value, respond) {
    Car.findOne({_id: value}, function (err, doc) {
        if (err || !doc) {
            respond(false);
        } else {
            respond(true);
        }
    });

}, 'Invalid reference to car');