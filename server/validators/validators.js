const Joi = require("joi");

const userValidator = Joi.object(
    {
        name: Joi.string().required(),
        password: Joi.string().required()
    }
).required();
const messageValidator = Joi.object(
    {
        message: Joi.string().required(),
        date: Joi.string().required(),
        ownerId: Joi.string().required(),
    }
)
module.exports.userValidator = userValidator;
module.exports.messageValidator = messageValidator;