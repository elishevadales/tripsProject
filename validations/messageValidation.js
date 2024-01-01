const Joi = require("joi");

exports.messageValid = (_bodyValid) => {
  let joiSchema = Joi.object({
    text:  Joi.string().min(0).max(5000),
    img_url: Joi.string().min(0).max(500)
  })
  return joiSchema.validate(_bodyValid);
}