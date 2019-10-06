'use strict';
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get band.
 */
exports.getBand = async (event, context) => {

    let responseBody = "";
    let statusCode = 0;

    const { bandid } = event.pathParameters;

    const params = {
        TableName: "Bands",
        FilterExpression: "id = :i",
        ExpressionAttributeValues:
        {
            ":i": parseInt(bandid)
        }
    };

    try {
        const data = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(data.Items);
        statusCode = 200;
    } catch(err) {
        responseBody = `Unable to find band information: ${err}`;
        statusCode = 404;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*"
        },
        body: responseBody
    };

    return response;
};

/**
 * Get all bands.
 */
exports.getAllBands = async (event, context) => {

    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "Bands"
    };

    try {
        const data = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(data.Items);
        statusCode = 200;
    } catch(err) {
        responseBody = `Unable to find band information: ${err}`;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*"
        },
        body: responseBody
    };

    return response;
};

/**
 * Post band.
 */
exports.postBand = async (event, context) => {
    
    let responseBody;
    let statusCode;
    let response;

    const { band_name, genre } = JSON.parse(event.body);

    await postEntry(band_name, genre)
        .then(data => {
            statusCode = 201;
            responseBody = data;
        })
        .catch(err => {
            statusCode = 400;
            responseBody = err;
        });

    response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*"
        },
        body: responseBody
    };

    return response;
};

/**
 * Post entry.
 * 
 * @param {} band_name 
 * @param {*} genre 
 */
function postEntry(band_name, genre) {
    return new Promise(async function(resolve, reject) {
        
        getNextId()
            .then( async function(id) {

                var params = {
                    TableName: "Bands",
                    Key: {
                        id: id,
                    },
                    UpdateExpression: "set band_name = :n, genre = :g",
                    ExpressionAttributeValues: {
                        ":n": band_name,
                        ":g": genre
                    },
                    ReturnValues: "ALL_NEW"
                };
                
                try {
                    const data = await documentClient.update(params).promise();
                    resolve(JSON.stringify(data.Attributes));
                } catch(err) {
                    reject(`Unable to create band information: ${err}`);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};

/**
 * Get next id.
 */
function getNextId() {
    return new Promise(async function(resolve, reject) {
        
        let nextId = 0;
        const params = {
            TableName: "Bands"
        };

        try {
            const bands = await documentClient.scan(params).promise();

            bands.Items.forEach(band => {
                if (band.id > nextId)
                {
                    nextId = band.id;
                }
            });

            nextId++;

            resolve(nextId);
        } catch(err) {
            reject(`Unable to define band identifier: ${err}`); 
        }
    });
};

/**
 * Put band.
 */
exports.putBand = async (event, context) => {

    let responseBody = "";
    let statusCode = 0;

    const { bandid } = event.pathParameters;

    const { band_name, genre } = JSON.parse(event.body);

    const params = {
        TableName: "Bands",
        Key: {
            id: parseInt(bandid)
        },
        UpdateExpression: "set band_name = :n, genre = :g",
        ExpressionAttributeValues: {
            ":n": band_name,
            ":g": genre
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const data = await documentClient.update(params).promise();
        responseBody = JSON.stringify(data.Attributes);
        statusCode = 200;
    } catch(err) {
        responseBody = `Unable to update band information: ${err}`;
        statusCode = 400;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*"
        },
        body: responseBody
    };

    return response;
};

/**
 * Delete band.
 */
exports.deleteBand = async (event, context) => {

    let responseBody = "";
    let statusCode = 0;

    const { bandid } = event.pathParameters;

    const params = {
        TableName: "Bands",
        Key: {
            id: parseInt(bandid)
        }
    };

    try {
        const data = await documentClient.delete(params).promise();
        responseBody = JSON.stringify(data);
        statusCode = 204;
    } catch(err) {
        responseBody = `Unable to delete band information: ${err}`;
        statusCode = 404;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-origin": "*"
        },
        body: responseBody
    };

    return response;
};