import Joi from "joi";

const schemaValidator = Joi.object({
  username: Joi.string().min(5).max(19).required(),

  email: Joi.string().email().lowercase().required(),

  password: Joi.string().min(8).max(19)
    .regex(/[a-zA-Z0-9]{3,30}/)
    .required(),

  firstName: Joi.string().min(3).max(20).required(),

  lastName: Joi.string().min(3).max(20).required(),
});

export default schemaValidator;