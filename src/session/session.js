const AWS = require('aws-sdk');
const dateFormat = require('dateformat');
AWS.config.update({region: 'eu-west-2'});

module.exports.createSession = ({pairs, id}) => {
    const ttl = Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000)
    const dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    const params = {
        TableName: 'sessionsTable',
        Item: {
            'sessionId': {S: id},
            'pairs': {S: JSON.stringify(pairs)},
            'createdAt': {S: dateFormat(new Date(), "yyyy-mm-dd HH:MM")},
            'ttl': {N: ttl.toString()}
        }
    };
    let statusCode = 500
    return dynamoDB.putItem(params).promise()
        .then(result => {
            statusCode = 200
            return result
        }).catch(error => {
            statusCode = 400
            return error
        }).then(response => {
            return {
                statusCode: statusCode,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({response: response})
            };
        })
}

module.exports.getSession = sessionId => {
    const dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    const params = {
        TableName: 'sessionsTable',
        Key: {
            'sessionId': {S: sessionId}
        }
    };

    let statusCode = 500
    return dynamoDB.getItem(params).promise()
        .then(result => {
            statusCode = 200
            return result.Item
        }).catch(error => {
            statusCode = 400
            return error
        }).then(response => {
            return {
                statusCode: statusCode,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({response: response})
            };
        })
}