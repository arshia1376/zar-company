const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const validateCreateAdmin = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string(),
        adminUsername: Joi.string().required(),
        adminPassword: Joi.string().required(),
        accessLevel: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        code: Joi.string().required(),
        date: Joi.string().required(),

    });
    return schema.validate(data);
};

const validateCreateDate = (data) => {
    const schema = Joi.object({
        date: Joi.string().required(),

    });
    return schema.validate(data);
};

const validateCreateMaterials = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateCreateFormDynamic = (data) => {
    const schema = Joi.object({
        name:Joi.string(),
        label:Joi.string(),
        value:Joi.string(),
        placeholder:Joi.string(),
        type:Joi.number(),
        pattern:Joi.string(),
        min:Joi.number(),
        max:Joi.number(),
        fieldOptions:Joi.string(),
        field:Joi.string(),
        arrange:Joi.number(),
        step:Joi.number(),
        required:Joi.boolean(),
        checkExistUrl:Joi.string(),
    });
    return schema.validate(data);
};

const loginValidator = (data) => {
    const schema = Joi.object({
        userName: Joi.string(),
        password: Joi.string(),
    });
    return schema.validate(data)
}

module.exports={validateCreateAdmin,validateCreateMaterials,loginValidator,validateCreateFormDynamic,validateCreateDate}