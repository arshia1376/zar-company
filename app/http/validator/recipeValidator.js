const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validateRecipe = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),

    });
    return schema.validate(data);
};

const validateRecipeBox = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        boxType: Joi.string().required(),

    });
    return schema.validate(data);
};

const validateRecipeMaterial = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        boxType: Joi.string().required(),

    });
    return schema.validate(data);
};

module.exports={validateRecipe,validateRecipeBox,validateRecipeMaterial}