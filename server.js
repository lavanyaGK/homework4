/** 
 * Example of RESTful API using Express and NodeJS
 * @author Clark Jeria
 * @version 0.0.2
 */

/** BEGIN: Express Server Configuration */
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var eCodes = require("./app/CustomError");
var util = require('util');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose    = require('mongoose');
mongoose.connect('mongodb://lav:lav123@ds041546.mlab.com:41546/cmu_sv_app');
/** END: Express Server Configuration */

/** BEGIN: Express Routes Definition */
var router = require('./routes/router');
var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var passengers = require('./routes/passengers');

app.use('/api', cars);
app.use('/api', drivers);
app.use('/api', passengers);
app.use('/api', router);
/** END: Express Routes Definition */

app.use('/api/:resourcename', function(req, res, next){
    //No resource found error
    res.status(eCodes["1001"].statusCode);
    var errorObj = eCodes["1001"];
    errorObj.errorMessage = util.format(errorObj.errorMessage, req.params.resourcename);
    res.send(errorObj);
});

/** BEGIN: Express Server Start */
app.listen(port);
console.log('Service running on port ' + port);

module.exports = app;
/** END: Express Server Start */