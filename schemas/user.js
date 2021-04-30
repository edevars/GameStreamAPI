const joi = require('@hapi/joi')

const userIdModel = joi.string().regex(/^[0-9a-fA-F]{24}/);

const createdUser = {
  email: joi
    .string()
    .email()
    .required(),
  password: joi.string().required(),
};

module.exports = { userIdModel, createdUser };
