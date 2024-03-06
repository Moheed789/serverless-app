const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Hello, moheed');

    try {
        const getItem = event.pathParameters?.id;

        const params = {
            TableName: 'employee-table',
            Key: {
                id: getItem
            }
        };

        try {
            const res = await dynamodb.get(params).promise();
            console.log("Item get successfully");

            return {
                statusCode: 200,
                body: JSON.stringify(res.Item)
            };
        } catch (error) {
            console.log("Item not found");
            console.error('Error get item from DynamoDB:', error);

            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to get item from DynamoDB',
                    error: error
                })
            };
        }
    } catch (err) {
        console.error('Error processing request:', err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to process request',
                error: err
            })
        };
    }
};
