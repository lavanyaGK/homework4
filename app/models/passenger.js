/** 
 * Mongoose Schema for the Entity Passenger
 * @author Clark Jeria
 * @version 0.0.2
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PassengerSchema   = new Schema({
    firstName: { type: String, minlength: 1, maxlength: 15 },
    lastName: { type: String, minlength: 1, maxlength: 15 },
    emailAddress: { type: String, validate: /[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/, required: true },
    password: { type: String, minlength: 8, maxlength: 16, required: true },
    addressLine1: { type: String, maxlength: 50 },
    addressLine2: { type: String, maxlength: 50 },
    city: { type: String, maxlength: 50 },
    state: { type: String, minlength: 2, maxlength: 2 },
    zip: { type: String, minlength: 5, maxlength: 5, validate: /[0-9]{5}/ },
    phoneNumber: { type: String, validate: /[0-9]{3}\-[0-9]{3}\-[0-9]{4}/, required: true }
});

module.exports = mongoose.model('Passenger', PassengerSchema);