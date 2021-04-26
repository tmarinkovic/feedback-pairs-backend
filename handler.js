const session = require('./src/session/session');

module.exports.session = async (event) => {
    switch (event.httpMethod) {
        case 'GET':
            return session.getSession(event.pathParameters.sessionId)
        case 'PUT':
            const body = JSON.parse(event.body)
            return session.createSession(body)
        default:
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*"
                }
            };
    }
};

module.exports.sessionCleaner = async () => {
    session.deleteOldSessions()
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*"
        }
    };
};