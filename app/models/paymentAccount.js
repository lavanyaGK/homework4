/** 
 * Mongoose Schema for the Entity PaymentAccount
 * @author Clark Jeria
 * @version 0.0.1
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentAccountSchema   = new Schema({
    accountType: {type: String, maxlength:18, required:true},
    accountNumber: {type: Number, maxlength:18, required:true},
    expirationDate: {type: Date},
    nameOnAccount: {type: String, maxlength:18, required:true},
    bank: {type: String, maxlength:18}
});

module.exports = mongoose.model('PaymentAccount', PaymentAccountSchema);
