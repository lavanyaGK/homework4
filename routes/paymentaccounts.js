/** 
 * Express Route: /paymentaccounts
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var PaymentAccount = require('../app/models/paymentaccount');
var eCodes = require('../app/CustomError');
var requiredFields = ["accountType", "accountNumber", "nameOnAccount"];

function validateRequest(req, res, isUpdate) {
    var keyValue = [];
    PaymentAccount.schema.eachPath(function(path) {
        if(path!='_id' && path!='__v')
            keyValue.push(path);
    });
    var hasOneValidProperty = false;
    for (var key in req.body) {
        // Check if the key property in the request is a valid one.
        if (keyValue.indexOf(key) == -1) {
            var errorObj = Object.assign({}, eCodes['1003']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, key, "PaymentAccounts");
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
        errorObj.errorMessage = util.format(errorObj.errorMessage, "PaymentAccount");
        res.status(errorObj.statusCode).send(errorObj);
        return 0;
    }
    return 1;
}

function validateRequiredFields(req, res) {
    for (var key in requiredFields) {
        if (!req.body[requiredFields[key]]) {
            var errorObj = Object.assign({}, eCodes['1004']);
            errorObj.errorMessage = util.format(errorObj.errorMessage, "PaymentAccount", requiredFields[key]);
            res.status(errorObj.statusCode).send(errorObj);
            return 0;
        }
    }
    return 1;
}

router.route('/paymentaccounts') 
    /**
     * GET call for the paymentAccount entity (multiple).
     * @returns {object} A list of paymentAccounts. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        PaymentAccount.find(function(err, paymentAccounts){
            if(err){
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "PaymentAccount", err);
                res.status(errorObj.statusCode).send(errorObj);
            }else{
                res.json(paymentAccounts);
            }
        });
    })
    /**
     * POST call for the paymentAccount entity.
     * @param {string} accountType - The account type of the new paymentAccount
     * @param {integer} accountNumber - The account number of the new paymentAccount
     * @param {date} expirationDate - The expiration date of the new paymentAccount
     * @param {string} nameOnAccount - The name on account of the new paymentAccount
     * @param {string} bank - The bank of the new paymentAccount
     * @returns {object} A message and the paymentAccount created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if (validateRequest(req, res, false) != 1 || validateRequiredFields(req, res) != 1)
            return;

        var paymentAccount = new PaymentAccount();
        paymentAccount.accountType = req.body.accountType;
        paymentAccount.accountNumber = req.body.accountNumber;
        paymentAccount.expirationDate = req.body.expirationDate;
        paymentAccount.nameOnAccount = req.body.nameOnAccount;
        paymentAccount.bank = req.body.bank;

        paymentAccount.save(function(err){
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "insert into", "PaymentAccount", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.status(201).json({"message" : "PaymentAccount Created", "paymentAccountCreated" : paymentAccount});
            }
        });
    });

/** 
 * Express Route: /paymentaccounts/:paymentaccount_id
 * @param {string} paymentaccount_id - Id Hash of PaymentAccount Object
 */
router.route('/paymentaccounts/:paymentaccount_id')
    /**
     * GET call for the paymentAccount entity (single).
     * @returns {object} the paymentaccount with Id paymentaccount_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){        
        /**
         * Add extra error handling rules here
         */
        PaymentAccount.findById(req.params.paymentaccount_id, function(err, paymentAccount){
            if (!paymentAccount) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "PaymentAccount");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "read from", "PaymentAccount", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                res.json(paymentAccount);
            }
        });
    })
    /**
     * PATCH call for the paymentAccount entity (single).
     * @param {string} accountType - The account type of the new paymentAccount
     * @param {integer} accountNumber - The account number of the new paymentAccount
     * @param {date} expirationDate - The expiration date of the new paymentAccount
     * @param {string} nameOnAccount - The name on account of the new paymentAccount
     * @param {string} bank - The bank of the new paymentAccount
     * @returns {object} A message and the paymentAccount created. (201 Status Code)
     * @returns {object} A message and the paymentaccount updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        if (validateRequest(req, res, true) != 1)
            return;
        /**
         * Add aditional error handling here
         */

        PaymentAccount.findById(req.params.paymentaccount_id, function(err, paymentaccount){
            if(err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "update", "PaymentAccount", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else {
                if (!paymentaccount) {
                    var errorObj = Object.assign({}, eCodes['1002']);
                    errorObj.errorMessage = util.format(errorObj.errorMessage, "PaymentAccount");
                    res.status(errorObj.statusCode).send(errorObj);
                    return;
                }
                if (req.body.accountType)
                    paymentaccount.accountType = req.body.accountType;
                if (req.body.accountNumber)
                    paymentaccount.accountNumber = req.body.accountNumber;
                if (req.body.expirationDate)
                    paymentaccount.expirationDate = req.body.expirationDate;
                if (req.body.nameOnAccount)
                    paymentaccount.nameOnAccount = req.body.nameOnAccount;
                if (req.body.bank)
                    paymentaccount.bank = req.body.bank;

                paymentaccount.save(function(err){
                    if (err) {
                        var errorObj = Object.assign({}, eCodes['1005']);
                        errorObj.errorMessage = util.format(errorObj.errorMessage, "update", "PaymentAccount", err);
                        res.status(errorObj.statusCode).send(errorObj);
                    } else {
                        res.json({"message" : "PaymentAccount Updated", "PaymentAccountUpdated" : PaymentAccount});
                    }
                });
            }
        });
    })

    /**
     * DELETE call for the paymentaccount entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){  
        /**
         * Add extra error handling rules here
         */
        PaymentAccount.remove({
            _id : req.params.paymentaccount_id
        }, function(err, paymentaccount){
            if (paymentaccount.result.n == 0) {
                var errorObj = Object.assign({}, eCodes['1002']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "PaymentAccount");
                res.status(errorObj.statusCode).send(errorObj);
                return;
            }
            if (err) {
                var errorObj = Object.assign({}, eCodes['1005']);
                errorObj.errorMessage = util.format(errorObj.errorMessage, "delete from", "PaymentAccount", err);
                res.status(errorObj.statusCode).send(errorObj);
            } else{
                res.json({"message" : "PaymentAccount Deleted"});
            }
        });
    });

module.exports = router;