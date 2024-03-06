const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Hello, moheed');

    try {
        const deleteToItem = event.pathParameters?.id;

        const params = {
            TableName: 'employee-table',
            Key: {
                id: deleteToItem
            }
        };

        try {
            await dynamodb.delete(params).promise();
            console.log("Item deleted successfully");

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Item Deleted Successfully"
                })
            };
        } catch (error) {
            console.log("Item not deleted");
            console.error('Error deleting item from DynamoDB:', error);

            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to delete item from DynamoDB',
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
