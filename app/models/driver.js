/** 
 * Mongoose Schema for the Entity Driver
 * @author Clark Jeria
 * @version 0.0.2
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

/*
drivers
firstName (String, 1-15)
lastName (String, 1-15)
emailAddress (Reegex /[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*\/ , Required)
password (Used for POST only, String, 8-16, Required - No constraints, Store clear text)
addressLine1 (String, 50)
addressLine2 (String, 50)
city (String, 50)
state (Stringm 2)
zip (String, 5)
phoneNumber (String, Regex XXX-XXX-XXXX, Required)
drivingLicense (String, 8-16, Required)
licensedState (String, 2, Required)
*/
var DriverSchema   = new Schema({
    firstName: { type: String, minlength: 1, maxlength: 15 },
    lastName: { type: String, minlength: 1, maxlength: 15 },
    emailAddress: { type: String, validate: /[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/, required: true },
    password: { type: String, minlength: 8, maxlength: 16, required: true },
    addressLine1: { type: String, maxlength: 50 },
    addressLine2: { type: String, maxlength: 50 },
    city: { type: String, maxlength: 50 },
    state: { type: String, minlength: 2, maxlength: 2 },
    zip: { type: String, minlength: 5, maxlength: 5, validate: /[0-9]{5}/ },
    phoneNumber: { type: String, validate: /[0-9]{3}\-[0-9]{3}\-[0-9]{4}/, required: true },
    drivingLicense: { type: String, minlength: 8, maxlength: 16, required: true },
    licensedState: { type: String, minlength: 2, maxlength: 2, required: true }
});

module.exports = mongoose.model('Driver', DriverSchema);