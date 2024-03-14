const AWS = require("aws-sdk");
const { createEmployBodyValidate } = require("../../employeeSchema");
const {v4: uuidv4} = require("uuid");
const dayjs = require("dayjs");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Hello, moheed');

    try {
        let reqData = JSON.parse(event.body);
        let date = dayjs().unix();
        let { error, value } = createEmployBodyValidate(reqData);
    
        if (error) {
          const errorMessages = error.details.map((detail) => detail.message);
          return {
            statusCode: 422,
            body: JSON.stringify(errorMessages),
          };
        }
    
        const employeeId = uuidv4();
    
        await dynamodb
          .put({
            TableName: "employee-table",
            Item: {
              id: employeeId,
              createdAt: date,
              updatedAt: date,
              ...value,
            },
          })
          .promise();
    
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Employee created successfully", id: employeeId }),
        };
      } catch (error) {
        console.log(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal Server Error" }),
        };
      }
};