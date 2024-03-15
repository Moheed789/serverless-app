const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Executing query with specific department');

    const employeeDepartment = event.queryStringParameters.department;

    console.log("Department", employeeDepartment);

    try {
        const attributeName = "department";

        const params = {
            TableName: "employee-table",
            FilterExpression: '#attrName = :attrValue',
            ExpressionAttributeNames: {
                '#attrName': attributeName
            },
            ExpressionAttributeValues: {
                ':attrValue': employeeDepartment
            }
        };

        const res = await dynamodb.scan(params).promise();

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
