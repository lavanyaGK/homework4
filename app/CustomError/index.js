
var ecodes = {
    1001 : {
        "statusCode" : 400,
        "errorCode" : 1001,
        "errorMessage" : "Invalid resource, %s, given"
    },
    1002 : {
        "statusCode" : 400,
        "errorCode" : 1002,
        "errorMessage" : "Invalid Identifier for resource, %s, Resource Instance Not Found"
    },
    1003 : {
        "statusCode" : 400,
        "errorCode" : 1003,
        "errorMessage" : "Invalid Property %s for resource, %s,  given"
    },
    1004 : {
        "statusCode" : 422,
        "errorCode" : 1004,
        "errorMessage" : "Error while trying to insert resource, %s, into the database. Missing Required Properties: %s"
    },
    1005 : {
        "statusCode" : 500,
        "errorCode" : 1005,
        "errorMessage" : "Database Error while trying to %s resource, %s: %s"
    },
    1007 : {
        "statusCode" : 400,
        "errorCode" : 1007,
        "errorMessage" : "Error while inserting an instance of the resource, %s, to database, duplicate %s found"
    },
    1008 : {
        "statusCode" : 400,
        "errorCode" : 1008,
        "errorMessage" : "Error while updating resource, %s, no valid property in the POST request"
    },
    1009 : {
        "statusCode" : 400,
        "errorCode" : 1009,
        "errorMessage" : "Invalid property value error for %s : %s"
    },
    2001 : {
        "statusCode" : 401,
        "errorCode" : 2001,
        "errorMessage" : "Ride has not started yet, current status: %s"
    },
    2002 : {
        "statusCode" : 501,
        "errorCode" : 2002,
        "errorMessage" : "Internal error, Ride route is empty"
    }
};

module.exports = ecodes;
