const Joi = require("joi");

exports.reviewValid = (_bodyValid) => {
  let joiSchema = Joi.object({
    rate: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(0).max(500),
    event_id:Joi.string().min(0).max(500),
    user_id:Joi.string().min(0).max(500),
  })
  return joiSchema.validate(_bodyValid);
}