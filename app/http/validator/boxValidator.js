const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validateCreatebox = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        weight: Joi.string().required(),

    });
    return schema.validate(data);
};

module.exports={validateCreatebox}