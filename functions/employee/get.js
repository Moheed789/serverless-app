const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Hello, anwar');

    try {
        const res = await dynamodb.scan({ TableName: "employee-table" }).promise();
        console.log(JSON.stringify(res));
    
        return {
            statusCode: 200,
            body: JSON.stringify(res.Items)
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }    
};
