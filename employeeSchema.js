const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
    position: Joi.string().required(),
    department: Joi.string().required(),
    salary: Joi.number().required(),
});

const updateItemschema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().optional(),
    createdAt: Joi.string().optional(),
    position: Joi.string().optional(),
    department: Joi.string().optional(),
    salary: Joi.number().optional(),
});


exports.createEmployBodyValidate = (inputData) => {
    return schema.validate(inputData);
};

exports.updateEmployBodyValidate = (inputData) => {
    return updateItemschema.validate(inputData);
};