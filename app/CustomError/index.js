
var ecodes = {
    1001 : {
        "statusCode" : 400,
        "errorCode" : 1001,
        "errorMessage" : "Invalid resource name %s given"
    },
    1002 : {
        "statusCode" : 400,
        "errorCode" : 1002,
        "errorMessage" : "Invalid Indentifier for resource name %s given, Resource Not Found"
    },
    1003 : {
        "statusCode" : 400,
        "errorCode" : 1003,
        "errorMessage" : "Invalid Property %s for resource name %s given"
    },
    1004 : {
        "statusCode" : 400,
        "errorCode" : 1004,
        "errorMessage" : "Error while trying to insert resource name %s into the database, Missing Required Parameters '%s'"
    },
    1005 : {
        "statusCode" : 400,
        "errorCode" : 1005,
        "errorMessage" : "Error while trying to read resource name %s from the database, Resource Not Found"
    },
    1006 : {
        "statusCode" : 400,
        "errorCode" : 1006,
        "errorMessage" : "Error while trying to delete resource %s from the database"
    },
    1007 : {
        "statusCode" : 400,
        "errorCode" : 1007,
        "errorMessage" : "Error while inserting resource name %s to database, duplicate object"
    },
    1008 : {
        "statusCode" : 400,
        "errorCode" : 1008,
        "errorMessage" : "Error while updating resource name {0}"
    },
};

module.exports = ecodes;