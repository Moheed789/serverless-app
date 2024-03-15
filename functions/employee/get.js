const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Executing query with specific department');

    const employeeDepartment = event.queryStringParameters.department;

    console.log("Department", employeeDepartment);

    try {
        const params = {
            TableName: "employee-table",
            IndexName: "employee-index",
            KeyConditionExpression: "#department = :departmentValue",
            ExpressionAttributeNames: {
                "#department": 'department',
            },
            ExpressionAttributeValues: {
                ":departmentValue": employeeDepartment,
            }
        };

        const res = await dynamodb.query(params).promise();
        console.log(JSON.stringify(res.Items));
    
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
