const AWS = require('aws-sdk');
const { updateEmployBodyValidate } = require("../../employeeSchema");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const { error } = updateEmployBodyValidate(data);
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return {
      statusCode: 422,
      body: JSON.stringify(errorMessages),
    };
  }
  const updateItem = event.pathParameters?.id;
  let updateExpression = 'set ';
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};

    if (data.name) {
        updateExpression += '#name = :name, ';
        ExpressionAttributeNames['#name'] = 'name';
        ExpressionAttributeValues[':name'] = data.name;
    }

    const optionalAttributes = ['position', 'age', 'department', 'salary', 'createdAt'];
    optionalAttributes.forEach(attr => {
        if (data.hasOwnProperty(attr)) {
            updateExpression += `#${attr} = :${attr}, `;
            ExpressionAttributeNames[`#${attr}`] = attr;
            ExpressionAttributeValues[`:${attr}`] = data[attr];
        }
    });

    updateExpression = updateExpression.slice(0, -2);

    const params = {
        TableName: 'employee-table',
        Key: { id: updateItem },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    };

  try {
    const result = await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item updated successfully', updatedAttributes: result.Attributes }),
    };
  } catch (dbError) {
    console.error('Error updating item in DynamoDB', dbError);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update item in DynamoDB', error: dbError }),
    };
  }
};