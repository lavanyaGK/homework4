/** 
 * Mongoose Schema for the Entity Car
 * @author Clark Jeria
 * @version 0.0.2
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Driver = require('../models/driver');

/*
driver (reference)
make (String, 18)
model (Sring, 18)
license (String, 10)
doorCount (Number 1-8)
*/
var CarSchema   = new Schema({
    license: { type: String, maxlength: 10, unique: true, required: true },
    make: { type: String, maxlength: 18, required: true },
    model: { type: String, maxlength: 18, required: true },
    doorCount: { type: Number, min:1, max:8, required: true},
    driver : { type: Schema.Types.ObjectId, ref: 'Driver', required:true}
});

module.exports = mongoose.model('Car', CarSchema);

/*
CarSchema.path('driver').validate(function (value, respond) {
    Driver.findOne({_id: value}, function (err, doc) {
        if (err || !doc) {
            respond(false);
        } else {
            respond(true);
        }
    });

}, 'Invalid reference to driver');
*/
